document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    const scrollThreshold = 100; // Number of pixels to scroll before changing header style

    // Throttle function for better scroll performance
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Throttled scroll handler for better performance
    const throttledHandleScroll = throttle(handleScroll, 16); // ~60fps

    // Initial check
    handleScroll();

    // Add scroll event listener with throttling
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
}); 