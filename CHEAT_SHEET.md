# 🎯 Refactored Code Cheat Sheet

## File Dependencies

```
index.html
    ↓
┌─────────────────────────────────────────┐
│  Core (Load First - No Dependencies)    │
├─────────────────────────────────────────┤
│  1️⃣ config.js                          │
│  2️⃣ dom-helpers.js                     │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Base (Load Second - Uses Core)        │
├─────────────────────────────────────────┤
│  3️⃣ carousel-base.js                   │
│     Uses: CONFIG, DOMHelpers           │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Components (Load Third - Uses Base)   │
├─────────────────────────────────────────┤
│  4️⃣ slider.js                          │
│     Extends: CarouselBase              │
│  5️⃣ tour-carousel.js                   │
│     Extends: CarouselBase              │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│  Application (Load Last - Initializes) │
├─────────────────────────────────────────┤
│  6️⃣ app.js                             │
│     Uses: Slider, TourCarousel, etc.   │
└─────────────────────────────────────────┘
```

---

## Class Methods Reference

### CarouselBase (Base Class)

```javascript
// Drag methods
dragStart(x)              // Start drag
dragMove(x)              // During drag
dragEnd()                // End drag

// Animation methods
slideNext()              // ⚠️ Abstract - override
slidePrev()              // ⚠️ Abstract - override
snapBack()               // Snap to original position

// Utility methods
getItemWidth()           // Get item width
setTransform(x)          // Set translateX
setTransition(value)     // Set CSS transition
updateActiveDot(index)   // Update dot class
attachEventListeners()   // Setup mouse/touch

// Lifecycle
destroy()                // Cleanup
```

### Slider (Hero Slider)

```javascript
// Core methods (from base - no override needed)
dragStart(x), dragMove(x), dragEnd()

// Override methods
slideNext()              // Go to next slide
slidePrev()              // Go to previous slide

// Slider-specific
goToSlide(index)         // Go to specific slide
updateContent(index)     // Fade content
startAutoPlay()          // Start auto-play
stopAutoPlay()           // Stop auto-play
setNavButtons(prev, next) // Setup buttons
setBackgroundImages()    // Init bg images

// Properties
slideContents[]          // Array of content
contentInner             // Content DOM element
autoPlayInterval         // Interval ID
isAnimating              // Animation flag
```

### TourCarousel (Carousel)

```javascript
// Core methods (from base - no override needed)
dragStart(x), dragMove(x), dragEnd()

// Override methods
slideNext()              // Slide & move items
slidePrev()              // Slide & move items

// Carousel-specific
navigateToItem(index)    // Go to item via dot
attachDotEventListeners() // Setup dot listeners

// Properties
options.loop             // Infinite loop flag
currentIndex             // Current item index
```

---

## CONFIG Object

```javascript
CONFIG = {
    // Hero Slider
    SLIDER: {
        duration: 0.3,           // Animation duration in seconds
        easing: 'ease',          // CSS easing function
        autoPlayInterval: 3000,  // Auto-play delay in ms
        snapThreshold: 0.25,     // Drag threshold (1/4 = 25%)
        autoPlay: true           // Enable auto-play
    },

    // Carousel
    CAROUSEL: {
        duration: 0.3,           // Animation duration in seconds
        easing: 'ease',          // CSS easing function
        snapThreshold: 0.25,     // Drag threshold (1/4 = 25%)
    },

    // Animation timings
    ANIMATION: {
        fadeOutDuration: 400,    // Content fade out (ms)
        fadeInDuration: 50,      // Content fade in (ms)
        transitionDelay: 3000    // Animation complete delay (ms)
    }
}

// Access anywhere:
CONFIG.SLIDER.duration  // → 0.3
CONFIG.CAROUSEL.duration // → 0.3
```

---

## DOMHelpers Methods (24 total)

```javascript
// Query
DOMHelpers.query(selector)           // querySelector
DOMHelpers.queryAll(selector)        // querySelectorAll

// Classes
DOMHelpers.addClass(el, name)        // classList.add
DOMHelpers.removeClass(el, name)     // classList.remove
DOMHelpers.toggleClass(el, name)     // classList.toggle
DOMHelpers.hasClass(el, name)        // classList.contains
DOMHelpers.removeClassFromAll(els, name)

// Styles
DOMHelpers.setTransition(el, value)  // style.transition
DOMHelpers.setTransform(el, value)   // style.transform
DOMHelpers.setStyles(el, styles)     // Multiple styles

// Dimensions
DOMHelpers.getWidth(el)              // offsetWidth

// DOM Manipulation
DOMHelpers.getFirstChild(el)         // firstElementChild
DOMHelpers.getLastChild(el)          // lastElementChild
DOMHelpers.append(parent, child)     // appendChild
DOMHelpers.prepend(parent, child)    // insertBefore

// Events
DOMHelpers.on(el, event, handler)    // addEventListener
DOMHelpers.off(el, event, handler)   // removeEventListener
DOMHelpers.once(el, event, handler)  // addEventListener once

// Timing
DOMHelpers.raf(callback)             // requestAnimationFrame
DOMHelpers.timeout(fn, delay)        // setTimeout
DOMHelpers.clearTimeout(id)          // clearTimeout
DOMHelpers.interval(fn, delay)       // setInterval
DOMHelpers.clearInterval(id)         // clearInterval
```

---

## Common Usage Patterns

### Initialize Slider

```javascript
const slider = new Slider({
    container: DOMHelpers.query('.slider__slides-container'),
    slides: DOMHelpers.queryAll('.slider__slide'),
    contentInner: DOMHelpers.query('.slider__content-inner'),
    contentTitle: DOMHelpers.query('.slider__content-title'),
    contentSubtitle: DOMHelpers.query('.slider__content-subtitle'),
    contentText: DOMHelpers.query('.slider__content-text'),
    slideContents: [
        { title: "...", subtitle: "...", text: "..." },
        { title: "...", subtitle: "...", text: "..." }
    ],
    duration: CONFIG.SLIDER.duration,
    autoPlay: CONFIG.SLIDER.autoPlay
});

slider.setNavButtons(prevBtn, nextBtn);
```

### Initialize Carousel

```javascript
const carousel = new TourCarousel({
    container: DOMHelpers.query('.tour-list'),
    items: DOMHelpers.queryAll('.tour-item'),
    dots: DOMHelpers.queryAll('.dot'),
    duration: CONFIG.CAROUSEL.duration,
    snapThreshold: CONFIG.CAROUSEL.snapThreshold
});
```

### Access from Console

```javascript
// Get instances
window.appInstances.slider
window.appInstances.tourCarousel

// Call methods
window.appInstances.slider.slideNext()
window.appInstances.slider.goToSlide(2)
window.appInstances.tourCarousel.navigateToItem(0)

// Check state
window.appInstances.slider.currentIndex
window.appInstances.slider.isDragging
window.appInstances.slider.isAnimating
```

---

## Event Flow Diagram (Simple)

```
┌─────────────────────────┐
│   User Input            │
│ (Drag/Touch/Click)      │
└────────┬────────────────┘
         │
    ┌────▼─────┐
    │ dragStart │  Store position
    └────┬─────┘
         │
    ┌────▼──────┐
    │ dragMove  │  Update visual
    └────┬──────┘
         │
    ┌────▼────┐
    │ dragEnd  │  Determine action
    └────┬────┘
         │
   ┌─────┴──────────┐
   │                │
   ▼ Swipe?    ▼ Tap?
slideNext()  snapBack()
   │              │
   ▼              ▼
Animation    Reset Position
   │
   └─→ Done!
```

---

## Modification Checklist

### To change animation speed:

```javascript
// Edit: assets/js/core/config.js
CONFIG.SLIDER.duration = 0.5  // From 0.3 to 0.5
```
✅ Changes apply to all sliders

### To disable auto-play:

```javascript
// Edit: assets/js/core/config.js
CONFIG.SLIDER.autoPlay = false  // From true to false
```
✅ Changes apply to all sliders

### To adjust drag threshold:

```javascript
// Edit: assets/js/core/config.js
CONFIG.CAROUSEL.snapThreshold = 0.2  // From 0.25 to 0.2
```
✅ Need to drag less distance to trigger

### To add custom carousel:

```javascript
// 1. Create file: assets/js/modules/carousel/custom.js
class CustomCarousel extends CarouselBase {
    slideNext() { /* ... */ }
    slidePrev() { /* ... */ }
}

// 2. Load in index.html
<script src="./assets/js/modules/carousel/custom.js"></script>

// 3. Initialize in app.js
const custom = new CustomCarousel({ ... });
```

---

## Inheritance Example

```javascript
// Step 1: All methods available from base
class TourCarousel extends CarouselBase {
    // Inherit:
    // ✓ dragStart()        ✓ getItemWidth()
    // ✓ dragMove()         ✓ setTransform()
    // ✓ dragEnd()          ✓ setTransition()
    // ✓ snapBack()         ✓ updateActiveDot()
    
    // Step 2: Override specific methods
    slideNext() {
        // Custom implementation for carousel
    }
    
    slidePrev() {
        // Custom implementation for carousel
    }
    
    // Step 3: Add carousel-specific methods
    navigateToItem(index) {
        // Only in TourCarousel
    }
}
```

---

## Error Prevention

```javascript
// ❌ WRONG - Global state
let isDragging = false;
let startX = 0;
function dragStart(x) { ... }

// ✅ RIGHT - Encapsulated in class
class Carousel {
    constructor() {
        this.isDragging = false;
        this.startX = 0;
    }
    dragStart(x) { ... }
}

// ❌ WRONG - Hardcoded values
setTransition('transform 0.3s ease');

// ✅ RIGHT - Configuration
setTransition(`transform ${this.options.duration}s ${this.options.easing}`);

// ❌ WRONG - Direct DOM manipulation
document.querySelector('.item').style.transform = 'translateX(100px)';

// ✅ RIGHT - Using helpers
DOMHelpers.setTransform(element, 'translateX(100px)');
```

---

## Performance Tips

1. **Use CONFIG** instead of hardcoded values
2. **Use DOMHelpers** for consistent DOM access
3. **Cache DOM queries** in constructor
4. **Use requestAnimationFrame** for animations
5. **Remove event listeners** when not needed
6. **Avoid repeated DOM queries** in loops

---

## Testing Command (Console)

```javascript
// Copy-paste this entire block into console:
(function() {
    console.log('=== REFACTORED CODE TEST ===');
    
    // Check core
    console.log('✓ CONFIG:', !!window.CONFIG);
    console.log('✓ DOMHelpers:', !!window.DOMHelpers);
    console.log('✓ CarouselBase:', !!window.CarouselBase);
    console.log('✓ Slider:', !!window.Slider);
    console.log('✓ TourCarousel:', !!window.TourCarousel);
    
    // Check instances
    console.log('✓ Slider instance:', !!window.appInstances?.slider);
    console.log('✓ Carousel instance:', !!window.appInstances?.tourCarousel);
    
    // Test methods
    if (window.appInstances?.slider) {
        console.log('Slider methods:', {
            slideNext: typeof window.appInstances.slider.slideNext,
            updateContent: typeof window.appInstances.slider.updateContent,
            goToSlide: typeof window.appInstances.slider.goToSlide
        });
    }
    
    console.log('=== ALL TESTS PASSED ===');
})();
```

---

**Print this page for desk reference!** 🎯
