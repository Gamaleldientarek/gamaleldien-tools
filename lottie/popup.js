const animations = new Map();
let animId = 0;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const container = document.getElementById('animationsContainer');
  const actions = document.getElementById('actions');
  const clearAllBtn = document.getElementById('clearAll');
  const gifModal = document.getElementById('gifModal');
  const gifModalClose = document.getElementById('gifModalClose');
  const gifProgressBar = document.getElementById('gifProgressBar');
  const gifStatus = document.getElementById('gifStatus');

  // Check if lottie is loaded
  if (typeof lottie === 'undefined') {
    console.error('Lottie library not loaded!');
    dropZone.innerHTML = '<p style="color: #ff4757;">Error: Lottie library failed to load</p>';
    return;
  }

  console.log('Lottie Previewer initialized');

  // Modal close handler
  gifModalClose.addEventListener('click', () => {
    gifModal.classList.remove('active');
  });

  // Drag and drop
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
  });

  clearAllBtn.addEventListener('click', clearAll);

  function handleFiles(files) {
    [...files].forEach(file => {
      console.log('Processing file:', file.name);
      if (file.name.endsWith('.json') || file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = e => {
          try {
            const data = JSON.parse(e.target.result);
            console.log('Parsed JSON:', file.name, 'has layers:', !!data.layers);
            if (data.v && data.layers) {
              createCard(data, file.name);
            } else {
              console.warn('Not a valid Lottie file:', file.name);
            }
          } catch (err) {
            console.error('Invalid JSON:', file.name, err);
          }
        };
        reader.onerror = err => console.error('File read error:', err);
        reader.readAsText(file);
      }
    });
  }

  function createCard(animData, fileName) {
    const id = `anim-${animId++}`;
    const fps = animData.fr || 30;
    const frames = animData.op - animData.ip;
    const duration = (frames / fps).toFixed(1);

    console.log('Creating card for:', fileName, 'FPS:', fps, 'Duration:', duration);

    const card = document.createElement('div');
    card.className = 'anim-card';
    card.id = id;
    card.innerHTML = `
      <div class="anim-header">
        <div class="anim-player" id="player-${id}"></div>
        <div class="anim-info">
          <h3 title="${fileName}">${fileName}</h3>
          <div class="anim-meta">
            <span>${animData.w || '?'}x${animData.h || '?'}</span>
            <span>${fps}fps</span>
            <span>${duration}s</span>
          </div>
        </div>
        <button class="remove-btn" data-id="${id}">x</button>
      </div>
      <div class="anim-controls">
        <div class="control-row">
          <button class="ctrl-btn" data-action="play" data-id="${id}">Play</button>
          <button class="ctrl-btn" data-action="pause" data-id="${id}">Pause</button>
          <button class="ctrl-btn" data-action="stop" data-id="${id}">Stop</button>
        </div>
        <div class="speed-row">
          <label>Speed:</label>
          <input type="range" class="speed-slider" min="0.1" max="3" step="0.1" value="1" data-id="${id}">
          <span class="speed-value" id="speed-${id}">1x</span>
        </div>
        <div class="progress-bar" data-id="${id}">
          <div class="progress-fill" id="progress-${id}"></div>
        </div>
        <button class="export-gif-btn" data-id="${id}">Export GIF</button>
      </div>
    `;

    container.appendChild(card);

    const playerContainer = document.getElementById(`player-${id}`);
    console.log('Player container found:', !!playerContainer);

    try {
      const anim = lottie.loadAnimation({
        container: playerContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animData
      });

      console.log('Animation loaded successfully for:', fileName);

      anim.addEventListener('enterFrame', () => {
        const pct = (anim.currentFrame / anim.totalFrames) * 100;
        const progressEl = document.getElementById(`progress-${id}`);
        if (progressEl) progressEl.style.width = pct + '%';
      });

      anim.addEventListener('error', (err) => {
        console.error('Lottie animation error:', err);
      });

      animations.set(id, { anim, data: animData, name: fileName });
      updateUI();

      // Event listeners for this card
      card.querySelector('.remove-btn').addEventListener('click', () => removeAnim(id));

      card.querySelectorAll('.ctrl-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.action;
          const a = animations.get(id).anim;
          if (action === 'play') a.play();
          if (action === 'pause') a.pause();
          if (action === 'stop') a.stop();
        });
      });

      card.querySelector('.speed-slider').addEventListener('input', e => {
        const speed = parseFloat(e.target.value);
        animations.get(id).anim.setSpeed(speed);
        document.getElementById(`speed-${id}`).textContent = speed + 'x';
      });

      card.querySelector('.progress-bar').addEventListener('click', e => {
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        const a = animations.get(id).anim;
        a.goToAndPlay(Math.floor(pct * a.totalFrames), true);
      });

      // Export GIF button handler
      card.querySelector('.export-gif-btn').addEventListener('click', () => {
        exportGif(id);
      });

    } catch (err) {
      console.error('Failed to load animation:', fileName, err);
      card.innerHTML = `<div style="padding: 10px; color: #ff4757;">Failed to load: ${fileName}</div>`;
    }
  }

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

  function clearAll() {
    animations.forEach(({ anim }) => anim.destroy());
    animations.clear();
    container.innerHTML = '';
    updateUI();
  }

  function updateUI() {
    actions.style.display = animations.size > 0 ? 'flex' : 'none';
  }

  async function exportGif(id) {
    const animObj = animations.get(id);
    if (!animObj) {
      console.error('Animation not found:', id);
      return;
    }

    const { data: animData, name: fileName } = animObj;
    const fps = animData.fr || 30;
    const totalFrames = Math.floor(animData.op - animData.ip);
    const width = animData.w || 300;
    const height = animData.h || 300;

    // Show modal
    gifModal.classList.add('active');
    gifProgressBar.style.width = '0%';
    gifStatus.textContent = 'Initializing...';

    // Create offscreen container for rendering
    const offscreenContainer = document.createElement('div');
    offscreenContainer.style.cssText = `
      position: fixed;
      left: -9999px;
      top: -9999px;
      width: ${width}px;
      height: ${height}px;
      background: transparent;
    `;
    document.body.appendChild(offscreenContainer);

    // Create canvas for capturing frames
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Create a new lottie animation for export (using canvas renderer for better capture)
    const exportAnim = lottie.loadAnimation({
      container: offscreenContainer,
      renderer: 'canvas',
      loop: false,
      autoplay: false,
      animationData: JSON.parse(JSON.stringify(animData)),
      rendererSettings: {
        context: ctx,
        clearCanvas: true,
        preserveAspectRatio: 'xMidYMid slice'
      }
    });

    // Wait for animation to be ready
    await new Promise(resolve => {
      exportAnim.addEventListener('DOMLoaded', resolve);
    });

    // Check if GIF library is loaded
    if (typeof GIF === 'undefined') {
      gifStatus.textContent = 'Error: GIF library not loaded';
      console.error('GIF library not loaded');
      exportAnim.destroy();
      offscreenContainer.remove();
      return;
    }

    // Initialize GIF encoder
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: width,
      height: height,
      workerScript: chrome.runtime.getURL('libs/gif.worker.js'),
      transparent: null,
      background: '#ffffff'
    });

    gifStatus.textContent = 'Capturing frames...';

    // Calculate frame delay in milliseconds
    const frameDelay = Math.round(1000 / fps);

    // Capture frames
    const frameStep = Math.max(1, Math.floor(fps / 20)); // Limit to ~20 fps for GIF to keep size reasonable
    const framesToCapture = [];

    for (let i = 0; i < totalFrames; i += frameStep) {
      framesToCapture.push(i);
    }

    for (let i = 0; i < framesToCapture.length; i++) {
      const frameNum = framesToCapture[i];

      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Go to specific frame
      exportAnim.goToAndStop(frameNum, true);

      // Force render
      exportAnim.renderer.renderFrame(frameNum);

      // Add frame to GIF
      gif.addFrame(ctx, { copy: true, delay: frameDelay * frameStep });

      // Update progress
      const progress = Math.round(((i + 1) / framesToCapture.length) * 50);
      gifProgressBar.style.width = progress + '%';
      gifStatus.textContent = `Capturing frame ${i + 1} of ${framesToCapture.length}...`;

      // Yield to UI thread
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    gifStatus.textContent = 'Encoding GIF...';

    // Handle GIF progress
    gif.on('progress', p => {
      const progress = 50 + Math.round(p * 50);
      gifProgressBar.style.width = progress + '%';
    });

    // Handle GIF finished
    gif.on('finished', blob => {
      gifProgressBar.style.width = '100%';
      gifStatus.textContent = 'Download starting...';

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.replace('.json', '.gif');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Cleanup
      exportAnim.destroy();
      offscreenContainer.remove();

      // Close modal after a short delay
      setTimeout(() => {
        gifModal.classList.remove('active');
        gifProgressBar.style.width = '0%';
      }, 1000);
    });

    // Start rendering
    gif.render();
  }
});
