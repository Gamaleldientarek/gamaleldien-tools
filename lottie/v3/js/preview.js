/**
 * Lottie Multi Preview - Preview multiple Lottie files
 * By Gamal Eldien | tools.gamaleldien.com
 */

// State
const state = {
    files: [], // Array of { id, name, data, instance }
    nextId: 1
};

// Sample files to load
const SAMPLE_FILES = [
    { name: 'shopping-cart.json', url: 'samples/shopping-cart.json' }
];

// DOM Elements
let elements = {};

/**
 * Initialize the application
 */
function init() {
    elements = {
        dropZone: document.getElementById('dropZone'),
        fileInput: document.getElementById('fileInput'),
        uploadSection: document.getElementById('uploadSection'),
        previewGridSection: document.getElementById('previewGridSection'),
        previewGrid: document.getElementById('previewGrid'),
        fileCount: document.getElementById('fileCount'),
        btnLoadSamples: document.getElementById('btnLoadSamples'),
        btnAddMore: document.getElementById('btnAddMore'),
        btnClearAll: document.getElementById('btnClearAll'),
        toast: document.getElementById('toast'),
        themeToggle: document.getElementById('themeToggle')
    };

    // Initialize theme
    initializeTheme();

    // Event listeners
    setupEventListeners();

    console.log('Lottie Multi Preview initialized');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Full-screen drag and drop
    let dragCounter = 0;

    document.addEventListener('dragenter', e => {
        e.preventDefault();
        dragCounter++;
        document.body.classList.add('drag-active');
    });

    document.addEventListener('dragover', e => {
        e.preventDefault();
    });

    document.addEventListener('dragleave', e => {
        e.preventDefault();
        dragCounter--;
        if (dragCounter === 0) {
            document.body.classList.remove('drag-active');
        }
    });

    document.addEventListener('drop', e => {
        e.preventDefault();
        dragCounter = 0;
        document.body.classList.remove('drag-active');

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleMultipleFiles(files);
        }
    });

    // Drop zone specific styling
    if (elements.dropZone) {
        ['dragenter', 'dragover'].forEach(event => {
            elements.dropZone.addEventListener(event, e => {
                e.preventDefault();
                e.stopPropagation();
                elements.dropZone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(event => {
            elements.dropZone.addEventListener(event, e => {
                elements.dropZone.classList.remove('drag-over');
            });
        });

        elements.dropZone.addEventListener('click', () => {
            elements.fileInput.click();
        });
    }

    elements.fileInput.addEventListener('change', e => {
        if (e.target.files.length > 0) {
            handleMultipleFiles(Array.from(e.target.files));
            e.target.value = '';
        }
    });

    // Load samples button
    if (elements.btnLoadSamples) {
        elements.btnLoadSamples.addEventListener('click', loadSampleFiles);
    }

    // Add more button
    if (elements.btnAddMore) {
        elements.btnAddMore.addEventListener('click', () => {
            elements.fileInput.click();
        });
    }

    // Clear all button
    if (elements.btnClearAll) {
        elements.btnClearAll.addEventListener('click', clearAllFiles);
    }

    // Theme toggle
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }
}

/**
 * Handle multiple file uploads
 */
function handleMultipleFiles(files) {
    const jsonFiles = files.filter(f => f.name.endsWith('.json') || f.type === 'application/json');

    if (jsonFiles.length === 0) {
        showToast('Please upload .json files');
        return;
    }

    jsonFiles.forEach(file => {
        const reader = new FileReader();

        reader.onload = e => {
            try {
                const data = JSON.parse(e.target.result);

                // Validate Lottie structure
                if (!data.v || !data.layers) {
                    showToast(`Invalid Lottie: ${file.name}`);
                    return;
                }

                addFile(file.name, data);
            } catch (err) {
                console.error('Failed to parse:', file.name, err);
                showToast(`Failed to parse: ${file.name}`);
            }
        };

        reader.readAsText(file);
    });
}

/**
 * Load sample files
 */
async function loadSampleFiles() {
    showToast('Loading samples...');

    for (const sample of SAMPLE_FILES) {
        try {
            const response = await fetch(sample.url);
            if (!response.ok) continue;

            const data = await response.json();
            if (data.v && data.layers) {
                addFile(sample.name, data);
            }
        } catch (err) {
            console.error('Failed to load sample:', sample.name, err);
        }
    }
}

/**
 * Add a file to the preview grid
 */
function addFile(name, data) {
    const file = {
        id: state.nextId++,
        name: name,
        data: JSON.parse(JSON.stringify(data)), // Deep clone
        instance: null
    };

    state.files.push(file);
    updateUI();
    renderPreviewCard(file);
}

/**
 * Remove a file from the grid
 */
function removeFile(id) {
    const index = state.files.findIndex(f => f.id === id);
    if (index === -1) return;

    const file = state.files[index];
    if (file.instance) {
        file.instance.destroy();
    }

    state.files.splice(index, 1);

    const card = document.querySelector(`.preview-card[data-id="${id}"]`);
    if (card) {
        card.remove();
    }

    updateUI();
}

/**
 * Clear all files
 */
function clearAllFiles() {
    state.files.forEach(file => {
        if (file.instance) {
            file.instance.destroy();
        }
    });

    state.files = [];
    elements.previewGrid.innerHTML = '';
    updateUI();
    showToast('Cleared all files');
}

/**
 * Update UI based on file count
 */
function updateUI() {
    const count = state.files.length;

    if (count === 0) {
        elements.uploadSection.style.display = 'block';
        elements.previewGridSection.style.display = 'none';
    } else {
        elements.uploadSection.style.display = 'none';
        elements.previewGridSection.style.display = 'block';
        elements.fileCount.textContent = `${count} file${count === 1 ? '' : 's'} loaded`;
    }
}

/**
 * Render a preview card for a file
 */
function renderPreviewCard(file) {
    const card = document.createElement('div');
    card.className = 'preview-card';
    card.dataset.id = file.id;

    card.innerHTML = `
        <div class="preview-card-player" id="player-${file.id}"></div>
        <div class="preview-card-info">
            <span class="preview-card-name" title="${file.name}">${file.name}</span>
            <div class="preview-card-meta">
                ${file.data.w}×${file.data.h} · ${Math.round(file.data.fr)} FPS
            </div>
        </div>
        <button class="preview-card-remove" data-id="${file.id}" title="Remove">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        </button>
        <div class="preview-card-overlay">
            <span>CLICK TO EDIT</span>
        </div>
    `;

    elements.previewGrid.appendChild(card);

    // Initialize Lottie animation
    const playerContainer = document.getElementById(`player-${file.id}`);
    file.instance = lottie.loadAnimation({
        container: playerContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: file.data
    });

    // Click to edit handler
    card.addEventListener('click', (e) => {
        // Don't navigate if clicking remove button
        if (e.target.closest('.preview-card-remove')) return;
        openInEditor(file);
    });

    // Remove button handler
    const removeBtn = card.querySelector('.preview-card-remove');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFile(file.id);
    });
}

/**
 * Open a file in the editor
 */
function openInEditor(file) {
    // Store file data in sessionStorage
    sessionStorage.setItem('lottie-preview-file', JSON.stringify({
        name: file.name,
        data: file.data
    }));

    // Navigate to editor
    window.location.href = 'index.html?from=preview';
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

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
