/**
 * Color Utilities for Lottie Color Editor
 * Handles conversion between Lottie color format and hex
 */

/**
 * Convert Lottie color format [0-1, 0-1, 0-1, alpha] to hex #RRGGBB
 * @param {number[]} lottieColor - Array of 3-4 numbers in 0-1 range
 * @returns {string} Hex color string like "#ff8000"
 */
export function lottieToHex(lottieColor) {
    if (!lottieColor || lottieColor.length < 3) {
        return '#000000';
    }

    const r = Math.round(Math.min(1, Math.max(0, lottieColor[0])) * 255);
    const g = Math.round(Math.min(1, Math.max(0, lottieColor[1])) * 255);
    const b = Math.round(Math.min(1, Math.max(0, lottieColor[2])) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Convert hex color #RRGGBB to Lottie format [0-1, 0-1, 0-1, 1]
 * @param {string} hex - Hex color string like "#ff8000"
 * @returns {number[]} Array of 4 numbers in 0-1 range
 */
export function hexToLottie(hex) {
    // Remove # if present
    const cleanHex = hex.replace('#', '');

    const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
    const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
    const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

    return [r, g, b, 1];
}

/**
 * Navigate to a path in an object and get the value
 * Supports paths like "layers[0].shapes[1].it[2].c.k"
 * @param {object} obj - The object to navigate
 * @param {string} path - The path string
 * @returns {*} The value at the path, or undefined
 */
export function getValueAtPath(obj, path) {
    if (!obj || !path) return undefined;

    const parts = parsePath(path);
    let current = obj;

    for (const part of parts) {
        if (current === undefined || current === null) {
            return undefined;
        }
        current = current[part];
    }

    return current;
}

/**
 * Navigate to a path in an object and set a value
 * @param {object} obj - The object to modify
 * @param {string} path - The path string
 * @param {*} value - The value to set
 * @returns {boolean} True if successful
 */
export function setValueAtPath(obj, path, value) {
    if (!obj || !path) return false;

    const parts = parsePath(path);
    let current = obj;

    // Navigate to the parent of the target
    for (let i = 0; i < parts.length - 1; i++) {
        if (current === undefined || current === null) {
            console.error('Path navigation failed at:', parts[i]);
            return false;
        }
        current = current[parts[i]];
    }

    // Set the value
    const lastPart = parts[parts.length - 1];
    if (current !== undefined && current !== null) {
        current[lastPart] = value;
        return true;
    }

    return false;
}

/**
 * Parse a path string into an array of keys
 * "layers[0].shapes[1].it[2]" -> ["layers", 0, "shapes", 1, "it", 2]
 * @param {string} path - The path string
 * @returns {(string|number)[]} Array of keys and indices
 */
function parsePath(path) {
    const parts = [];
    const regex = /([^.\[\]]+)|\[(\d+)\]/g;
    let match;

    while ((match = regex.exec(path)) !== null) {
        if (match[1] !== undefined) {
            parts.push(match[1]);
        } else if (match[2] !== undefined) {
            parts.push(parseInt(match[2], 10));
        }
    }

    return parts;
}

/**
 * Deep clone an object (for undo/redo)
 * @param {object} obj - Object to clone
 * @returns {object} Deep cloned object
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
