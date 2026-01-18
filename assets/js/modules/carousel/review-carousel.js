/**
 * Review Carousel Component
 * Multi-position carousel with dot-based navigation
 * - 3 visible items at a time
 * - 3 dots representing 3 positions (0, 3, 6)
 * - Auto-play every 3 seconds
 * - Dots get disabled when reaching their position
 * - Inertia (momentum) for smooth scrolling
 */
class ReviewCarousel extends CarouselBase {
    constructor(config = {}) {
        super(config);

        // Carousel-specific configuration
        this.options = {
            ...this.options,
            itemsPerView: config.itemsPerView || 3,
            autoPlay: config.autoPlay !== undefined ? config.autoPlay : true,
            autoPlayInterval: config.autoPlayInterval || 3000,
            inertia: true,
            inertiaDeceleration: 0.95, // 0-1: higher = slower deceleration
            inertiaMinVelocity: 0.5 // minimum velocity to trigger inertia
        };

        // Position tracking for dot management
        this.positions = [0, 3, 6]; // Position 0, 3, 6 for dots 1, 2, 3
        this.currentPosition = 0; // Track which position we're at (0, 3, or 6)
        this.disabledDots = new Set();

        // Auto-play state
        this.autoPlayTimer = null;

        // Inertia tracking
        this.dragStartTime = 0;
        this.lastDragX = 0;
        this.velocity = 0;
        this.inertiaTimer = null;

        this.initCarousel();
    }

    /**
     * Initialize carousel
     */
    initCarousel() {
        this.attachDotEventListeners();
        this.disableInitialDots();
        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }

    /**
     * Override dragStart to track time
     */
    dragStart(x) {
        super.dragStart(x);
        this.dragStartTime = Date.now();
        this.lastDragX = x;
        this.velocity = 0;
        this.stopInertia();
    }

    /**
     * Override dragMove to calculate velocity
     */
    dragMove(x) {
        super.dragMove(x);
        this.velocity = x - this.lastDragX;
        this.lastDragX = x;
    }

    /**
     * Override dragEnd to apply inertia
     */
    dragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;

        this.itemWidth = this.getItemWidth();
        const dragDistance = this.delta;
        const thresholdDistance = this.itemWidth * this.options.snapThreshold;

        // Determine action based on drag distance or velocity (inertia)
        const shouldSlideNext = dragDistance < -thresholdDistance || 
                                 (dragDistance < 0 && this.velocity < -this.options.inertiaMinVelocity);
        const shouldSlidePrev = dragDistance > thresholdDistance || 
                                 (dragDistance > 0 && this.velocity > this.options.inertiaMinVelocity);

        if (shouldSlideNext) {
            this.slideNext();
        } else if (shouldSlidePrev) {
            this.slidePrev();
        } else {
            // Apply inertia snap back
            this.applyInertia();
        }
    }

    /**
     * Apply inertia effect during snap back
     */
    applyInertia() {
        this.stopInertia();
        
        if (!this.options.inertia || Math.abs(this.velocity) < 0.1) {
            // No inertia, just snap back
            this.snapBack();
            return;
        }

        let currentVelocity = this.velocity;
        let currentDelta = this.delta;

        const applyInertiaFrame = () => {
            if (Math.abs(currentVelocity) < 0.01) {
                // Inertia stopped, snap back
                this.setTransition(`transform ${this.options.duration}s ${this.options.easing}`);
                this.setTransform(0);
                this.delta = 0;
                this.velocity = 0;
                return;
            }

            // Decelerate velocity
            currentVelocity *= this.options.inertiaDeceleration;
            currentDelta += currentVelocity;

            this.setTransition('none');
            this.setTransform(currentDelta);
            this.delta = currentDelta;

            this.inertiaTimer = DOMHelpers.raf(applyInertiaFrame);
        };

        this.inertiaTimer = DOMHelpers.raf(applyInertiaFrame);
    }

    /**
     * Stop inertia animation
     */
    stopInertia() {
        if (this.inertiaTimer) {
            cancelAnimationFrame(this.inertiaTimer);
            this.inertiaTimer = null;
        }
    }

    /**
     * Auto-play: slide next every N seconds
     */
    startAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
        }

        this.autoPlayTimer = DOMHelpers.interval(() => {
            this.autoSlideNext();
        }, this.options.autoPlayInterval);
    }

    /**
     * Stop auto-play
     */
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            DOMHelpers.clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    /**
     * Auto-slide to next item (always slides by 1 item)
     */
    autoSlideNext() {
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
     * Slide to next item (for drag/swipe)
     */
    slideNext() {
        this.stopAutoPlay();
        this.stopInertia();
        this.autoSlideNext();
        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }

    /**
     * Slide to previous item (for drag/swipe)
     */
    slidePrev() {
        this.stopAutoPlay();
        this.stopInertia();

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

        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }

    /**
     * Navigate to specific position using dot
     * Calculates how many items to move left/right
     */
    navigateToPosition(dotIndex) {
        if (this.isDragging) return;
        if (this.disabledDots.has(dotIndex)) return; // Can't click disabled dot

        this.stopAutoPlay();

        const targetPosition = this.positions[dotIndex];
        const itemDifference = targetPosition - this.currentPosition;

        if (itemDifference === 0) return; // Already at this position

        this.itemWidth = this.getItemWidth();
        this.setTransition(`transform ${this.options.duration}s ${this.options.easing}`);

        // Calculate translation: move by itemDifference items
        const translation = -itemDifference * this.itemWidth;
        this.setTransform(translation);

        // Update position and dots after animation
        DOMHelpers.once(this.container, 'transitionend', () => {
            // Move items in DOM based on direction
            if (itemDifference > 0) {
                // Moving right (dots 1 -> 2 -> 3): move first N items to end
                for (let i = 0; i < itemDifference; i++) {
                    DOMHelpers.append(this.container, DOMHelpers.getFirstChild(this.container));
                }
            } else {
                // Moving left (dots 3 -> 2 -> 1): move last N items to start
                for (let i = 0; i < Math.abs(itemDifference); i++) {
                    DOMHelpers.prepend(this.container, DOMHelpers.getLastChild(this.container));
                }
            }

            this.setTransition('none');
            this.setTransform(0);
            this.delta = 0;

            // Update tracking
            this.currentPosition = targetPosition;
            this.updateActiveDot(dotIndex);
            this.updateDisabledDots(dotIndex);

            if (this.options.autoPlay) {
                this.startAutoPlay();
            }
        });
    }

    /**
     * Disable initial dots: dot1 is disabled at start
     */
    disableInitialDots() {
        // Dot 1 (index 0) is disabled initially
        this.disabledDots.add(0);
        if (this.dots[0]) {
            DOMHelpers.addClass(this.dots[0], 'disabled');
        }
    }

    /**
     * Update which dots are disabled/enabled based on current position
     */
    updateDisabledDots(activeDotIndex) {
        this.disabledDots.clear();
        this.disabledDots.add(activeDotIndex); // Current dot is always disabled

        // Update DOM classes
        this.dots.forEach((dot, index) => {
            if (this.disabledDots.has(index)) {
                DOMHelpers.addClass(dot, 'disabled');
            } else {
                DOMHelpers.removeClass(dot, 'disabled');
            }
        });
    }

    /**
     * Attach dot click event listeners
     */
    attachDotEventListeners() {
        if (this.dots.length === 0) return;

        this.dots.forEach((dot, index) => {
            DOMHelpers.on(dot, 'click', () => {
                this.navigateToPosition(index);
            });
        });
    }

    /**
     * Destroy carousel
     */
    destroy() {
        this.stopAutoPlay();
        this.stopInertia();
        super.destroy();
    }
}

// Export for global use
window.ReviewCarousel = ReviewCarousel;
