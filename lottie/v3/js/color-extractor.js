/**
 * Lottie Color Extractor - P2 Simplified UI
 * Extracts all unique colors from a Lottie JSON file
 * By Gamal Eldien | tools.gamaleldien.com
 */

/**
 * Convert Lottie RGB values (0-1 range) to hex color
 * @param {number} r - Red (0-1)
 * @param {number} g - Green (0-1)
 * @param {number} b - Blue (0-1)
 * @returns {string} Hex color string (#RRGGBB)
 */
export function rgbToHex(r, g, b) {
    const toHex = (n) => {
        const clamped = Math.max(0, Math.min(1, n));
        const hex = Math.round(clamped * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Convert hex color to Lottie RGB values (0-1 range)
 * @param {string} hex - Hex color string (#RRGGBB)
 * @returns {number[]} Array of [r, g, b] values (0-1 range)
 */
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 0];
    return [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
    ];
}

/**
 * Check if an array looks like a Lottie color value
 * Lottie colors are arrays of 3-4 numbers in 0-1 range: [r, g, b] or [r, g, b, a]
 * @param {any} arr - Value to check
 * @returns {boolean}
 */
function isColorArray(arr) {
    if (!Array.isArray(arr)) return false;
    if (arr.length < 3 || arr.length > 4) return false;
    
    // All values should be numbers in 0-1 range
    for (let i = 0; i < Math.min(arr.length, 3); i++) {
        const val = arr[i];
        if (typeof val !== 'number') return false;
        if (val < 0 || val > 1) return false;
    }
    
    // Alpha channel (if present) should also be 0-1
    if (arr.length === 4 && (typeof arr[3] !== 'number' || arr[3] < 0 || arr[3] > 1)) {
        return false;
    }
    
    return true;
}

/**
 * Extract all colors from a Lottie JSON structure
 * Returns a registry of unique colors with their locations
 * 
 * @param {object} lottieData - Parsed Lottie JSON
 * @returns {Map<string, {rgb: number[], alpha: number, paths: string[]}>}
 */
export function extractColorRegistry(lottieData) {
    const colorRegistry = new Map();
    
    /**
     * Recursively traverse the Lottie structure
     * @param {any} obj - Current object/array
     * @param {(string|number)[]} path - Path to current location
     */
    function traverse(obj, path = []) {
        if (obj === null || obj === undefined) return;
        
        if (Array.isArray(obj)) {
            // Check if this is a color array
            if (isColorArray(obj)) {
                const hex = rgbToHex(obj[0], obj[1], obj[2]);
                const alpha = obj[3] !== undefined ? obj[3] : 1;
                
                if (!colorRegistry.has(hex)) {
                    colorRegistry.set(hex, {
                        rgb: [obj[0], obj[1], obj[2]],
                        alpha: alpha,
                        paths: []
                    });
                }
                
                colorRegistry.get(hex).paths.push(path.join('.'));
            } else {
                // Traverse array elements
                obj.forEach((item, index) => {
                    traverse(item, [...path, index]);
                });
            }
        } else if (typeof obj === 'object') {
            // Traverse object properties
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    traverse(obj[key], [...path, key]);
                }
            }
        }
    }
    
    traverse(lottieData);
    return colorRegistry;
}

/**
 * Convert color registry to a sorted array for UI display
 * Sorted by instance count (most used first)
 * 
 * @param {Map<string, {rgb: number[], alpha: number, paths: string[]}>} registry
 * @returns {Array<{hex: string, rgb: number[], alpha: number, instances: number, paths: string[]}>}
 */
export function registryToArray(registry) {
    return Array.from(registry.entries())
        .map(([hex, data]) => ({
            hex,
            rgb: data.rgb,
            alpha: data.alpha,
            instances: data.paths.length,
            paths: data.paths
        }))
        .sort((a, b) => b.instances - a.instances);
}

/**
 * Main function: Extract all colors from Lottie data
 * @param {object} lottieData - Parsed Lottie JSON
 * @returns {Array<{hex: string, rgb: number[], alpha: number, instances: number, paths: string[]}>}
 */
export function extractAllColors(lottieData) {
    const registry = extractColorRegistry(lottieData);
    return registryToArray(registry);
}

/**
 * Update all instances of a color in the Lottie data
 * @param {object} lottieData - Parsed Lottie JSON (will be mutated)
 * @param {string[]} paths - Array of dot-notation paths to update
 * @param {string} newHex - New hex color value
 * @param {number} [alpha=1] - Alpha value to preserve
 */
export function updateColorAtPaths(lottieData, paths, newHex, alpha = 1) {
    const newRgb = hexToRgb(newHex);
    
    paths.forEach(pathStr => {
        const parts = pathStr.split('.');
        let target = lottieData;
        
        // Navigate to the parent of the color array
        for (let i = 0; i < parts.length - 1; i++) {
            const key = parts[i];
            if (target[key] === undefined) {
                console.warn(`Path not found: ${pathStr}`);
                return;
            }
            target = target[key];
        }
        
        // Get the final key (index into the color array)
        const lastKey = parts[parts.length - 1];
        const colorArray = target[lastKey];
        
        if (Array.isArray(colorArray) && isColorArray(colorArray)) {
            // Update the color values in place
            colorArray[0] = newRgb[0];
            colorArray[1] = newRgb[1];
            colorArray[2] = newRgb[2];
            // Preserve or set alpha
            if (colorArray.length >= 4) {
                colorArray[3] = alpha;
            }
        } else {
            // The path points to a specific index, navigate up to get the array
            // This handles cases where path ends at the array itself
            if (Array.isArray(target) && isColorArray(target)) {
                target[0] = newRgb[0];
                target[1] = newRgb[1];
                target[2] = newRgb[2];
                if (target.length >= 4) {
                    target[3] = alpha;
                }
            }
        }
    });
}

/**
 * Get color statistics
 * @param {Array} colors - Array of extracted colors
 * @returns {object} Statistics object
 */
export function getColorStats(colors) {
    const totalInstances = colors.reduce((sum, c) => sum + c.instances, 0);
    const uniqueColors = colors.length;
    const mostUsed = colors[0] || null;
    const leastUsed = colors[colors.length - 1] || null;
    
    return {
        uniqueColors,
        totalInstances,
        mostUsed,
        leastUsed
    };
}
