// src/components/modals/ModuleReorderModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Alert, Spinner, Badge } from 'react-bootstrap';
import {
    DndContext, // Main DND context provider
    closestCenter, // Collision detection algorithm
    KeyboardSensor, // For keyboard accessibility
    PointerSensor, // For mouse and touch
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove, // Helper to reorder arrays
    SortableContext, // Context for sortable items
    sortableKeyboardCoordinates, // Keyboard coordinates for sortable
    useSortable, // Hook for individual sortable items
    verticalListSortingStrategy, // Sorting strategy for vertical lists
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities'; // Utility for CSS transforms

import CustomButton from '../../common/CustomButton.jsx';
import texts from '../../../i18n/texts.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

// --- Sortable Item Component ---
// This component represents a single draggable/sortable module in the list
const SortableModuleItem = ({ module }) => {
    const {
        attributes,
        listeners,
        setNodeRef, // Ref to attach to the DOM node
        transform, // CSS transform for dragging
        transition, // CSS transition for smooth movement
        isDragging, // Boolean if item is currently being dragged
    } = useSortable({ id: module?.id }); // Unique ID for the draggable item

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 'auto', // Ensure dragged item is on top
        opacity: isDragging ? 0.8 : 1, // Slight opacity when dragging
        boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.2)' : '0 0.125rem 0.25rem rgba(0,0,0,.075)',
    };

    return (
        <ListGroup.Item
            ref={setNodeRef} // Attach the ref
            style={style}
            {...attributes} // Attributes for accessibility
            className={`d-flex justify-content-between align-items-center py-3 px-4 mb-2 rounded-3 ${isDragging ? 'dragging-item' : ''
                }`}
        >
            <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faBars} className="me-3 text-muted drag-handle" {...listeners} /> {/* Attach listeners to drag handle */}
                <span className="fw-bold">{module?.title}</span>
            </div>
            <Badge bg="secondary">Current Order: {module?.orderIndex}</Badge>
        </ListGroup.Item>
    );
};

// --- Module Reorder Modal Component ---
const ModuleReorderModal = ({ show, onHide, modules, onSaveOrder, isLoading }) => {
    const [items, setItems] = useState([]);

    // Setup DND sensors
    const sensors = useSensors(
        useSensor(PointerSensor), // For mouse and touch
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates, // For keyboard accessibility
        })
    );

    useEffect(() => {
        if (modules) {
            // Ensure items are sorted by their current orderIndex for initial display
            setItems([...modules].sort((a, b) => (a?.orderIndex || 0) - (b?.orderIndex || 0)));
        }
    }, [modules]);

    // Handle drag end event
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
        // Map the reordered items to the format expected by the API ({id, orderIndex})
        const reorderData = items.map((item, index) => ({
            id: item?.id,
            orderIndex: index, // New order index based on list position
        }));
        onSaveOrder?.(reorderData);
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{texts.sections?.reorderModulesModalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {modules?.length === 0 ? (
                    <Alert variant="info" className="text-center">No modules to reorder.</Alert>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items.map(item => item?.id)} // Pass only the IDs of sortable items
                            strategy={verticalListSortingStrategy}
                        >
                            <ListGroup className="reorder-list">
                                {items?.map((module) => (
                                    <SortableModuleItem key={module?.id} module={module} />
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

export default ModuleReorderModal;