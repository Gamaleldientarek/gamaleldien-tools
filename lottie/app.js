/**
 * Lottie Preview - App.js
 * REBUILT: Simplified color editing with native inputs
 * By Gamal Eldien | tools.gamaleldien.com
 */

const animations = new Map();
const undoStacks = new Map();
let animId = 0;

document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const container = document.getElementById('animationsContainer');
  const animationsSection = document.getElementById('animationsSection');
  const clearAllBtn = document.getElementById('clearAll');
  const toast = document.getElementById('toast');
  const themeToggle = document.getElementById('themeToggle');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');

  // Initialize theme from localStorage or system preference
  initializeTheme();

  // Theme toggle functionality
  themeToggle.addEventListener('click', toggleTheme);

  // Check if lottie is loaded
  if (typeof lottie === 'undefined') {
    console.error('Lottie library not loaded!');
    showToast('Error: Lottie library failed to load');
    return;
  }

  console.log('Lottie Hub initialized - REBUILT VERSION');

  // Drag and drop events
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
    dropZone.addEventListener(event, e => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  ['dragenter', 'dragover'].forEach(event => {
    dropZone.addEventListener(event, () => dropZone.classList.add('drag-over'));
  });

  ['dragleave', 'drop'].forEach(event => {
    dropZone.addEventListener(event, () => dropZone.classList.remove('drag-over'));
  });

  dropZone.addEventListener('drop', e => {
    console.log('Files dropped:', e.dataTransfer.files.length);
    handleFiles(e.dataTransfer.files);
  });

  dropZone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', e => {
    console.log('Files selected:', e.target.files.length);
    handleFiles(e.target.files);
    fileInput.value = ''; // Reset input to allow same file selection
  });

  clearAllBtn.addEventListener('click', clearAll);

  /**
   * Initialize theme from localStorage or system preference
   */
  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      updateThemeIcons(savedTheme);
    } else if (systemPrefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      updateThemeIcons('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      updateThemeIcons('dark'); // Default to dark mode
    }
  }

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
    
    showToast(`Switched to ${newTheme} mode`);
  }

  /**
   * Update theme icons based on current theme
   */
  function updateThemeIcons(theme) {
    if (theme === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }

  /**
   * Handle uploaded files
   */
  function handleFiles(files) {
    let validCount = 0;
    
    [...files].forEach(file => {
      console.log('Processing file:', file.name);
      
      if (file.name.endsWith('.json') || file.type === 'application/json') {
        const reader = new FileReader();
        
        reader.onload = e => {
          try {
            const data = JSON.parse(e.target.result);
            console.log('Parsed JSON:', file.name, 'has layers:', !!data.layers);
            
            // Validate Lottie structure
            if (data.v && data.layers) {
              createCard(data, file.name);
              validCount++;
            } else {
              console.warn('Not a valid Lottie file:', file.name);
              showToast('Invalid Lottie file: ' + file.name);
            }
          } catch (err) {
            console.error('Invalid JSON:', file.name, err);
            showToast('Failed to parse: ' + file.name);
          }
        };
        
        reader.onerror = err => {
          console.error('File read error:', err);
          showToast('Error reading file');
        };
        
        reader.readAsText(file);
      } else {
        showToast('Please upload .json files only');
      }
    });
  }

  /**
   * Create animation card with inline color editing
   */
  function createCard(animData, fileName) {
    const id = `anim-${animId++}`;
    const fps = animData.fr || 30;
    const frames = animData.op - animData.ip;
    const duration = (frames / fps).toFixed(1);
    const width = animData.w || '?';
    const height = animData.h || '?';

    console.log('Creating card for:', fileName, 'FPS:', fps, 'Duration:', duration + 's');

    const card = document.createElement('div');
    card.className = 'anim-card';
    card.id = id;
    
    // Extract colors for this animation with FULL paths
    const extractedColors = extractColors(animData);
    
    card.innerHTML = `
      <div class="anim-header">
        <div class="anim-player" id="player-${id}"></div>
        <div class="anim-info">
          <h3 title="${fileName}">${fileName}</h3>
          <div class="anim-meta">
            <span>${width}×${height}</span>
            <span>${fps} FPS</span>
            <span>${duration}s</span>
          </div>
        </div>
        <button class="remove-btn" data-id="${id}" title="Remove">×</button>
      </div>
      <div class="anim-controls">
        <div class="control-row">
          <button class="ctrl-btn" data-action="play" data-id="${id}">PLAY</button>
          <button class="ctrl-btn" data-action="pause" data-id="${id}">PAUSE</button>
          <button class="ctrl-btn" data-action="stop" data-id="${id}">STOP</button>
        </div>
        <div class="progress-bar" data-id="${id}">
          <div class="progress-fill" id="progress-${id}"></div>
        </div>
      </div>
      
      <!-- Inline Color Editor with Native Inputs -->
      <div class="anim-colors" id="colors-${id}" style="display: none;">
        <div class="colors-header">
          <span>COLORS (${extractedColors.length})</span>
        </div>
        <div class="color-swatches" id="swatches-${id}">
          ${extractedColors.map((color, index) => `
            <div class="color-item">
              <input type="color" class="native-picker" 
                     value="${color.hex}" 
                     data-animation-id="${id}"
                     data-color-index="${index}"
                     data-path="${color.path}"
                     title="${color.hex} (${color.type})${color.isAnimated ? ' - Animated' : ''}">
              <div class="color-value">${color.hex.toUpperCase()}</div>
              <div class="color-type">${color.type}</div>
            </div>
          `).join('')}
        </div>
        <div class="colors-actions">
          <button class="btn-sm" onclick="handleUndo('${id}')">UNDO</button>
          <button class="btn-sm btn-primary" onclick="downloadJson('${id}')">DOWNLOAD</button>
        </div>
      </div>
      
      <!-- Toggle Colors Button -->
      <button class="toggle-colors-btn" data-id="${id}">
        EDIT COLORS (${extractedColors.length})
      </button>
    `;

    container.appendChild(card);

    const playerContainer = document.getElementById(`player-${id}`);

    try {
      const anim = lottie.loadAnimation({
        container: playerContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animData
      });

      console.log('Animation loaded successfully for:', fileName);

      // Update progress bar
      anim.addEventListener('enterFrame', () => {
        const pct = (anim.currentFrame / anim.totalFrames) * 100;
        const progressEl = document.getElementById(`progress-${id}`);
        if (progressEl) progressEl.style.width = pct + '%';
      });

      anim.addEventListener('error', (err) => {
        console.error('Lottie animation error:', err);
        showToast('Animation error');
      });

      // Store animation reference
      animations.set(id, { anim, data: animData, name: fileName });
      updateUI();

      // Event listeners for this card
      card.querySelector('.remove-btn').addEventListener('click', () => removeAnim(id));

      // Toggle colors section
      card.querySelector('.toggle-colors-btn').addEventListener('click', () => {
        toggleColorsSection(id);
      });

      // Native color input change events - THE NEW SIMPLIFIED WAY
      card.querySelectorAll('.native-picker').forEach(picker => {
        picker.addEventListener('change', (e) => {
          const animationId = e.target.dataset.animationId;
          const colorIndex = parseInt(e.target.dataset.colorIndex);
          const newHex = e.target.value;
          
          // Update color immediately
          updateColorInAnimation(animationId, colorIndex, newHex);
          
          // Update the display
          const valueEl = e.target.parentNode.querySelector('.color-value');
          if (valueEl) valueEl.textContent = newHex.toUpperCase();
          
          showToast('Color updated');
        });
      });

      // Control button event listeners
      card.querySelectorAll('.ctrl-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.action;
          const animObj = animations.get(id);
          if (!animObj) return;
          
          const a = animObj.anim;
          
          // Update button states
          card.querySelectorAll('.ctrl-btn').forEach(b => b.classList.remove('active'));
          
          if (action === 'play') {
            a.play();
            btn.classList.add('active');
          }
          if (action === 'pause') {
            a.pause();
            btn.classList.add('active');
          }
          if (action === 'stop') {
            a.stop();
          }
        });
      });

      // Click on progress bar to seek
      card.querySelector('.progress-bar').addEventListener('click', e => {
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        const animObj = animations.get(id);
        if (animObj) {
          animObj.anim.goToAndPlay(Math.floor(pct * animObj.anim.totalFrames), true);
        }
      });

      // Set initial play button as active
      card.querySelector('[data-action="play"]').classList.add('active');
      
      showToast('Animation loaded: ' + fileName);

    } catch (err) {
      console.error('Failed to load animation:', fileName, err);
      card.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--danger);">
          <p style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;">Failed to load</p>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">${fileName}</p>
        </div>
      `;
    }
  }

  /**
   * REBUILT: Extract colors with FULL navigable paths
   */
  function extractColors(obj, path = '', colors = [], seen = new Set()) {
    if (!obj || typeof obj !== 'object') return colors;
    
    // Check for color object
    if (obj.c && obj.c.k !== undefined) {
      const colorArray = Array.isArray(obj.c.k) && typeof obj.c.k[0] === 'number' 
        ? obj.c.k 
        : (obj.c.k[0]?.s || null);
      
      if (colorArray && colorArray.length >= 3) {
        const hex = lottieToHex(colorArray);
        if (!seen.has(hex)) {
          seen.add(hex);
          colors.push({
            path: path + '.c',
            hex: hex,
            type: getColorType(path),
            isAnimated: Array.isArray(obj.c.k) && obj.c.k[0] && obj.c.k[0].s
          });
        }
      }
    }
    
    // Recurse through object properties
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => extractColors(item, `${path}[${i}]`, colors, seen));
    } else {
      for (const key in obj) {
        if (key !== 'c') { // Don't recurse into color objects we just processed
          extractColors(obj[key], path ? `${path}.${key}` : key, colors, seen);
        }
      }
    }
    
    return colors;
  }

  /**
   * REBUILT: Simple and reliable color update logic
   */
  function updateColorInAnimation(animationId, colorIndex, newHex) {
    const animObj = animations.get(animationId);
    if (!animObj) return;
    
    // Get fresh color list
    const colors = extractColors(animObj.data);
    const colorInfo = colors[colorIndex];
    if (!colorInfo) return;
    
    // Save for undo
    saveToUndoStack(animationId);
    
    // Convert hex to Lottie format
    const newLottieColor = hexToLottie(newHex);
    
    // Navigate and update using the reliable path
    setColorAtPath(animObj.data, colorInfo.path, newLottieColor);
    
    // Refresh animation
    refreshAnimation(animationId);
  }

  /**
   * REBUILT: Reliable path navigation and color setting
   */
  function setColorAtPath(data, path, newColor) {
    // Parse path like "layers[0].shapes[1].it[2].c"
    const parts = path.split('.').filter(p => p);
    let current = data;
    
    // Navigate to the parent of the color property
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      
      // Handle array notation like "layers[0]" or just "[0]"
      const arrayMatch = part.match(/(\w+)?\[(\d+)\]/);
      if (arrayMatch) {
        const propName = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        
        if (propName) {
          current = current[propName][index];
        } else {
          current = current[index];
        }
      } else {
        current = current[part];
      }
      
      if (!current) {
        console.error('Path navigation failed at:', part, 'in path:', path);
        return;
      }
    }
    
    // Set the color value - handle both static and animated
    const lastPart = parts[parts.length - 1]; // Should be 'c'
    if (lastPart === 'c' && current.c) {
      if (Array.isArray(current.c.k) && typeof current.c.k[0] === 'number') {
        // Static color: c.k = [r,g,b,a]
        current.c.k = newColor;
      } else if (current.c.k[0] && current.c.k[0].s) {
        // Animated color: c.k = [{t: 0, s: [r,g,b,a]}]
        current.c.k[0].s = newColor;
      }
    }
  }

  /**
   * Convert hex to Lottie color format
   */
  function hexToLottie(hex) {
    const r = parseInt(hex.slice(1,3), 16) / 255;
    const g = parseInt(hex.slice(3,5), 16) / 255;
    const b = parseInt(hex.slice(5,7), 16) / 255;
    return [r, g, b, 1]; // Alpha is typically 1 in Lottie
  }

  /**
   * Convert Lottie color format to hex
   */
  function lottieToHex(lottieColor) {
    const r = Math.round(lottieColor[0] * 255);
    const g = Math.round(lottieColor[1] * 255);
    const b = Math.round(lottieColor[2] * 255);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  }

  /**
   * Determine color type based on path
   */
  function getColorType(path) {
    if (path.includes('fill') || path.includes('fl')) return 'Fill';
    if (path.includes('stroke') || path.includes('st')) return 'Stroke';
    if (path.includes('bg')) return 'Background';
    if (path.includes('shadow')) return 'Shadow';
    if (path.includes('glow')) return 'Glow';
    if (path.includes('accent')) return 'Accent';
    return 'Color';
  }

  /**
   * Toggle colors section visibility
   */
  function toggleColorsSection(animationId) {
    const colorsSection = document.getElementById(`colors-${animationId}`);
    const toggleBtn = document.querySelector(`[data-id="${animationId}"].toggle-colors-btn`);
    
    if (!colorsSection || !toggleBtn) return;
    
    const isVisible = colorsSection.style.display !== 'none';
    
    if (isVisible) {
      colorsSection.style.display = 'none';
      toggleBtn.textContent = toggleBtn.textContent.replace('HIDE', 'EDIT');
    } else {
      colorsSection.style.display = 'block';
      toggleBtn.textContent = toggleBtn.textContent.replace('EDIT', 'HIDE');
    }
  }

  /**
   * Refresh animation with updated data
   */
  function refreshAnimation(animationId) {
    const animObj = animations.get(animationId);
    if (!animObj) return;

    // Destroy current animation
    animObj.anim.destroy();

    // Get container
    const playerId = `player-${animationId}`;
    const playerContainer = document.getElementById(playerId);
    if (!playerContainer) return;

    // Clear container
    playerContainer.innerHTML = '';

    // Load new animation with updated data
    const newAnim = lottie.loadAnimation({
      container: playerContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animObj.data
    });

    // Update the animation reference
    animObj.anim = newAnim;

    // Reattach progress event listener
    newAnim.addEventListener('enterFrame', () => {
      const pct = (newAnim.currentFrame / newAnim.totalFrames) * 100;
      const progressEl = document.getElementById(`progress-${animationId}`);
      if (progressEl) progressEl.style.width = pct + '%';
    });
  }

  /**
   * Save animation data to undo stack
   */
  function saveToUndoStack(animationId) {
    const animObj = animations.get(animationId);
    if (!animObj) return;

    if (!undoStacks.has(animationId)) {
      undoStacks.set(animationId, []);
    }
    
    // Add current state to undo stack (deep copy)
    undoStacks.get(animationId).push(JSON.parse(JSON.stringify(animObj.data)));
    
    // Limit stack size to prevent memory issues
    if (undoStacks.get(animationId).length > 20) {
      undoStacks.get(animationId).shift();
    }
  }

  /**
   * Remove animation
   */
  function removeAnim(id) {
    const animObj = animations.get(id);
    if (animObj) {
      animObj.anim.destroy();
      animations.delete(id);
    }
    const el = document.getElementById(id);
    if (el) el.remove();
    updateUI();
  }

  /**
   * Clear all animations
   */
  function clearAll() {
    animations.forEach(({ anim }) => anim.destroy());
    animations.clear();
    container.innerHTML = '';
    updateUI();
    showToast('All animations cleared');
  }

  /**
   * Update UI visibility
   */
  function updateUI() {
    animationsSection.style.display = animations.size > 0 ? 'block' : 'none';
  }

  /**
   * Show toast notification
   */
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Global functions for inline buttons
  window.handleUndo = function(animationId) {
    const undoStack = undoStacks.get(animationId);
    if (!undoStack || undoStack.length === 0) {
      showToast('Nothing to undo');
      return;
    }

    const animObj = animations.get(animationId);
    if (!animObj) return;

    // Restore previous state
    const previousState = undoStack.pop();
    animObj.data = previousState;
    
    // Refresh everything
    refreshAnimation(animationId);
    updateInlineColorDisplay(animationId);
    showToast('Undo successful');
  };

  window.downloadJson = function(animationId) {
    const animObj = animations.get(animationId);
    if (!animObj) {
      showToast('Animation not found');
      return;
    }

    const dataStr = JSON.stringify(animObj.data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const fileName = animObj.name.replace('.json', '_edited.json');
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = fileName;
    link.click();
    
    showToast(`Downloaded: ${fileName}`);
  };

  /**
   * Update inline color display after undo
   */
  function updateInlineColorDisplay(animationId) {
    const animObj = animations.get(animationId);
    if (!animObj) return;

    const colors = extractColors(animObj.data);
    const pickers = document.querySelectorAll(`[data-animation-id="${animationId}"].native-picker`);
    
    pickers.forEach((picker, index) => {
      if (colors[index]) {
        picker.value = colors[index].hex;
        const valueEl = picker.parentNode.querySelector('.color-value');
        if (valueEl) valueEl.textContent = colors[index].hex.toUpperCase();
      }
    });
  }
});