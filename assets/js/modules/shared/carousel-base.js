/**
 * Base Carousel Class - Reusable carousel/slider logic
 * Provides common drag, swipe, and animation functionality
 */
class CarouselBase {
    constructor(config = {}) {
        // DOM Elements
        this.container = config.container;
        this.items = config.items;
        this.dots = config.dots || [];

        // Configuration
        this.options = {
            duration: config.duration || CONFIG.CAROUSEL.duration,
            easing: config.easing || CONFIG.CAROUSEL.easing,
            snapThreshold: config.snapThreshold || CONFIG.CAROUSEL.snapThreshold
        };

        // State
        this.isDragging = false;
        this.currentIndex = 0;
        this.itemWidth = 0;
        this.delta = 0;
        this.startX = 0;

        // Callbacks
        this.onSlideChange = config.onSlideChange || null;

        this.init();
    }

    /**
     * Initialize carousel
     */
    init() {
        this.attachEventListeners();
    }

    /**
     * Get width of single item
     */
    getItemWidth() {
        return DOMHelpers.getWidth(this.items[0]);
    }

    /**
     * Set CSS transition
     */
    setTransition(value) {
        DOMHelpers.setTransition(this.container, value);
    }

    /**
     * Set CSS transform translate
     */
    setTransform(x) {
        DOMHelpers.setTransform(this.container, `translateX(${x}px)`);
    }

    /**
     * Handle drag start
     */
    dragStart(x) {
        this.isDragging = true;
        this.startX = x;
        this.setTransition('none');
    }

    /**
     * Handle drag move
     */
    dragMove(x) {
        if (!this.isDragging) return;
        this.delta = x - this.startX;
        this.setTransform(this.delta);
    }

    /**
     * Handle drag end
     */
    dragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;

        this.itemWidth = this.getItemWidth();

        // Determine action based on drag distance
        if (this.delta < -this.itemWidth * this.options.snapThreshold) {
            this.slideNext();
        } else if (this.delta > this.itemWidth * this.options.snapThreshold) {
            this.slidePrev();
        } else {
            this.snapBack();
        }
    }

    /**
     * Snap back to original position
     */
    snapBack() {
        this.setTransition(`transform ${this.options.duration}s ${this.options.easing}`);
        this.setTransform(0);
        this.delta = 0;
    }

    /**
     * Slide to next item - Override in child class
     */
    slideNext() {
        throw new Error('slideNext() must be implemented in child class');
    }

    /**
     * Slide to previous item - Override in child class
     */
    slidePrev() {
        throw new Error('slidePrev() must be implemented in child class');
    }

    /**
     * Update active dot
     */
    updateActiveDot(index) {
        if (this.dots.length === 0) return;

        DOMHelpers.removeClassFromAll(this.dots, 'active');
        if (this.dots[index]) {
            DOMHelpers.addClass(this.dots[index], 'active');
        }
    }

    /**
     * Attach mouse and touch event listeners
     */
    attachEventListeners() {
        // Mouse events
        DOMHelpers.on(this.container, 'mousedown', (e) => this.dragStart(e.clientX));
        DOMHelpers.on(window, 'mousemove', (e) => this.dragMove(e.clientX));
        DOMHelpers.on(window, 'mouseup', () => this.dragEnd());

        // Touch events
        DOMHelpers.on(this.container, 'touchstart', (e) => this.dragStart(e.touches[0].clientX));
        DOMHelpers.on(this.container, 'touchmove', (e) => this.dragMove(e.touches[0].clientX));
        DOMHelpers.on(this.container, 'touchend', () => this.dragEnd());
    }

    /**
     * Destroy carousel - cleanup
     */
    destroy() {
        // Override in child class if needed
    }
}

// Export for global use
window.CarouselBase = CarouselBase;
