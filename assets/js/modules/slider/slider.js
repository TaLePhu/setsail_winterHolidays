/**
 * Slider Component
 * Extends CarouselBase for hero slider with auto-play and content update
 */
class Slider extends CarouselBase {
    constructor(config = {}) {
        super(config);

        // Slider-specific elements
        this.slides = config.slides || [];
        this.contentInner = config.contentInner;
        this.contentTitle = config.contentTitle;
        this.contentSubtitle = config.contentSubtitle;
        this.contentText = config.contentText;

        // Slider-specific configuration
        this.slideContents = config.slideContents || [];
        this.autoPlayInterval = null;
        this.isAnimating = false;

        // Merge slider config
        this.options = {
            ...this.options,
            autoPlayInterval: config.autoPlayInterval || CONFIG.SLIDER.autoPlayInterval,
            autoPlay: config.autoPlay !== undefined ? config.autoPlay : CONFIG.SLIDER.autoPlay
        };

        this.initSlider();
    }

    /**
     * Initialize slider
     */
    initSlider() {
        this.setBackgroundImages();
        this.attachSliderEventListeners();

        // Show first slide
        if (this.slides[0]) {
            DOMHelpers.addClass(this.slides[0], 'slider__slide--zoom');
        }
        if (this.contentInner) {
            DOMHelpers.addClass(this.contentInner, 'slider__content--show');
        }

        // Start auto-play
        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }

    /**
     * Set background images from data-bg-url attribute
     */
    setBackgroundImages() {
        this.slides.forEach(slide => {
            const bgUrl = slide.getAttribute('data-bg-url');
            if (bgUrl) {
                slide.style.backgroundImage = bgUrl;
            }
        });
    }

    /**
     * Update slide content with fade animation
     */
    updateContent(slideIndex) {
        if (!this.contentInner || slideIndex >= this.slideContents.length) {
            return;
        }

        const content = this.slideContents[slideIndex];

        // Fade out
        DOMHelpers.removeClass(this.contentInner, 'slider__content--show');

        // Wait for fade out, then update content
        DOMHelpers.timeout(() => {
            if (this.contentTitle) {
                this.contentTitle.textContent = content.title;
            }
            if (this.contentSubtitle) {
                this.contentSubtitle.textContent = content.subtitle;
            }
            if (this.contentText) {
                this.contentText.textContent = content.text;
            }

            // Fade in with small delay
            DOMHelpers.timeout(() => {
                DOMHelpers.addClass(this.contentInner, 'slider__content--show');
            }, CONFIG.ANIMATION.fadeInDuration);
        }, CONFIG.ANIMATION.fadeOutDuration);
    }

    /**
     * Go to specific slide
     */
    goToSlide(slideIndex) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Reset all slides
        DOMHelpers.removeClassFromAll(this.slides, 'slider__slide--active');
        DOMHelpers.removeClassFromAll(this.slides, 'slider__slide--zoom');

        // Add active and zoom class to new slide
        if (this.slides[slideIndex]) {
            DOMHelpers.addClass(this.slides[slideIndex], 'slider__slide--active');
            
            // Trigger zoom animation with small delay
            DOMHelpers.raf(() => {
                DOMHelpers.addClass(this.slides[slideIndex], 'slider__slide--zoom');
            });
        }

        // Update content
        this.updateContent(slideIndex);
        this.currentIndex = slideIndex;
        this.updateActiveDot(slideIndex);

        // Allow next animation after delay
        DOMHelpers.timeout(() => {
            this.isAnimating = false;
        }, CONFIG.ANIMATION.transitionDelay);
    }

    /**
     * Move to next slide
     */
    slideNext() {
        const next = (this.currentIndex + 1) % this.slides.length;
        this.goToSlide(next);
    }

    /**
     * Move to previous slide
     */
    slidePrev() {
        const prev = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prev);
    }

    /**
     * Start auto-play
     */
    startAutoPlay() {
        this.autoPlayInterval = DOMHelpers.interval(
            () => this.slideNext(),
            this.options.autoPlayInterval
        );
    }

    /**
     * Stop auto-play
     */
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            DOMHelpers.clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    /**
     * Attach slider-specific event listeners
     */
    attachSliderEventListeners() {
        // Note: Parent class already handles drag/touch events
        
        // Auto-play pause on hover
        const sliderElement = this.container.closest('#slider');
        if (sliderElement) {
            DOMHelpers.on(sliderElement, 'mouseenter', () => this.stopAutoPlay());
            DOMHelpers.on(sliderElement, 'mouseleave', () => {
                if (this.options.autoPlay) {
                    this.startAutoPlay();
                }
            });
        }
    }

    /**
     * Set up navigation buttons
     */
    setNavButtons(prevBtn, nextBtn) {
        if (prevBtn) {
            DOMHelpers.on(prevBtn, 'click', () => {
                this.stopAutoPlay();
                this.slidePrev();
                if (this.options.autoPlay) {
                    this.startAutoPlay();
                }
            });
        }

        if (nextBtn) {
            DOMHelpers.on(nextBtn, 'click', () => {
                this.stopAutoPlay();
                this.slideNext();
                if (this.options.autoPlay) {
                    this.startAutoPlay();
                }
            });
        }
    }

    /**
     * Destroy slider
     */
    destroy() {
        this.stopAutoPlay();
        super.destroy();
    }
}

// Export for global use
window.Slider = Slider;
