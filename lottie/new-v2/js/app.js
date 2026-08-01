/**
 * Lottie Color Editor - Main Application
 * A layer-based color editor for Lottie animations
 * By Gamal Eldien | tools.gamaleldien.com
 */

import { parseAnimation, getColorSummary } from './layer-parser.js';
import { lottieToHex, hexToLottie, setValueAtPath, deepClone } from './color-utils.js';
import { LottieExporter, isWebMSupported, downloadBlob } from './exporter.js';

// Application State
const state = {
    animationData: null,
    animationInstance: null,
    fileName: null,
    parsedData: null,
    selectedLayerId: null,
    isPlaying: true,
    currentExporter: null
};

// Sample Animation URL (shopping cart)
const SAMPLE_ANIMATION_URL = 'samples/shopping-cart.json';

// DOM Elements
let elements = {};

/**
 * Initialize the application
 */
function init() {
    // Cache DOM elements
    elements = {
        dropZone: document.getElementById('dropZone'),
        fileInput: document.getElementById('fileInput'),
        playerContainer: document.getElementById('playerContainer'),
        animationPlayer: document.getElementById('animationPlayer'),
        animationInfo: document.getElementById('animationInfo'),
        layersPanel: document.getElementById('layersPanel'),
        layersList: document.getElementById('layersList'),
        propertiesPanel: document.getElementById('propertiesPanel'),
        propertiesContent: document.getElementById('propertiesContent'),
        selectedLayerName: document.getElementById('selectedLayerName'),
        editorSection: document.getElementById('editorSection'),
        uploadSection: document.getElementById('uploadSection'),
        toast: document.getElementById('toast'),
        themeToggle: document.getElementById('themeToggle'),
        progressBar: document.getElementById('progressBar'),
        progressFill: document.getElementById('progressFill'),
        timeDisplay: document.getElementById('timeDisplay'),
        btnPlay: document.getElementById('btnPlay'),
        btnPause: document.getElementById('btnPause'),
        btnStop: document.getElementById('btnStop'),
        btnDownload: document.getElementById('btnDownload'),
        btnNewFile: document.getElementById('btnNewFile'),
        btnTrySample: document.getElementById('btnTrySample'),
        // Export elements
        exportDropdown: document.getElementById('exportDropdown'),
        btnExport: document.getElementById('btnExport'),
        exportMenu: document.getElementById('exportMenu'),
        btnExportWebM: document.getElementById('btnExportWebM'),
        btnExportGIF: document.getElementById('btnExportGIF'),
        btnExportSettings: document.getElementById('btnExportSettings'),
        // Export settings modal
        exportSettingsModal: document.getElementById('exportSettingsModal'),
        closeExportSettings: document.getElementById('closeExportSettings'),
        cancelExportSettings: document.getElementById('cancelExportSettings'),
        startExport: document.getElementById('startExport'),
        exportFormat: document.getElementById('exportFormat'),
        exportSize: document.getElementById('exportSize'),
        exportQuality: document.getElementById('exportQuality'),
        exportBackground: document.getElementById('exportBackground'),
        exportFps: document.getElementById('exportFps'),
        // Export progress modal
        exportProgressModal: document.getElementById('exportProgressModal'),
        exportProgressFill: document.getElementById('exportProgressFill'),
        exportProgressText: document.getElementById('exportProgressText'),
        cancelExport: document.getElementById('cancelExport')
    };

    // Initialize theme
    initializeTheme();

    // Event listeners
    setupEventListeners();

    console.log('Lottie Color Editor initialized');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
        elements.dropZone.addEventListener(event, e => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    ['dragenter', 'dragover'].forEach(event => {
        elements.dropZone.addEventListener(event, () => {
            elements.dropZone.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(event => {
        elements.dropZone.addEventListener(event, () => {
            elements.dropZone.classList.remove('drag-over');
        });
    });

    elements.dropZone.addEventListener('drop', e => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    elements.dropZone.addEventListener('click', () => {
        elements.fileInput.click();
    });

    elements.fileInput.addEventListener('change', e => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
            e.target.value = '';
        }
    });

    // Playback controls
    elements.btnPlay.addEventListener('click', () => {
        if (state.animationInstance) {
            state.animationInstance.play();
            state.isPlaying = true;
            updatePlaybackButtons();
        }
    });

    elements.btnPause.addEventListener('click', () => {
        if (state.animationInstance) {
            state.animationInstance.pause();
            state.isPlaying = false;
            updatePlaybackButtons();
        }
    });

    elements.btnStop.addEventListener('click', () => {
        if (state.animationInstance) {
            state.animationInstance.stop();
            state.isPlaying = false;
            updatePlaybackButtons();
        }
    });

    // Progress bar seeking
    elements.progressBar.addEventListener('click', e => {
        if (state.animationInstance) {
            const rect = elements.progressBar.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            const frame = Math.floor(pct * state.animationInstance.totalFrames);
            state.animationInstance.goToAndPlay(frame, true);
            state.isPlaying = true;
            updatePlaybackButtons();
        }
    });

    // Download
    elements.btnDownload.addEventListener('click', downloadEditedJson);

    // New file
    elements.btnNewFile.addEventListener('click', resetEditor);

    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Try sample button
    if (elements.btnTrySample) {
        elements.btnTrySample.addEventListener('click', loadSampleAnimation);
    }

    // Export dropdown
    setupExportListeners();
}

/**
 * Handle file upload
 */
function handleFileUpload(file) {
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
        showToast('Please upload a .json file');
        return;
    }

    const reader = new FileReader();

    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);

            // Validate Lottie structure
            if (!data.v || !data.layers) {
                showToast('Invalid Lottie file');
                return;
            }

            loadAnimation(data, file.name);
        } catch (err) {
            console.error('Failed to parse JSON:', err);
            showToast('Failed to parse JSON file');
        }
    };

    reader.onerror = () => {
        showToast('Error reading file');
    };

    reader.readAsText(file);
}

/**
 * Load the sample animation
 */
async function loadSampleAnimation() {
    try {
        showToast('Loading sample...');

        const response = await fetch(SAMPLE_ANIMATION_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch sample');
        }

        const data = await response.json();

        // Validate Lottie structure
        if (!data.v || !data.layers) {
            showToast('Invalid sample file');
            return;
        }

        loadAnimation(data, 'shopping-cart.json');
    } catch (err) {
        console.error('Failed to load sample:', err);
        showToast('Failed to load sample animation');
    }
}

/**
 * Load and display the animation
 */
function loadAnimation(data, filename) {
    // Store state
    state.animationData = deepClone(data);
    state.fileName = filename;

    // Parse the animation
    state.parsedData = parseAnimation(data);
    console.log('Parsed animation:', state.parsedData);

    // Destroy previous animation if exists
    if (state.animationInstance) {
        state.animationInstance.destroy();
    }

    // Clear player container
    elements.animationPlayer.innerHTML = '';

    // Load new animation
    state.animationInstance = lottie.loadAnimation({
        container: elements.animationPlayer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: state.animationData
    });

    state.isPlaying = true;

    // Update progress bar
    state.animationInstance.addEventListener('enterFrame', () => {
        const pct = (state.animationInstance.currentFrame / state.animationInstance.totalFrames) * 100;
        elements.progressFill.style.width = pct + '%';

        // Update time display
        const currentTime = (state.animationInstance.currentFrame / state.parsedData.info.fps).toFixed(1);
        elements.timeDisplay.textContent = `${currentTime}s / ${state.parsedData.info.duration}s`;
    });

    // Update UI
    updateAnimationInfo();
    renderLayersPanel();
    updatePlaybackButtons();

    // Show editor, hide upload
    elements.uploadSection.style.display = 'none';
    elements.editorSection.style.display = 'block';

    showToast(`Loaded: ${filename}`);
}

/**
 * Update the animation info display
 */
function updateAnimationInfo() {
    const info = state.parsedData.info;
    elements.animationInfo.innerHTML = `
    <span>${info.width}×${info.height}</span>
    <span>${info.fps} FPS</span>
    <span>${info.duration}s</span>
    <span>${state.parsedData.layers.length} Layers</span>
  `;
}

/**
 * Render the layers panel
 */
function renderLayersPanel() {
    let html = '';

    // Controllers section
    if (state.parsedData.controllers.length > 0) {
        html += '<div class="layers-section">';
        html += '<div class="layers-section-header">COLOR CONTROLLERS</div>';

        state.parsedData.controllers.forEach(controller => {
            html += `
        <div class="layer-item controller-layer ${state.selectedLayerId === controller.id ? 'selected' : ''}" 
             data-layer-id="${controller.id}">
          <span class="layer-name">${controller.name}</span>
          <span class="layer-colors-count">${controller.colors.length}</span>
        </div>
      `;
        });

        html += '</div>';
    }

    // Regular layers section
    html += '<div class="layers-section">';
    html += '<div class="layers-section-header">LAYERS</div>';

    state.parsedData.layers.forEach(layer => {
        if (layer.isController) return; // Skip controllers in main list

        const colorCount = layer.properties.filter(p => p.hex).length;
        const typeIcon = getLayerTypeIcon(layer.type);

        html += `
      <div class="layer-item ${state.selectedLayerId === layer.id ? 'selected' : ''}" 
           data-layer-id="${layer.id}">
        <span class="layer-name" title="${layer.name}">${layer.name}</span>
        ${colorCount > 0 ? `<span class="layer-colors-count">${colorCount}</span>` : ''}
      </div>
    `;
    });

    html += '</div>';

    elements.layersList.innerHTML = html;

    // Add click handlers
    elements.layersList.querySelectorAll('.layer-item').forEach(item => {
        item.addEventListener('click', () => {
            const layerId = item.dataset.layerId;
            selectLayer(layerId);
        });
    });

    // Auto-select first layer with colors
    if (!state.selectedLayerId) {
        const firstWithColors = state.parsedData.layers.find(l => l.properties.length > 0);
        if (firstWithColors) {
            selectLayer(firstWithColors.id);
        } else if (state.parsedData.controllers.length > 0) {
            selectLayer(state.parsedData.controllers[0].id);
        }
    }
}

/**
 * Get icon for layer type
 */
function getLayerTypeIcon(type) {
    const icons = {
        'shape': '⬜',
        'solid': '◼️',
        'null': '◯',
        'precomp': '📁',
        'text': '📝',
        'image': '🖼️',
        'audio': '🔊',
        'video': '🎬',
        'camera': '📷'
    };
    return icons[type] || '❓';
}

/**
 * Select a layer and show its properties
 */
function selectLayer(layerId) {
    state.selectedLayerId = layerId;

    // Update selection UI
    elements.layersList.querySelectorAll('.layer-item').forEach(item => {
        item.classList.toggle('selected', item.dataset.layerId === layerId);
    });

    // Find the layer or controller
    const controller = state.parsedData.controllers.find(c => c.id === layerId);
    const layer = state.parsedData.layers.find(l => l.id === layerId);

    if (controller) {
        renderControllerProperties(controller);
    } else if (layer) {
        renderLayerProperties(layer);
    }
}

/**
 * Render properties for a controller layer
 */
function renderControllerProperties(controller) {
    elements.selectedLayerName.textContent = controller.name;

    let html = '<div class="property-section">';
    html += '<div class="property-section-header">COLOR EFFECTS</div>';
    html += '<p class="property-description">These colors control other layers via expressions.</p>';

    controller.colors.forEach((color, index) => {
        html += `
      <div class="property-row">
        <div class="property-label">${color.name}</div>
        <div class="property-color">
          <input type="color" class="color-picker" 
                 value="${color.hex}" 
                 data-controller-id="${controller.id}"
                 data-color-index="${index}"
                 data-path="${color.path}">
          <input type="text" class="color-hex" 
                 value="${color.hex.toUpperCase()}" 
                 data-controller-id="${controller.id}"
                 data-color-index="${index}">
        </div>
      </div>
    `;
    });

    html += '</div>';
    elements.propertiesContent.innerHTML = html;

    // Add event listeners
    addColorPickerListeners();
}

/**
 * Render properties for a regular layer
 */
function renderLayerProperties(layer) {
    elements.selectedLayerName.textContent = layer.name;

    let html = '';

    // Layer info
    html += `
    <div class="layer-info-row">
      <span class="layer-info-label">Type:</span>
      <span class="layer-info-value">${layer.type}</span>
    </div>
  `;

    // Colors
    const colorProps = layer.properties.filter(p => p.hex);
    const gradientProps = layer.properties.filter(p => p.isGradient);

    if (colorProps.length > 0) {
        html += '<div class="property-section">';
        html += '<div class="property-section-header">COLORS</div>';

        colorProps.forEach((prop, index) => {
            html += `
        <div class="property-row">
          <div class="property-label">
            ${prop.name}
            ${prop.isAnimated ? '<span class="badge badge-animated">Animated</span>' : ''}
            ${prop.isExpression ? `<span class="badge badge-expression">⚡ ${prop.expressionRef || 'Expression'}</span>` : ''}
          </div>
          <div class="property-color">
            <input type="color" class="color-picker" 
                   value="${prop.hex}" 
                   data-layer-id="${layer.id}"
                   data-prop-index="${index}"
                   data-path="${prop.path}"
                   ${prop.isExpression ? 'disabled title="Color controlled by expression"' : ''}>
            <input type="text" class="color-hex" 
                   value="${prop.hex.toUpperCase()}" 
                   data-layer-id="${layer.id}"
                   data-prop-index="${index}"
                   ${prop.isExpression ? 'disabled' : ''}>
          </div>
        </div>
      `;
        });

        html += '</div>';
    }

    // Gradients notice
    if (gradientProps.length > 0) {
        html += '<div class="property-section">';
        html += '<div class="property-section-header">GRADIENTS</div>';
        html += '<p class="property-description">This layer has gradients. Gradient editing is not yet supported.</p>';
        html += '</div>';
    }

    // No properties
    if (colorProps.length === 0 && gradientProps.length === 0) {
        html += '<p class="no-properties">No editable color properties on this layer.</p>';
    }

    elements.propertiesContent.innerHTML = html;

    // Add event listeners
    addColorPickerListeners();
}

/**
 * Add event listeners to color pickers
 */
function addColorPickerListeners() {
    // Color picker change
    elements.propertiesContent.querySelectorAll('.color-picker').forEach(picker => {
        picker.addEventListener('change', handleColorChange);
        picker.addEventListener('input', handleColorChange); // For live preview
    });

    // Hex input change
    elements.propertiesContent.querySelectorAll('.color-hex').forEach(input => {
        input.addEventListener('change', handleHexInputChange);
    });
}

/**
 * Handle color picker change
 */
function handleColorChange(e) {
    const picker = e.target;
    const newHex = picker.value;
    const path = picker.dataset.path;

    // Update hex input
    const hexInput = picker.parentElement.querySelector('.color-hex');
    if (hexInput) {
        hexInput.value = newHex.toUpperCase();
    }

    // Update the animation data
    updateColorAtPath(path, newHex);
}

/**
 * Handle hex input change
 */
function handleHexInputChange(e) {
    const input = e.target;
    let hex = input.value.trim();

    // Validate and fix hex format
    if (!hex.startsWith('#')) {
        hex = '#' + hex;
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        showToast('Invalid hex color');
        return;
    }

    // Update color picker
    const picker = input.parentElement.querySelector('.color-picker');
    if (picker) {
        picker.value = hex;
    }

    // Update the animation data
    const path = picker.dataset.path;
    updateColorAtPath(path, hex);
}

/**
 * Update color at a specific path in the animation data
 */
function updateColorAtPath(path, newHex) {
    const newColor = hexToLottie(newHex);

    // Update the animation data
    setValueAtPath(state.animationData, path, newColor);

    // Refresh the animation
    refreshAnimation();

    // Re-parse to update our state
    state.parsedData = parseAnimation(state.animationData);
}

/**
 * Refresh the animation with updated data
 */
function refreshAnimation() {
    if (!state.animationInstance) return;

    const currentFrame = state.animationInstance.currentFrame;
    const wasPlaying = state.isPlaying;

    // Destroy and recreate
    state.animationInstance.destroy();
    elements.animationPlayer.innerHTML = '';

    state.animationInstance = lottie.loadAnimation({
        container: elements.animationPlayer,
        renderer: 'svg',
        loop: true,
        autoplay: wasPlaying,
        animationData: state.animationData
    });

    state.isPlaying = wasPlaying;

    // Restore position
    if (currentFrame > 0) {
        if (wasPlaying) {
            state.animationInstance.goToAndPlay(currentFrame, true);
        } else {
            state.animationInstance.goToAndStop(currentFrame, true);
        }
    }

    // Re-attach progress listener
    state.animationInstance.addEventListener('enterFrame', () => {
        const pct = (state.animationInstance.currentFrame / state.animationInstance.totalFrames) * 100;
        elements.progressFill.style.width = pct + '%';

        const currentTime = (state.animationInstance.currentFrame / state.parsedData.info.fps).toFixed(1);
        elements.timeDisplay.textContent = `${currentTime}s / ${state.parsedData.info.duration}s`;
    });
}

/**
 * Update playback button states
 */
function updatePlaybackButtons() {
    elements.btnPlay.classList.toggle('active', state.isPlaying);
    elements.btnPause.classList.toggle('active', !state.isPlaying);
}

/**
 * Download the edited JSON
 */
function downloadEditedJson() {
    if (!state.animationData) {
        showToast('No animation to download');
        return;
    }

    const dataStr = JSON.stringify(state.animationData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });

    const fileName = state.fileName.replace('.json', '_edited.json');

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    showToast(`Downloaded: ${fileName}`);
}

/**
 * Reset the editor to initial state
 */
function resetEditor() {
    if (state.animationInstance) {
        state.animationInstance.destroy();
        state.animationInstance = null;
    }

    state.animationData = null;
    state.fileName = null;
    state.parsedData = null;
    state.selectedLayerId = null;

    elements.animationPlayer.innerHTML = '';
    elements.layersList.innerHTML = '';
    elements.propertiesContent.innerHTML = '';
    elements.selectedLayerName.textContent = 'Select a layer';
    elements.progressFill.style.width = '0%';
    elements.timeDisplay.textContent = '0.0s / 0.0s';

    elements.editorSection.style.display = 'none';
    elements.uploadSection.style.display = 'block';
}

/**
 * Show toast notification
 */
function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

/**
 * Initialize theme from localStorage
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcon('light');
    } else {
        updateThemeIcon('dark');
    }
}

/**
 * Toggle theme
 */
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';

    if (newTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`);
}

/**
 * Update theme icon
 */
function updateThemeIcon(theme) {
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');

    if (theme === 'light') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

// ==========================================
// EXPORT FUNCTIONALITY
// ==========================================

/**
 * Setup export-related event listeners
 */
function setupExportListeners() {
    // Toggle dropdown
    if (elements.btnExport) {
        elements.btnExport.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.exportDropdown.classList.toggle('open');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        if (elements.exportDropdown) {
            elements.exportDropdown.classList.remove('open');
        }
    });

    // Quick export WebM
    if (elements.btnExportWebM) {
        elements.btnExportWebM.addEventListener('click', () => {
            closeExportDropdown();
            startQuickExport('webm');
        });
    }

    // Quick export GIF
    if (elements.btnExportGIF) {
        elements.btnExportGIF.addEventListener('click', () => {
            closeExportDropdown();
            startQuickExport('gif');
        });
    }

    // Open settings modal
    if (elements.btnExportSettings) {
        elements.btnExportSettings.addEventListener('click', () => {
            closeExportDropdown();
            openExportSettingsModal();
        });
    }

    // Close settings modal
    if (elements.closeExportSettings) {
        elements.closeExportSettings.addEventListener('click', closeExportSettingsModal);
    }
    if (elements.cancelExportSettings) {
        elements.cancelExportSettings.addEventListener('click', closeExportSettingsModal);
    }

    // Start export from settings
    if (elements.startExport) {
        elements.startExport.addEventListener('click', startExportFromSettings);
    }

    // Cancel export
    if (elements.cancelExport) {
        elements.cancelExport.addEventListener('click', cancelCurrentExport);
    }

    // Close modals on overlay click
    if (elements.exportSettingsModal) {
        elements.exportSettingsModal.addEventListener('click', (e) => {
            if (e.target === elements.exportSettingsModal) {
                closeExportSettingsModal();
            }
        });
    }
}

/**
 * Close export dropdown
 */
function closeExportDropdown() {
    if (elements.exportDropdown) {
        elements.exportDropdown.classList.remove('open');
    }
}

/**
 * Open export settings modal
 */
function openExportSettingsModal() {
    if (!state.animationData) {
        showToast('No animation loaded');
        return;
    }

    // Check WebM support and update options
    if (!isWebMSupported() && elements.exportFormat) {
        elements.exportFormat.value = 'gif';
        const webmOption = elements.exportFormat.querySelector('option[value="webm"]');
        if (webmOption) {
            webmOption.disabled = true;
            webmOption.textContent = 'WebM Video (Not supported in this browser)';
        }
    }

    elements.exportSettingsModal.classList.add('show');
}

/**
 * Close export settings modal
 */
function closeExportSettingsModal() {
    elements.exportSettingsModal.classList.remove('show');
}

/**
 * Show export progress modal
 */
function showExportProgress() {
    elements.exportProgressFill.style.width = '0%';
    elements.exportProgressText.textContent = 'Preparing...';
    elements.exportProgressModal.classList.add('show');
}

/**
 * Hide export progress modal
 */
function hideExportProgress() {
    elements.exportProgressModal.classList.remove('show');
}

/**
 * Update export progress
 */
function updateExportProgress(percent, current, total, message) {
    elements.exportProgressFill.style.width = `${percent}%`;
    if (message) {
        elements.exportProgressText.textContent = message;
    } else if (current >= 0 && total > 0) {
        elements.exportProgressText.textContent = `Processing frame ${current + 1} of ${total}...`;
    } else {
        elements.exportProgressText.textContent = `${Math.round(percent)}% complete...`;
    }
}

/**
 * Quick export with default settings
 */
async function startQuickExport(format) {
    if (!state.animationData) {
        showToast('No animation loaded');
        return;
    }

    // Check WebM support
    if (format === 'webm' && !isWebMSupported()) {
        showToast('WebM not supported, using GIF instead');
        format = 'gif';
    }

    const info = state.parsedData.info;
    const options = {
        format: format,
        width: info.width,
        height: info.height,
        fps: Math.min(info.fps, 30),
        quality: 0.8,
        background: null
    };

    await executeExport(options);
}

/**
 * Start export from settings modal
 */
async function startExportFromSettings() {
    closeExportSettingsModal();

    const info = state.parsedData.info;
    const scale = parseFloat(elements.exportSize.value) || 1;

    const options = {
        format: elements.exportFormat.value,
        width: Math.round(info.width * scale),
        height: Math.round(info.height * scale),
        fps: parseInt(elements.exportFps.value) || 30,
        quality: parseFloat(elements.exportQuality.value) || 0.8,
        background: elements.exportBackground.value || null
    };

    await executeExport(options);
}

/**
 * Execute the export
 */
async function executeExport(options) {
    showExportProgress();

    try {
        const exporter = new LottieExporter(state.animationData, options);
        state.currentExporter = exporter;

        // Setup progress callback
        exporter.onProgress = (percent, current, total, message) => {
            updateExportProgress(percent, current, total, message);
        };

        const blob = await exporter.export();

        // Generate filename
        const baseName = state.fileName ? state.fileName.replace('.json', '') : 'animation';
        const ext = options.format === 'gif' ? 'gif' : 'webm';
        const filename = `${baseName}_export.${ext}`;

        // Download
        downloadBlob(blob, filename);

        hideExportProgress();
        showToast(`Exported: ${filename}`);

    } catch (err) {
        console.error('Export failed:', err);
        hideExportProgress();

        if (err.message !== 'Export cancelled') {
            showToast(`Export failed: ${err.message}`);
        }
    } finally {
        state.currentExporter = null;
    }
}

/**
 * Cancel the current export
 */
function cancelCurrentExport() {
    if (state.currentExporter) {
        state.currentExporter.abort();
        showToast('Export cancelled');
    }
    hideExportProgress();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
