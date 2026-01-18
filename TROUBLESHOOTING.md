# 🔧 Troubleshooting Guide

## ❌ Problem: Slider not working

### Solution 1: Check script loading order
```
Check DevTools → Sources tab

Should see in this order:
1. config.js ✓
2. dom-helpers.js ✓
3. carousel-base.js ✓
4. slider.js ✓
5. tour-carousel.js ✓
6. app.js ✓
```

**Fix:** Delete cache and reload (Ctrl+Shift+R)

---

### Solution 2: Check console errors

```javascript
// Open DevTools → Console

// Should not see errors like:
// ✗ "Slider is not defined"
// ✗ "CONFIG is not undefined"
// ✗ "DOMHelpers is not defined"

// If error exists, reload page
location.reload();
```

---

### Solution 3: Verify instances exist

```javascript
// In Console:
console.log(window.CONFIG);           // Should be object
console.log(window.DOMHelpers);       // Should be object
console.log(window.CarouselBase);     // Should be class
console.log(window.Slider);           // Should be class
console.log(window.TourCarousel);     // Should be class
console.log(window.appInstances);     // Should have slider & tourCarousel
```

If any undefined, **page didn't load all scripts**. Check Network tab.

---

## ❌ Problem: Animation too slow/fast

### Solution: Adjust CONFIG

```javascript
// Edit: assets/js/core/config.js

const CONFIG = {
    SLIDER: {
        duration: 0.5,  // Changed from 0.3 to 0.5 (slower)
        // or
        duration: 0.2,  // Changed from 0.3 to 0.2 (faster)
    }
}
```

**No page reload needed** - changes apply immediately.

---

## ❌ Problem: Drag not working

### Solution 1: Check if dragging enabled

```javascript
// In Console:
const slider = window.appInstances.slider;

// Try manually:
slider.dragStart(100);
slider.dragMove(50);
slider.dragEnd();

// Check state:
console.log(slider.isDragging);  // Should toggle true/false
console.log(slider.delta);       // Should be -50
```

### Solution 2: Check event listeners

```javascript
// Verify listeners attached:
console.log(slider.container);  // Should exist

// Try triggering event manually:
const event = new MouseEvent('mousedown', { clientX: 100 });
slider.container.dispatchEvent(event);
```

---

## ❌ Problem: Content not updating (Slider)

### Solution 1: Check slideContents

```javascript
// In Console:
const slider = window.appInstances.slider;
console.log(slider.slideContents);  // Should be array with data

// Should look like:
[
    { title: "From Alps", subtitle: "Snow Adventure", text: "..." },
    { title: "Enjoy your", subtitle: "Winter Vacations", text: "..." }
]

// If empty, check app.js config
```

### Solution 2: Check DOM elements

```javascript
// In Console:
console.log(slider.contentTitle);     // Should exist
console.log(slider.contentSubtitle);  // Should exist
console.log(slider.contentText);      // Should exist

// If any undefined, check selector in app.js
```

### Solution 3: Manually update content

```javascript
// Force update:
slider.updateContent(0);

// Check if text changed in page
// If yes: animation issue
// If no: selector issue
```

---

## ❌ Problem: Dots not clickable (Carousel)

### Solution 1: Check dots found

```javascript
// In Console:
const carousel = window.appInstances.tourCarousel;
console.log(carousel.dots);  // Should be NodeList of dots

// Should have length > 0:
console.log(carousel.dots.length);  // e.g., 4
```

### Solution 2: Check data attributes

```html
<!-- Each dot should have data-slide-to attribute -->
<span class="dot active" data-slide-to="0"></span>
<span class="dot" data-slide-to="1"></span>
<!-- ... -->
```

### Solution 3: Manually test click

```javascript
// In Console:
const carousel = window.appInstances.tourCarousel;
carousel.navigateToItem(1);

// Check if carousel moved to item 1
```

---

## ❌ Problem: Touch not working on mobile

### Solution 1: Check touch events support

```javascript
// In Console (on mobile device):
console.log(window.TouchEvent);  // Should exist

// Check if listeners attached:
const carousel = window.appInstances.tourCarousel;
console.log(carousel.container);  // Should exist
```

### Solution 2: Test with DevTools mobile emulation

```
1. Press F12 → DevTools
2. Click ☎️ (Toggle device toolbar) or Ctrl+Shift+M
3. Select device (iPhone 12, etc.)
4. Try swiping with mouse
```

### Solution 3: Check viewport meta tag

```html
<!-- Should be in index.html <head> -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

If missing, add it and reload.

---

## ❌ Problem: Autoplay not working (Slider)

### Solution 1: Check autoPlay config

```javascript
// In Console:
const slider = window.appInstances.slider;
console.log(slider.options.autoPlay);  // Should be true
console.log(slider.options.autoPlayInterval);  // Should be 3000
```

### Solution 2: Check autoPlayInterval

```javascript
// Should be running:
console.log(slider.autoPlayInterval);  // Should be number (interval ID)

// If null, autoplay not started
// Try starting manually:
slider.startAutoPlay();
console.log(slider.autoPlayInterval);  // Should now be number
```

### Solution 3: Pause on hover

```javascript
// Hover over slider - autoplay should stop
// Leave slider - autoplay should resume

// Check event listeners in DevTools:
// Elements tab → slider element → Event Listeners
```

---

## ❌ Problem: Old main.js/tour-slider.js still loading

### Solution: Update index.html

```html
<!-- REMOVE these lines -->
<script src="./assets/js/main.js"></script>
<script src="./assets/js/tour-slider.js"></script>

<!-- Should ONLY have these -->
<script src="./assets/js/core/config.js"></script>
<script src="./assets/js/core/dom-helpers.js"></script>
<script src="./assets/js/modules/shared/carousel-base.js"></script>
<script src="./assets/js/modules/slider/slider.js"></script>
<script src="./assets/js/modules/carousel/tour-carousel.js"></script>
<script src="./assets/js/app.js"></script>
```

Check Network tab to confirm old files not loaded.

---

## ❌ Problem: Getting errors in console

### Error: "TypeError: Cannot read property 'offsetWidth' of null"

```javascript
// Cause: Container element not found

// Solution 1: Check selector in app.js
// Should match actual DOM:
const container = DOMHelpers.query('.slider__slides-container');
console.log(container);  // Should not be null

// Solution 2: Check HTML structure
// .slider__slides-container should exist in index.html

// Solution 3: Check if loaded before app.js
// Make sure all scripts loaded in correct order
```

---

### Error: "TypeError: carousels is not defined"

```javascript
// Cause: Typo in class name

// Check spelling:
// window.Slider (not Sliders)
// window.TourCarousel (not TourCarousels)

// Reload to fix typos
```

---

### Error: "TypeError: this.dragStart is not a function"

```javascript
// Cause: Method not properly inherited

// Check carousel-base.js is loaded
// Check that child class extends CarouselBase
// Check super() is called in constructor

// Reload page and check console
```

---

## ❌ Problem: Performance issues (Jank)

### Solution 1: Check animation FPS

```javascript
// In DevTools:
// 1. Open Performance tab
// 2. Press Record (red circle)
// 3. Drag carousel
// 4. Stop recording
// 5. Check FPS graph

// Should stay at 60 FPS (smooth)
// If drops: CSS/JS optimization needed
```

### Solution 2: Disable autoplay during test

```javascript
// Edit config.js:
SLIDER: {
    autoPlay: false,  // Disable to isolate issue
}

// Reload and test manual drag
```

### Solution 3: Check for memory leaks

```javascript
// In Console:
// Drag many times, then check memory

// Close app and open: should release memory
// If memory keeps growing: event listener leak

// Check destroy() called properly
```

---

## ✅ Quick Debug Checklist

```javascript
// Copy-paste all into Console:

// 1. Check all globals exist
console.log({
    CONFIG,
    DOMHelpers,
    CarouselBase,
    Slider,
    TourCarousel,
    appInstances: window.appInstances
});

// 2. Check instances initialized
console.log({
    sliderExists: !!window.appInstances?.slider,
    carouselExists: !!window.appInstances?.tourCarousel
});

// 3. Check state
if (window.appInstances?.slider) {
    console.log('Slider:', {
        currentSlide: window.appInstances.slider.currentIndex,
        isAnimating: window.appInstances.slider.isAnimating,
        itemWidth: window.appInstances.slider.getItemWidth()
    });
}

if (window.appInstances?.tourCarousel) {
    console.log('Carousel:', {
        currentItem: window.appInstances.tourCarousel.currentIndex,
        isDragging: window.appInstances.tourCarousel.isDragging,
        itemWidth: window.appInstances.tourCarousel.getItemWidth()
    });
}
```

---

## 🎯 Still not working?

### Check these in order:

1. ✅ Browser cache cleared (Ctrl+Shift+Del)
2. ✅ All 8 scripts loaded in DevTools Network tab
3. ✅ No console errors on page load
4. ✅ window.CONFIG exists
5. ✅ window.appInstances exists
6. ✅ Selectors match HTML elements

If still stuck:
- **Take screenshot of DevTools Console**
- **Send console error messages**
- **Describe what's not working**

---

**Last Updated:** 2026-01-18  
**Version:** 1.0 Refactored
