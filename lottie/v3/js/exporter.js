/**
 * Lottie Exporter - Video/GIF Export Module
 * Exports Lottie animations as WebM video or animated GIF
 * By Gamal Eldien | tools.gamaleldien.com
 */

/**
 * Export options configuration
 */
export const DEFAULT_OPTIONS = {
    format: 'webm',      // 'webm' | 'gif'
    width: null,         // null = use animation width
    height: null,        // null = use animation height
    fps: 30,
    quality: 0.8,        // 0-1 for webm, 1-30 for gif (lower = better)
    background: null,    // null = transparent, or '#ffffff', '#000000'
    loop: true
};

/**
 * Check if MediaRecorder is supported
 */
export function isWebMSupported() {
    return typeof MediaRecorder !== 'undefined' &&
        MediaRecorder.isTypeSupported('video/webm');
}

/**
 * LottieExporter class
 * Handles exporting Lottie animations to video or GIF
 */
export class LottieExporter {
    constructor(animationData, options = {}) {
        this.animationData = animationData;
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.canvas = null;
        this.ctx = null;
        this.animation = null;
        this.isExporting = false;
        this.progress = 0;
        this.onProgress = null;
        this.aborted = false;
    }

    /**
     * Get animation info
     */
    getAnimationInfo() {
        const data = this.animationData;
        return {
            width: data.w || 500,
            height: data.h || 500,
            fps: data.fr || 30,
            inPoint: data.ip || 0,
            outPoint: data.op || 60,
            totalFrames: (data.op || 60) - (data.ip || 0),
            duration: ((data.op || 60) - (data.ip || 0)) / (data.fr || 30)
        };
    }

    /**
     * Setup canvas and animation
     */
    setup() {
        const info = this.getAnimationInfo();

        // Determine output size
        const width = this.options.width || info.width;
        const height = this.options.height || info.height;

        // Create offscreen canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');

        // Create a container for lottie
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed; left:-9999px; top:-9999px; width:' + width + 'px; height:' + height + 'px;';
        document.body.appendChild(container);
        this.container = container;

        // Load animation with SVG renderer (more reliable)
        this.animation = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: JSON.parse(JSON.stringify(this.animationData))
        });

        return { width, height, info };
    }

    /**
     * Draw background if specified
     * For GIF transparency, we use a chroma key color (bright magenta) that gets marked as transparent
     */
    drawBackground() {
        if (this.options.background) {
            this.ctx.fillStyle = this.options.background;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else if (this.options.format === 'gif' && this._useChromaKey) {
            // For GIF with transparency: fill with chroma key color
            // This color will be marked as transparent in the GIF encoder
            this.ctx.fillStyle = '#FF00FF'; // Bright magenta chroma key
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * Capture current frame as image data
     */
    async captureFrame() {
        // Get SVG data
        const svg = this.container.querySelector('svg');
        if (!svg) return null;

        // Serialize SVG
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        // Draw to canvas
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.drawBackground();
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                URL.revokeObjectURL(url);
                resolve(true);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                resolve(false);
            };
            img.src = url;
        });
    }

    /**
     * Export as WebM video using MediaRecorder
     */
    async exportWebM() {
        if (!isWebMSupported()) {
            throw new Error('WebM export is not supported in this browser');
        }

        const { width, height, info } = this.setup();
        const totalFrames = info.totalFrames;
        const fps = Math.min(this.options.fps || info.fps, 60);
        const frameTime = 1000 / fps;

        return new Promise((resolve, reject) => {
            try {
                // Create stream from canvas
                const stream = this.canvas.captureStream(fps);

                // Setup MediaRecorder
                const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
                    ? 'video/webm;codecs=vp9'
                    : 'video/webm';

                const recorder = new MediaRecorder(stream, {
                    mimeType: mimeType,
                    videoBitsPerSecond: Math.floor(5000000 * this.options.quality)
                });

                const chunks = [];

                recorder.ondataavailable = (e) => {
                    if (e.data && e.data.size > 0) {
                        chunks.push(e.data);
                    }
                };

                recorder.onstop = () => {
                    this.cleanup();
                    if (this.aborted) {
                        reject(new Error('Export cancelled'));
                        return;
                    }
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    resolve(blob);
                };

                recorder.onerror = (e) => {
                    this.cleanup();
                    reject(e.error || new Error('Recording failed'));
                };

                // Start recording
                recorder.start(100); // Collect data every 100ms
                this.isExporting = true;

                let currentFrame = 0;

                const renderFrame = async () => {
                    if (this.aborted) {
                        recorder.stop();
                        return;
                    }

                    if (currentFrame >= totalFrames) {
                        // Give recorder time to finalize
                        setTimeout(() => recorder.stop(), 200);
                        return;
                    }

                    // Go to frame
                    this.animation.goToAndStop(currentFrame, true);

                    // Capture and draw
                    await this.captureFrame();

                    // Update progress
                    this.progress = (currentFrame / totalFrames) * 100;
                    if (this.onProgress) {
                        this.onProgress(this.progress, currentFrame, totalFrames);
                    }

                    currentFrame++;
                    setTimeout(renderFrame, frameTime);
                };

                // Start rendering
                renderFrame();

            } catch (err) {
                this.cleanup();
                reject(err);
            }
        });
    }

    /**
     * Export as GIF using gif.js
     */
    async exportGIF() {
        if (typeof GIF === 'undefined') {
            throw new Error('GIF.js library is not loaded');
        }

        const { width, height, info } = this.setup();
        const totalFrames = info.totalFrames;
        const fps = Math.min(this.options.fps || 15, 30); // GIFs work better at lower fps
        const frameDelay = Math.round(1000 / fps);

        // Only render every Nth frame based on target fps
        const sourcesFps = info.fps;
        const frameStep = Math.max(1, Math.round(sourcesFps / fps));
        const framesToRender = Math.ceil(totalFrames / frameStep);

        // For transparency: use bright magenta as chroma key
        // This color (0xFF00FF) will be marked as transparent in the final GIF
        const useTransparency = !this.options.background;
        const chromaKeyColor = 0xFF00FF; // Bright magenta - unlikely to be in actual animation
        
        // Enable chroma key mode for drawBackground()
        this._useChromaKey = useTransparency;

        return new Promise((resolve, reject) => {
            try {
                // Create GIF encoder with proper transparency settings
                const gifOptions = {
                    workers: 2,
                    quality: 10,
                    width: width,
                    height: height,
                    workerScript: 'libs/gif.worker.js'
                };
                
                if (useTransparency) {
                    // Enable transparency with magenta chroma key
                    gifOptions.transparent = chromaKeyColor;
                    // Don't set background - let it be transparent
                } else {
                    // Use specified background color
                    gifOptions.background = this.options.background;
                }
                
                const gif = new GIF(gifOptions);

                gif.on('finished', (blob) => {
                    this.cleanup();
                    resolve(blob);
                });

                gif.on('progress', (p) => {
                    // Second 50% is encoding
                    const encodeProgress = 50 + (p * 50);
                    if (this.onProgress) {
                        this.onProgress(encodeProgress, -1, -1, 'Encoding GIF...');
                    }
                });

                this.isExporting = true;

                // Capture frames
                const captureFrames = async () => {
                    let renderedCount = 0;

                    for (let frame = 0; frame < totalFrames; frame += frameStep) {
                        if (this.aborted) {
                            this.cleanup();
                            reject(new Error('Export cancelled'));
                            return;
                        }

                        // Go to frame
                        this.animation.goToAndStop(frame, true);

                        // Wait a tiny bit for render
                        await new Promise(r => setTimeout(r, 50));

                        // Capture frame
                        await this.captureFrame();

                        // Add frame to GIF
                        gif.addFrame(this.ctx, {
                            copy: true,
                            delay: frameDelay
                        });

                        // Update progress (first 50%)
                        renderedCount++;
                        this.progress = (renderedCount / framesToRender) * 50;
                        if (this.onProgress) {
                            this.onProgress(this.progress, renderedCount, framesToRender, 'Capturing frames...');
                        }
                    }

                    // Render the GIF
                    if (this.onProgress) {
                        this.onProgress(50, framesToRender, framesToRender, 'Encoding GIF...');
                    }
                    gif.render();
                };

                captureFrames().catch(reject);

            } catch (err) {
                this.cleanup();
                reject(err);
            }
        });
    }

    /**
     * Export animation based on format option
     */
    async export() {
        this.aborted = false;

        if (this.options.format === 'gif') {
            return this.exportGIF();
        } else {
            // Default to WebM, fallback to GIF if not supported
            if (isWebMSupported()) {
                return this.exportWebM();
            } else if (typeof GIF !== 'undefined') {
                console.warn('WebM not supported, falling back to GIF');
                return this.exportGIF();
            } else {
                throw new Error('No export format available. WebM not supported and GIF.js not loaded.');
            }
        }
    }

    /**
     * Abort the current export
     */
    abort() {
        this.aborted = true;
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        this.isExporting = false;
        this._useChromaKey = false; // Reset chroma key flag
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.canvas = null;
        this.ctx = null;
    }
}

/**
 * Helper function to trigger download
 */
export function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // Cleanup after a short delay
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 100);
}

/**
 * Quick export function
 */
export async function quickExport(animationData, filename, options = {}) {
    const exporter = new LottieExporter(animationData, options);
    const blob = await exporter.export();

    const ext = options.format === 'gif' ? 'gif' : 'webm';
    downloadBlob(blob, filename.replace('.json', `.${ext}`));

    return blob;
}
