// src/utils/colorUtils.js

const MODERATE_COLORS = [
    '#98A1BC',
    '#77BEF0',
    '#FFCB61',
    '#ABDDBC',
    '#FFB4B4',
];

export const getRandomModerateColor = () => {
    const randomIndex = Math.floor(Math.random() * MODERATE_COLORS.length);
    return MODERATE_COLORS[randomIndex];
};