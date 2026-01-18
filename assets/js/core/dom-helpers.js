/**
 * DOM Helper utilities for common operations
 */
const DOMHelpers = {
    /**
     * Query selector wrapper
     */
    query(selector) {
        return document.querySelector(selector);
    },

    /**
     * Query selector all wrapper
     */
    queryAll(selector) {
        return document.querySelectorAll(selector);
    },

    /**
     * Add class to element
     */
    addClass(el, className) {
        el.classList.add(className);
    },

    /**
     * Remove class from element
     */
    removeClass(el, className) {
        el.classList.remove(className);
    },

    /**
     * Toggle class on element
     */
    toggleClass(el, className) {
        el.classList.toggle(className);
    },

    /**
     * Check if element has class
     */
    hasClass(el, className) {
        return el.classList.contains(className);
    },

    /**
     * Remove all classes from element list
     */
    removeClassFromAll(elements, className) {
        elements.forEach(el => this.removeClass(el, className));
    },

    /**
     * Set transition style
     */
    setTransition(el, transition) {
        el.style.transition = transition;
    },

    /**
     * Set transform style
     */
    setTransform(el, value) {
        el.style.transform = value;
    },

    /**
     * Set multiple styles at once
     */
    setStyles(el, styles) {
        Object.assign(el.style, styles);
    },

    /**
     * Get element offset width
     */
    getWidth(el) {
        return el.offsetWidth;
    },

    /**
     * Get first child element
     */
    getFirstChild(el) {
        return el.firstElementChild;
    },

    /**
     * Get last child element
     */
    getLastChild(el) {
        return el.lastElementChild;
    },

    /**
     * Append child element
     */
    append(parent, child) {
        parent.appendChild(child);
    },

    /**
     * Prepend child element
     */
    prepend(parent, child) {
        parent.insertBefore(child, parent.firstChild);
    },

    /**
     * Add event listener
     */
    on(el, event, handler) {
        el.addEventListener(event, handler);
    },

    /**
     * Remove event listener
     */
    off(el, event, handler) {
        el.removeEventListener(event, handler);
    },

    /**
     * Add one-time event listener
     */
    once(el, event, handler) {
        el.addEventListener(event, handler, { once: true });
    },

    /**
     * Request animation frame wrapper
     */
    raf(callback) {
        return requestAnimationFrame(callback);
    },

    /**
     * Set timeout wrapper
     */
    timeout(callback, delay) {
        return setTimeout(callback, delay);
    },

    /**
     * Clear timeout
     */
    clearTimeout(id) {
        clearTimeout(id);
    },

    /**
     * Set interval wrapper
     */
    interval(callback, delay) {
        return setInterval(callback, delay);
    },

    /**
     * Clear interval
     */
    clearInterval(id) {
        clearInterval(id);
    }
};

// Export for global use
window.DOMHelpers = DOMHelpers;
