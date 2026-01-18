/**
 * Global configuration for carousel/slider components
 */
const CONFIG = {
    // Slider configuration
    SLIDER: {
        duration: 0.3,
        easing: 'ease',
        autoPlayInterval: 3000,
        snapThreshold: 0.25,
        autoPlay: true
    },

    // Tour Carousel configuration
    CAROUSEL: {
        duration: 0.3,
        easing: 'ease',
        snapThreshold: 0.25,
        autoPlay: false
    },

    // Review Carousel configuration
    REVIEW_CAROUSEL: {
        duration: 0.3,
        easing: 'ease',
        snapThreshold: 0.25,
        autoPlay: true,
        autoPlayInterval: 3000,
        itemsPerView: 3
    },

    // Animation timings
    ANIMATION: {
        fadeOutDuration: 400,
        fadeInDuration: 50,
        transitionDelay: 3000
    }
};

// Export for global use (vanilla JS)
window.CONFIG = CONFIG;
