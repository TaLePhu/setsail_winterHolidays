# 📊 Architecture & Flow Diagrams

## 1️⃣ File Loading Order

```
index.html
├─ config.js
│  └─ Sets CONFIG object globally
│
├─ dom-helpers.js  
│  └─ Sets DOMHelpers object globally
│
├─ carousel-base.js
│  └─ Sets CarouselBase class globally
│  └─ Uses: CONFIG, DOMHelpers
│
├─ slider.js
│  └─ Sets Slider class globally
│  └─ Extends: CarouselBase
│  └─ Uses: CONFIG, DOMHelpers
│
├─ tour-carousel.js
│  └─ Sets TourCarousel class globally
│  └─ Extends: CarouselBase
│  └─ Uses: CONFIG, DOMHelpers
│
└─ app.js (LAST!)
   └─ Initializes Slider instance
   └─ Initializes TourCarousel instance
   └─ Stores in window.appInstances
```

---

## 2️⃣ Class Inheritance Hierarchy

```
                    CarouselBase
                         △
                         │
                    ┌────┴────┐
                    │          │
                 Slider    TourCarousel
                    
                    
CarouselBase provides:
├─ dragStart()
├─ dragMove()  
├─ dragEnd()
├─ getItemWidth()
├─ setTransform()
├─ setTransition()
├─ updateActiveDot()
├─ attachEventListeners()
└─ Abstract: slideNext(), slidePrev()

Slider adds:
├─ Override: slideNext(), slidePrev()
├─ goToSlide(index)
├─ updateContent(index)
├─ startAutoPlay()
├─ stopAutoPlay()
├─ setNavButtons()
└─ setBackgroundImages()

TourCarousel adds:
├─ Override: slideNext(), slidePrev()
├─ navigateToItem(index)
├─ attachDotEventListeners()
└─ Infinite loop logic
```

---

## 3️⃣ Event Flow Diagram

```
User Input
    │
    ├─ Mouse Down → dragStart()
    │                 │
    │                 └─ setTransition('none')
    │                 └─ Store startX
    │
    ├─ Mouse Move → dragMove()
    │                 │
    │                 └─ Calculate deltaX
    │                 └─ setTransform(deltaX)
    │                 └─ Update visual
    │
    └─ Mouse Up → dragEnd()
                     │
                     ├─ Calculate distance
                     │
                     ├─ If swipe distance > threshold
                     │  ├─ slideNext() / slidePrev()
                     │  │   ├─ setTransition('transform 0.3s')
                     │  │   ├─ setTransform(-distance)
                     │  │   └─ (Animation plays)
                     │  │
                     │  └─ Trigger transitionend event
                     │
                     └─ Else snap back
                        ├─ setTransition('transform 0.3s')
                        └─ setTransform(0)


Alternative: Dot Click
    │
    └─ Dot Click → navigateToItem(index)
                      │
                      ├─ updateActiveDot(index)
                      ├─ setTransform(-index * itemWidth)
                      └─ Animation plays
```

---

## 4️⃣ Data Flow Architecture

```
┌─────────────────────────────────────────────────┐
│              index.html (DOM)                    │
├─────────────────────────────────────────────────┤
│  .slider__slides-container                      │
│  ├─ .slider__slide (4 items)                   │
│  ├─ .slider__content-inner                     │
│  └─ .slider__btn-left, .slider__btn-right      │
│                                                  │
│  .tour-list                                     │
│  ├─ .tour-item (8 items)                       │
│  └─ .dot (pagination)                          │
└─────────────────────────────────────────────────┘
           △                          △
           │                          │
        ┌──┴──────────────────────────┴──┐
        │      app.js (Initialize)       │
        └──┬──────────────────────────┬──┘
           │                          │
      ┌────▼────────┐          ┌─────▼──────┐
      │ new Slider  │          │ new Tour   │
      │             │          │ Carousel   │
      └────┬────────┘          └─────┬──────┘
           │                         │
    ┌──────▼──────────┐      ┌──────▼──────────┐
    │  CarouselBase   │      │  CarouselBase   │
    │  (Drag logic)   │      │  (Drag logic)   │
    └──────┬──────────┘      └──────┬──────────┘
           │                        │
    ┌──────▼──────────┐      ┌──────▼──────────┐
    │  CONFIG         │      │  CONFIG         │
    │  DOMHelpers     │      │  DOMHelpers     │
    │  (Shared)       │      │  (Shared)       │
    └─────────────────┘      └─────────────────┘
```

---

## 5️⃣ Configuration Propagation

```
config.js (Global Config)
    │
    ├─ CONFIG.SLIDER
    │  ├─ duration: 0.3
    │  ├─ autoPlayInterval: 3000
    │  └─ snapThreshold: 0.25
    │
    └─ CONFIG.CAROUSEL
       ├─ duration: 0.3
       └─ snapThreshold: 0.25

          ↓

     app.js (Use CONFIG)
        ├─ new Slider({ ...CONFIG.SLIDER })
        └─ new TourCarousel({ ...CONFIG.CAROUSEL })

          ↓

     Slider / TourCarousel
        ├─ this.options = { ...CONFIG values }
        └─ Use in animations: `${this.options.duration}s`

          ↓

     Browser CSS Animations
        └─ transition: transform 0.3s ease;
```

---

## 6️⃣ Comparison: Old vs New

### OLD APPROACH:
```
main.js (200 lines)
    │
    ├─ Global variables: isDragging, startX, deltaX
    ├─ Hardcoded values: duration = "0.3s", delay = 3000
    ├─ Functions: dragStart(), dragMove(), dragEnd()
    ├─ Functions: slideNext(), slidePrev()
    ├─ Logic: autoplay, content update, animation
    └─ Mixed concerns: drag, slide, autoplay

tour-slider.js (150 lines)
    │
    ├─ Global variables: isDragging, startX, deltaX (DUPLICATE!)
    ├─ Hardcoded values: duration = "0.3s" (DUPLICATE!)
    ├─ Functions: dragStart(), dragMove(), dragEnd() (DUPLICATE!)
    ├─ Functions: slideNext(), slidePrev() (DIFFERENT)
    ├─ Logic: infinite loop, dot navigation
    └─ Mixed concerns: drag, loop, dots

CODE DUPLICATION: 70% 😞
TOTAL LINES: 350 lines
TIME TO ADD NEW CAROUSEL: 2-3 hours 😑
```

### NEW APPROACH:
```
config.js (40 lines)
    └─ Centralized configuration

dom-helpers.js (150 lines)
    └─ 24 reusable utility functions

carousel-base.js (180 lines)
    └─ Base class with all drag/swipe/animate logic
       ├─ dragStart(), dragMove(), dragEnd()
       ├─ slideNext(), slidePrev() [abstract]
       ├─ setTransform(), setTransition()
       └─ attachEventListeners()

slider.js (150 lines)
    ├─ Extends CarouselBase
    ├─ Override: slideNext(), slidePrev()
    ├─ Unique: updateContent(), autoplay
    └─ Code specific to slider only

tour-carousel.js (90 lines)
    ├─ Extends CarouselBase
    ├─ Override: slideNext(), slidePrev()
    ├─ Unique: navigateToItem(), infinite loop
    └─ Code specific to carousel only

CODE DUPLICATION: 0% ✅
TOTAL LINES: 610 lines (but organized!)
TIME TO ADD NEW CAROUSEL: 15-20 minutes ✅

NEW Carousel Template: 40-50 lines (just override 2 methods!)
```

---

## 7️⃣ Method Call Stack Example

### User drags slider 100px left:

```
User: Drag mouse 100px left
    │
    └─ window.onmousemove → dragMove(clientX)
       │
       └─ CarouselBase.dragMove()
          ├─ deltaX = clientX - startX  // = -100px
          └─ this.setTransform(-100px)
             │
             └─ DOMHelpers.setTransform()
                │
                └─ element.style.transform = "translateX(-100px)"
                   │
                   └─ Browser: Updates visual position
                      │
                      └─ User sees slider move

User: Release mouse
    │
    └─ window.onmouseup → dragEnd()
       │
       └─ CarouselBase.dragEnd()
          ├─ if (deltaX < -itemWidth/4) → Swipe left detected
          └─ this.slideNext()
             │
             ├─ Slider.slideNext()
             │  ├─ goToSlide(nextIndex)
             │  └─ updateContent(nextIndex)
             │
             └─ CarouselBase.slideNext()
                ├─ this.setTransition("transform 0.3s ease")
                └─ this.setTransform(-itemWidth)
                   │
                   └─ Browser: Animates over 0.3s
                      │
                      └─ onTransitionEnd → Move DOM items
                         │
                         └─ Reset position for loop
```

---

## 8️⃣ Reusability Example

### Creating 3rd Carousel (PhotoGallery):

```
Step 1: Create class

class PhotoGallery extends CarouselBase {
    slideNext() { /* Photo-specific logic */ }
    slidePrev() { /* Photo-specific logic */ }
    rotateImage() { /* New method */ }
    zoomImage() { /* New method */ }
}

Step 2: Add to app.js

const photoGallery = new PhotoGallery({
    container: ...,
    items: ...,
    duration: 0.4
});

Step 3: Load in HTML

<script src="./modules/gallery/photo-gallery.js"></script>

RESULT:
- 45 lines of new code
- Reuses: dragStart(), dragMove(), dragEnd(), setTransform(), etc. from base
- Inheritance: Automatically works with CONFIG and DOMHelpers
- Time: 20 minutes instead of 2-3 hours!
```

---

## 9️⃣ Lifecycle Diagram

```
Page Load
   │
   └─ Parse HTML
      └─ Load CSS (no changes)
         │
         └─ Load Scripts (ORDER MATTERS!)
            │
            ├─ config.js → window.CONFIG = {...}
            ├─ dom-helpers.js → window.DOMHelpers = {...}
            ├─ carousel-base.js → window.CarouselBase = class
            ├─ slider.js → window.Slider = class
            ├─ tour-carousel.js → window.TourCarousel = class
            │
            └─ app.js → DOMContentLoaded
               │
               ├─ Query DOM elements
               ├─ new Slider() → Initialize
               ├─ new TourCarousel() → Initialize
               ├─ Attach event listeners
               └─ window.appInstances = {slider, tourCarousel}
                  │
                  └─ App ready! ✅

User Interaction
   │
   ├─ Drag/Touch → CarouselBase.dragStart/Move/End()
   ├─ Click button → Slider.slideNext/Prev()
   ├─ Click dot → TourCarousel.navigateToItem()
   │
   └─ Animation → CSS transition + JavaScript callback

Page Unload
   │
   └─ Optional: slider.destroy(), carousel.destroy()
      └─ Cleanup event listeners
```

---

## 🔟 Testing Points

```
✅ Unit Tests (Test isolated methods)
   ├─ CarouselBase.dragStart()
   ├─ CarouselBase.getItemWidth()
   ├─ Slider.updateContent()
   ├─ TourCarousel.navigateToItem()
   └─ DOMHelpers methods

✅ Integration Tests (Test class interactions)
   ├─ Slider + autoplay
   ├─ TourCarousel + dots
   ├─ CarouselBase + DOM listeners
   └─ app.js initialization

✅ E2E Tests (Test user interactions)
   ├─ Drag to slide
   ├─ Click button
   ├─ Click dot
   ├─ Hover to pause autoplay
   └─ Touch on mobile

✅ Performance Tests
   ├─ Animation FPS
   ├─ Memory usage
   ├─ Event listener cleanup
   └─ DOM repaint optimization
```

---

## 📝 Notes

- All diagrams use **ASCII art** for easy copying
- Diagrams show **dependencies** & **data flow**
- Following **SOLID principles**
- **No circular dependencies**
- **Single responsibility** per class
- **Easy to extend** with new carousels

---

**Keep this file for reference when explaining architecture to teammates!** 🚀
