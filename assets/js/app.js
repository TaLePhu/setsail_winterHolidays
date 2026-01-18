/**
 * Application Entry Point
 * Initializes all components when DOM is ready
 */

document.addEventListener('DOMContentLoaded', () => {
    // ====== INITIALIZE SLIDER ======
    const sliderConfig = {
        // DOM Elements
        container: DOMHelpers.query('.slider__slides-container'),
        slides: DOMHelpers.queryAll('.slider__slide'),
        contentInner: DOMHelpers.query('.slider__content-inner'),
        contentTitle: DOMHelpers.query('.slider__content-title'),
        contentSubtitle: DOMHelpers.query('.slider__content-subtitle'),
        contentText: DOMHelpers.query('.slider__content-text'),
        dots: DOMHelpers.queryAll('.slider__dots .dot'),

        // Slide contents
        slideContents: [
            {
                title: "From Alps",
                subtitle: "Snow Adventure",
                text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis Theme"
            },
            {
                title: "Enjoy your",
                subtitle: "Winter Vacations",
                text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis Theme"
            }
        ],

        // Configuration
        duration: CONFIG.SLIDER.duration,
        autoPlay: CONFIG.SLIDER.autoPlay,
        autoPlayInterval: CONFIG.SLIDER.autoPlayInterval
    };

    // Create slider instance
    const slider = new Slider(sliderConfig);

    // Setup navigation buttons
    const sliderBtnLeft = DOMHelpers.query('.slider__btn-left');
    const sliderBtnRight = DOMHelpers.query('.slider__btn-right');
    slider.setNavButtons(sliderBtnLeft, sliderBtnRight);

    // ====== INITIALIZE TOUR CAROUSEL ======
    const tourCarouselConfig = {
        // DOM Elements
        container: DOMHelpers.query('.tour-list'),
        items: DOMHelpers.queryAll('.tour-item'),
        dots: DOMHelpers.queryAll('.dots__pagination .dot'),

        // Configuration
        duration: CONFIG.CAROUSEL.duration,
        snapThreshold: CONFIG.CAROUSEL.snapThreshold
    };

    // Create carousel instance
    const tourCarousel = new TourCarousel(tourCarouselConfig);

    // Optional: Store instances globally for debugging
    window.appInstances = {
        slider,
        tourCarousel
    };

    console.log('✅ Application initialized successfully');
    console.log('📊 Slider:', slider);
    console.log('🎠 Tour Carousel:', tourCarousel);
});
