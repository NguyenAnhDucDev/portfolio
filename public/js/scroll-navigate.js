let isNavigating = false;
const fadeDuration = 600;
const pages = ['/', '/about', '/skills', '/projects', '/contact'];
const scrollThreshold = 50;
const debounceDelay = 150;

function normalizePath(path) {
    return path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
}

function getNextPage(currentPath) {
    let idx = pages.indexOf(normalizePath(currentPath));
    if (idx === -1) return '/';
    return pages[(idx + 1) % pages.length];
}

function getPrevPage(currentPath) {
    let idx = pages.indexOf(normalizePath(currentPath));
    if (idx === -1) return '/';
    return pages[(idx - 1 + pages.length) % pages.length];
}

function fadeOutAndNavigate(url) {
    if (isNavigating) return;
    isNavigating = true;
    const mainContent = document.querySelector('.main-content-inner');
    if (mainContent) {
        mainContent.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = url;
        }, fadeDuration);
    } else {
        window.location.href = url;
    }
}

// --- Scroll navigation logic ---
let lastScrollTop = window.scrollY;
let lastDirection = null;

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler
const debouncedScroll = debounce(() => {
    if (isNavigating) return;

    const scrollTop = window.scrollY;
    const scrollBottom = scrollTop + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // Detect scroll direction
    let direction = scrollTop > lastScrollTop ? 'down' : (scrollTop < lastScrollTop ? 'up' : lastDirection);

    // Only trigger navigation if scrolled past threshold
    if (scrollBottom >= docHeight - scrollThreshold) {
        fadeOutAndNavigate(getNextPage(window.location.pathname));
        return;
    }

    if (scrollTop <= scrollThreshold && lastScrollTop > scrollThreshold && direction === 'up') {
        fadeOutAndNavigate(getPrevPage(window.location.pathname));
        return;
    }

    lastScrollTop = scrollTop;
    lastDirection = direction;
}, debounceDelay);

window.addEventListener('scroll', debouncedScroll, { passive: true });

// Reset trạng thái khi load lại trang
window.addEventListener('load', () => {
    isNavigating = false;
    lastScrollTop = window.scrollY;
    lastDirection = null;
});

// Khi ở đầu trang, cuộn lên nữa sẽ chuyển sang trang trước
let lastWheelTime = 0;
window.addEventListener('wheel', function(e) {
    if (isNavigating) return;
    if (window.scrollY === 0 && e.deltaY < 0) {
        const now = Date.now();
        if (now - lastWheelTime > 800) {
            fadeOutAndNavigate(getPrevPage(window.location.pathname));
            lastWheelTime = now;
        }
    }
}, { passive: true }); 