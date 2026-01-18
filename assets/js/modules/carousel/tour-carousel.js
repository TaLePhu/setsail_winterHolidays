/**
 * Tour Carousel Component
 * Extends CarouselBase for infinite carousel with dot navigation
 */
class TourCarousel extends CarouselBase {
    constructor(config = {}) {
        super(config);

        // Carousel-specific configuration
        this.options = {
            ...this.options,
            loop: config.loop !== undefined ? config.loop : true
        };

        this.initCarousel();
    }

    /**
     * Initialize carousel
     */
    initCarousel() {
        this.attachDotEventListeners();
    }

    /**
     * Slide to next item (infinite loop)
     */
    slideNext() {
        this.itemWidth = this.getItemWidth();
        this.setTransition(`transform ${this.options.duration}s ${this.options.easing}`);
        this.setTransform(-this.itemWidth);

        // After animation, move item to end and reset position
        DOMHelpers.once(this.container, 'transitionend', () => {
            DOMHelpers.append(this.container, DOMHelpers.getFirstChild(this.container));
            this.setTransition('none');
            this.setTransform(0);
            this.delta = 0;
        });
    }

    /**
     * Slide to previous item (infinite loop)
     */
    slidePrev() {
        this.itemWidth = this.getItemWidth();
        this.setTransition('none');
        DOMHelpers.prepend(this.container, DOMHelpers.getLastChild(this.container));
        this.setTransform(-this.itemWidth);

        // Trigger animation on next frame
        DOMHelpers.raf(() => {
            this.setTransition(`transform ${this.options.duration}s ${this.options.easing}`);
            this.setTransform(0);
            this.delta = 0;
        });
    }

    /**
     * Navigate to specific item using dot
     */
    navigateToItem(index) {
        if (this.isDragging) return;

        this.itemWidth = this.getItemWidth();

        // Update active dot
        this.updateActiveDot(index);

        // Animate to position
        this.setTransition(`transform ${this.options.duration}s ${this.options.easing}`);
        this.setTransform(-index * this.itemWidth);

        this.currentIndex = index;
    }

    /**
     * Attach dot click event listeners
     */
    attachDotEventListeners() {
        if (this.dots.length === 0) return;

        this.dots.forEach(dot => {
            DOMHelpers.on(dot, 'click', () => {
                if (DOMHelpers.hasClass(dot, 'active')) return;

                const index = Number(dot.getAttribute('data-slide-to'));
                this.navigateToItem(index);
            });
        });
    }

    /**
     * Destroy carousel
     */
    destroy() {
        // Remove dot listeners if needed
        super.destroy();
    }
}

// Export for global use
window.TourCarousel = TourCarousel;
