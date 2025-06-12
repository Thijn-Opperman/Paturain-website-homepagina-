document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    const scrollThreshold = 100; // Number of pixels to scroll before changing header style

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Initial check
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
}); 