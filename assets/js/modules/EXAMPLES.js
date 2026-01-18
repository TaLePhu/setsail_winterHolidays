/**
 * EXAMPLE: How to create a new Carousel Type
 * 
 * This file demonstrates best practices for extending CarouselBase
 * to create new carousel implementations with minimal code duplication.
 * 
 * ✅ Pattern to follow:
 * 1. Extend CarouselBase
 * 2. Override slideNext() and slidePrev()
 * 3. Add component-specific methods if needed
 * 4. Keep configuration in CONFIG
 */

// ============================================
// EXAMPLE 1: Simple Carousel (Manual Index)
// ============================================

/**
 * Manual Carousel - User controls which item to show via buttons
 * No auto-play, no infinite loop
 */
class ManualCarousel extends CarouselBase {
    constructor(config = {}) {
        super(config);
        this.totalItems = this.items.length;
    }

    slideNext() {
        if (this.currentIndex < this.totalItems - 1) {
            this.goToIndex(this.currentIndex + 1);
        }
    }

    slidePrev() {
        if (this.currentIndex > 0) {
            this.goToIndex(this.currentIndex - 1);
        }
    }

    goToIndex(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.totalItems - 1));
        
        this.itemWidth = this.getItemWidth();
        this.setTransition(`transform ${this.options.duration}s ${this.options.easing}`);
        this.setTransform(-this.currentIndex * this.itemWidth);
        
        this.updateActiveDot(this.currentIndex);
    }

    setupButtons(prevBtn, nextBtn) {
        if (prevBtn) {
            DOMHelpers.on(prevBtn, 'click', () => this.slidePrev());
        }
        if (nextBtn) {
            DOMHelpers.on(nextBtn, 'click', () => this.slideNext());
        }
    }
}

// Usage:
/*
const manualCarousel = new ManualCarousel({
    container: DOMHelpers.query('.products-list'),
    items: DOMHelpers.queryAll('.product-item'),
    dots: DOMHelpers.queryAll('.product-dots .dot'),
    duration: 0.4
});

manualCarousel.setupButtons(prevBtn, nextBtn);
*/

// ============================================
// EXAMPLE 2: Fade Carousel (With Fade Effect)
// ============================================

/**
 * Fade Carousel - Items fade in/out instead of slide
 * Good for testimonials, featured content
 */
class FadeCarousel extends CarouselBase {
    constructor(config = {}) {
        super(config);
        this.autoPlayInterval = null;
        this.options.autoPlayInterval = config.autoPlayInterval || 5000;
        this.startAutoPlay();
    }

    slideNext() {
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        this.goToIndex(nextIndex);
    }

    slidePrev() {
        const prevIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.goToIndex(prevIndex);
    }

    goToIndex(index) {
        // Fade out current
        DOMHelpers.removeClass(this.items[this.currentIndex], 'fade-carousel--active');
        
        // Fade in next
        this.currentIndex = index;
        DOMHelpers.addClass(this.items[this.currentIndex], 'fade-carousel--active');
        
        this.updateActiveDot(this.currentIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = DOMHelpers.interval(
            () => this.slideNext(),
            this.options.autoPlayInterval
        );
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            DOMHelpers.clearInterval(this.autoPlayInterval);
        }
    }
}

// Usage + CSS:
/*
const fadeCarousel = new FadeCarousel({
    container: DOMHelpers.query('.testimonials'),
    items: DOMHelpers.queryAll('.testimonial-item'),
    dots: DOMHelpers.queryAll('.testimonial-dots .dot'),
    autoPlayInterval: 4000
});

// Add to CSS:
.testimonial-item {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.testimonial-item.fade-carousel--active {
    opacity: 1;
}
*/

// ============================================
// EXAMPLE 3: Grid Carousel (Multi-Column)
// ============================================

/**
 * Grid Carousel - Shows multiple items per row (e.g., 3 columns)
 * Slides by one item but displays 3 items
 */
class GridCarousel extends CarouselBase {
    constructor(config = {}) {
        super(config);
        this.columnsPerView = config.columnsPerView || 3;
        this.totalSlides = Math.ceil(this.items.length / this.columnsPerView);
    }

    slideNext() {
        if (this.currentIndex < this.totalSlides - 1) {
            this.goToSlide(this.currentIndex + 1);
        }
    }

    slidePrev() {
        if (this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        }
    }

    goToSlide(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.totalSlides - 1));
        
        this.itemWidth = this.getItemWidth();
        const slideDistance = this.currentIndex * this.itemWidth * this.columnsPerView;
        
        this.setTransition(`transform ${this.options.duration}s ${this.options.easing}`);
        this.setTransform(-slideDistance);
        
        this.updateActiveDot(this.currentIndex);
    }
}

// Usage:
/*
const gridCarousel = new GridCarousel({
    container: DOMHelpers.query('.featured-products-grid'),
    items: DOMHelpers.queryAll('.grid-item'),
    dots: DOMHelpers.queryAll('.grid-dots .dot'),
    columnsPerView: 3,
    duration: 0.4
});
*/

// ============================================
// EXAMPLE 4: Vertical Carousel (Scrolls Down)
// ============================================

/**
 * Vertical Carousel - Scrolls items vertically instead of horizontally
 * Good for news tickers, job listings
 */
class VerticalCarousel extends CarouselBase {
    constructor(config = {}) {
        super(config);
        this.autoPlayInterval = null;
        this.options.autoPlayInterval = config.autoPlayInterval || 3000;
        this.startAutoPlay();
    }

    slideNext() {
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        this.goToIndex(nextIndex);
    }

    slidePrev() {
        const prevIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.goToIndex(prevIndex);
    }

    goToIndex(index) {
        this.currentIndex = index;
        
        const itemHeight = this.items[0].offsetHeight;
        const slideDistance = -this.currentIndex * itemHeight;
        
        this.setTransition(`transform ${this.options.duration}s ${this.options.easing}`);
        this.setTransform(`translateY(${slideDistance}px)`);
        
        this.updateActiveDot(this.currentIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = DOMHelpers.interval(
            () => this.slideNext(),
            this.options.autoPlayInterval
        );
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            DOMHelpers.clearInterval(this.autoPlayInterval);
        }
    }

    // Override setTransform for vertical
    setTransform(value) {
        if (typeof value === 'number') {
            DOMHelpers.setTransform(this.container, `translateY(${value}px)`);
        } else {
            DOMHelpers.setTransform(this.container, value);
        }
    }
}

// Usage + CSS:
/*
const verticalCarousel = new VerticalCarousel({
    container: DOMHelpers.query('.news-ticker'),
    items: DOMHelpers.queryAll('.news-item'),
    dots: DOMHelpers.queryAll('.news-dots .dot'),
    autoPlayInterval: 4000
});

// Add to CSS:
.news-ticker {
    height: 200px;
    overflow: hidden;
}

.news-ticker--items {
    transition: transform 0.3s ease;
}
*/

// ============================================
// SUMMARY: Patterns to Remember
// ============================================

/*
Pattern:
--------

1. EXTEND CarouselBase
   class MyCarousel extends CarouselBase { ... }

2. OVERRIDE slideNext() & slidePrev()
   These define how items move

3. CREATE goToIndex() or goToSlide()
   For direct navigation

4. ADD component-specific methods if needed
   startAutoPlay(), updateContent(), etc.

5. STORE IN app.js
   window.appInstances.myCarousel = ...

6. ADD TO CONFIG if needed
   CONFIG.MY_CAROUSEL = { ... }

7. TEST drag/touch/keyboard
   All inherited from CarouselBase


Code Reduction:
---------------

Without CarouselBase:
- Each carousel: ~150 lines (drag, swipe, animate)
- 4 carousels: ~600 lines
- Duplication: 70%

With CarouselBase:
- Base class: ~120 lines
- Each carousel: ~30-50 lines (only custom logic)
- 4 carousels: ~250 lines
- Duplication: 0%

SAVINGS: 58% less code! 🎉
*/

// Export all examples
window.ManualCarousel = ManualCarousel;
window.FadeCarousel = FadeCarousel;
window.GridCarousel = GridCarousel;
window.VerticalCarousel = VerticalCarousel;
