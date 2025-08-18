// src/components/modals/ContentReorderModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, ListGroup, Button, Alert, Badge } from 'react-bootstrap';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import CustomButton from '../common/CustomButton.jsx';
import texts from '../../../i18n/texts.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

// --- Sortable Item Component ---
const SortableContentItem = ({ content }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: content?.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 'auto',
        opacity: isDragging ? 0.8 : 1,
        boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.2)' : '0 0.125rem 0.25rem rgba(0,0,0,.075)',
    };

    return (
        <ListGroup.Item
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`d-flex justify-content-between align-items-center py-3 px-4 mb-2 rounded-3 ${isDragging ? 'dragging-item' : ''
                }`}
        >
            <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faBars} className="me-3 text-muted drag-handle" {...listeners} />
                <span className="fw-bold">{content?.title}</span>
            </div>
            <Badge bg="secondary">Current Order: {content?.currentContentRelease?.orderIndex}</Badge>
        </ListGroup.Item>
    );
};

// --- Content Reorder Modal Component ---
const ContentReorderModal = ({ show, onHide, contents, onSave, isLoading }) => {
    const [items, setItems] = useState([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (contents) {
            setItems([...contents].sort((a, b) => (a?.currentContentRelease?.orderIndex || 0) - (b?.currentContentRelease?.orderIndex || 0)));
        }
    }, [contents]);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((currentItems) => {
                const oldIndex = currentItems.findIndex((item) => item?.id === active.id);
                const newIndex = currentItems.findIndex((item) => item?.id === over?.id);
                return arrayMove(currentItems, oldIndex, newIndex);
            });
        }
    };

    const handleSave = () => {
        const reorderPayload = items.map((item, index) => ({
            id: item?.id,
            orderIndex: index,
        }));
        console.log(reorderPayload);
        onSave?.(reorderPayload);
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{texts.sections?.reorderContentsModalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {contents?.length === 0 ? (
                    <Alert variant="info" className="text-center">No contents to reorder.</Alert>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items.map(item => item?.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <ListGroup className="reorder-list">
                                {items?.map((content) => (
                                    <SortableContentItem key={content?.id} content={content} />
                                ))}
                            </ListGroup>
                        </SortableContext>
                    </DndContext>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <CustomButton variant="primary" onClick={handleSave} isLoading={isLoading}>
                    {texts.sections?.saveOrder}
                </CustomButton>
            </Modal.Footer>
        </Modal>
    );
};

export default ContentReorderModal;