/**
 * Layer Parser for Lottie Color Editor
 * Extracts layers, their color properties, and detects controller layers
 */

import { lottieToHex } from './color-utils.js';

/**
 * Layer types in Lottie format
 */
const LAYER_TYPES = {
    0: 'precomp',
    1: 'solid',
    2: 'image',
    3: 'null',
    4: 'shape',
    5: 'text',
    6: 'audio',
    7: 'video',
    13: 'camera'
};

/**
 * Parse a Lottie animation and extract all layers with their color properties
 * @param {object} animationData - The Lottie JSON data
 * @returns {object} Parsed data with layers and controllers
 */
export function parseAnimation(animationData) {
    const result = {
        info: {
            name: animationData.nm || 'Untitled',
            version: animationData.v,
            width: animationData.w,
            height: animationData.h,
            fps: animationData.fr,
            totalFrames: animationData.op - animationData.ip,
            duration: ((animationData.op - animationData.ip) / animationData.fr).toFixed(2)
        },
        controllers: [],
        layers: []
    };

    // First pass: Find controller layers
    if (animationData.layers) {
        animationData.layers.forEach((layer, index) => {
            if (isControllerLayer(layer)) {
                const controller = parseControllerLayer(layer, index);
                result.controllers.push(controller);
            }
        });
    }

    // Second pass: Parse all layers
    if (animationData.layers) {
        animationData.layers.forEach((layer, index) => {
            const parsedLayer = parseLayer(layer, index, `layers[${index}]`, result.controllers);
            result.layers.push(parsedLayer);
        });
    }

    return result;
}

/**
 * Check if a layer is a controller layer (has color effects)
 * @param {object} layer - The layer object
 * @returns {boolean}
 */
function isControllerLayer(layer) {
    // Null layers with effects that have color controls
    if (layer.ty === 3 && layer.ef) {
        return layer.ef.some(effect =>
            effect.mn === 'ADBE Color Control' ||
            effect.ty === 5 // Color control effect type
        );
    }
    return false;
}

/**
 * Parse a controller layer and extract its color effects
 * @param {object} layer - The layer object
 * @param {number} index - Layer index
 * @returns {object} Parsed controller
 */
function parseControllerLayer(layer, index) {
    const controller = {
        id: `controller_${index}`,
        name: layer.nm || `Controller ${index}`,
        layerIndex: index,
        colors: []
    };

    if (layer.ef) {
        layer.ef.forEach((effect, effIndex) => {
            if (effect.mn === 'ADBE Color Control' || effect.ty === 5) {
                // Find the color value in the effect
                const colorEffect = effect.ef?.find(e => e.nm === 'Color' || e.ty === 2);
                if (colorEffect && colorEffect.v) {
                    const colorValue = colorEffect.v.k;
                    controller.colors.push({
                        name: effect.nm || `Color ${effIndex}`,
                        path: `layers[${index}].ef[${effIndex}].ef[0].v.k`,
                        value: colorValue,
                        hex: lottieToHex(colorValue),
                        effectIndex: effIndex
                    });
                }
            }
        });
    }

    return controller;
}

/**
 * Parse a single layer and extract its color properties
 * @param {object} layer - The layer object
 * @param {number} index - Layer index
 * @param {string} basePath - Base JSON path
 * @param {object[]} controllers - Array of controller layers
 * @returns {object} Parsed layer
 */
function parseLayer(layer, index, basePath, controllers) {
    const parsedLayer = {
        id: `layer_${index}`,
        name: layer.nm || `Layer ${index}`,
        type: LAYER_TYPES[layer.ty] || 'unknown',
        typeNum: layer.ty,
        index: layer.ind !== undefined ? layer.ind : index,
        hidden: layer.hd === true,
        isController: isControllerLayer(layer),
        properties: []
    };

    // Extract colors from shapes
    if (layer.shapes) {
        extractColorsFromShapes(layer.shapes, `${basePath}.shapes`, parsedLayer.properties, controllers);
    }

    // Extract colors from effects (for non-controller layers)
    if (layer.ef && !parsedLayer.isController) {
        extractColorsFromEffects(layer.ef, `${basePath}.ef`, parsedLayer.properties);
    }

    return parsedLayer;
}

/**
 * Recursively extract colors from shape items
 * @param {object[]} shapes - Array of shape items
 * @param {string} basePath - Current JSON path
 * @param {object[]} properties - Array to add found properties to
 * @param {object[]} controllers - Controller layers for expression detection
 */
function extractColorsFromShapes(shapes, basePath, properties, controllers) {
    shapes.forEach((shape, index) => {
        const shapePath = `${basePath}[${index}]`;

        // Fill (fl)
        if (shape.ty === 'fl' && shape.c) {
            const colorProp = extractColorProperty(shape.c, `${shapePath}.c`, 'Fill', controllers);
            if (colorProp) properties.push(colorProp);
        }

        // Stroke (st)
        if (shape.ty === 'st' && shape.c) {
            const colorProp = extractColorProperty(shape.c, `${shapePath}.c`, 'Stroke', controllers);
            if (colorProp) properties.push(colorProp);
        }

        // Gradient Fill (gf)
        if (shape.ty === 'gf' && shape.g && shape.g.k) {
            // Gradients have multiple colors - mark as gradient
            properties.push({
                name: 'Gradient Fill',
                type: 'gradient',
                path: `${shapePath}.g.k`,
                isGradient: true,
                value: null,
                hex: null
            });
        }

        // Gradient Stroke (gs)
        if (shape.ty === 'gs' && shape.g && shape.g.k) {
            properties.push({
                name: 'Gradient Stroke',
                type: 'gradient',
                path: `${shapePath}.g.k`,
                isGradient: true,
                value: null,
                hex: null
            });
        }

        // Group (gr) - recurse into items
        if (shape.ty === 'gr' && shape.it) {
            extractColorsFromShapes(shape.it, `${shapePath}.it`, properties, controllers);
        }
    });
}

/**
 * Extract a color property from a color object
 * @param {object} colorObj - The color object (with .k value)
 * @param {string} path - JSON path
 * @param {string} type - Property type (Fill, Stroke)
 * @param {object[]} controllers - Controller layers
 * @returns {object|null} Parsed color property
 */
function extractColorProperty(colorObj, path, type, controllers) {
    if (!colorObj) return null;

    const prop = {
        name: type,
        type: type.toLowerCase(),
        path: path,
        isAnimated: false,
        isExpression: false,
        expressionRef: null,
        value: null,
        hex: null
    };

    // Check for expression
    if (colorObj.x) {
        prop.isExpression = true;
        // Try to detect which controller it references
        const controllerMatch = colorObj.x.match(/layer\(['"]([^'"]+)['"]\)/);
        if (controllerMatch) {
            prop.expressionRef = controllerMatch[1];
        }
    }

    // Static color: k = [r, g, b, a]
    if (colorObj.k && Array.isArray(colorObj.k) && typeof colorObj.k[0] === 'number') {
        prop.value = colorObj.k;
        prop.hex = lottieToHex(colorObj.k);
        prop.path = `${path}.k`;
    }
    // Animated color: k = [{t: 0, s: [r,g,b,a], ...}, ...]
    else if (colorObj.k && Array.isArray(colorObj.k) && colorObj.k[0] && colorObj.k[0].s) {
        prop.isAnimated = true;
        prop.value = colorObj.k[0].s;
        prop.hex = lottieToHex(colorObj.k[0].s);
        prop.path = `${path}.k[0].s`;
    }

    return prop;
}

/**
 * Extract colors from effects
 * @param {object[]} effects - Array of effects
 * @param {string} basePath - Current JSON path
 * @param {object[]} properties - Array to add found properties to
 */
function extractColorsFromEffects(effects, basePath, properties) {
    effects.forEach((effect, index) => {
        const effectPath = `${basePath}[${index}]`;

        // Color control effect
        if (effect.mn === 'ADBE Color Control' || effect.ty === 5) {
            const colorEffect = effect.ef?.find(e => e.nm === 'Color' || e.ty === 2);
            if (colorEffect && colorEffect.v && colorEffect.v.k) {
                properties.push({
                    name: effect.nm || 'Color Effect',
                    type: 'effect',
                    path: `${effectPath}.ef[0].v.k`,
                    value: colorEffect.v.k,
                    hex: lottieToHex(colorEffect.v.k),
                    isAnimated: false,
                    isExpression: false
                });
            }
        }
    });
}

/**
 * Get a summary of all unique colors in the animation
 * @param {object} parsedData - Result from parseAnimation
 * @returns {object[]} Array of unique colors with usage count
 */
export function getColorSummary(parsedData) {
    const colorMap = new Map();

    // From controllers
    parsedData.controllers.forEach(controller => {
        controller.colors.forEach(color => {
            const hex = color.hex.toUpperCase();
            if (!colorMap.has(hex)) {
                colorMap.set(hex, { hex, count: 0, sources: [] });
            }
            colorMap.get(hex).count++;
            colorMap.get(hex).sources.push(`Controller: ${controller.name}`);
        });
    });

    // From layers
    parsedData.layers.forEach(layer => {
        layer.properties.forEach(prop => {
            if (prop.hex) {
                const hex = prop.hex.toUpperCase();
                if (!colorMap.has(hex)) {
                    colorMap.set(hex, { hex, count: 0, sources: [] });
                }
                colorMap.get(hex).count++;
                colorMap.get(hex).sources.push(`${layer.name}: ${prop.name}`);
            }
        });
    });

    return Array.from(colorMap.values());
}
