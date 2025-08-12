// MINDORA.ART Main JavaScript

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    setupAuthStateListener();
    setupNavigationHandlers();
    loadCategoryCounts();
    
    // Add loading animations
    addLoadingAnimations();
}

// Setup authentication state listener
function setupAuthStateListener() {
    firebase.auth().onAuthStateChanged(user => {
        updateUIForAuthState(user);
    });
}

// Update UI based on authentication state
function updateUIForAuthState(user) {
    const loginNavItem = document.getElementById('loginNavItem');
    const userNavItem = document.getElementById('userNavItem');
    const createNavItem = document.getElementById('createNavItem');
    const userDisplayName = document.getElementById('userDisplayName');

    if (user) {
        // User is signed in
        if (loginNavItem) loginNavItem.style.display = 'none';
        if (userNavItem) userNavItem.style.display = 'block';
        if (createNavItem) createNavItem.style.display = 'block';
        if (userDisplayName) userDisplayName.textContent = user.displayName || user.email;
    } else {
        // User is signed out
        if (loginNavItem) loginNavItem.style.display = 'block';
        if (userNavItem) userNavItem.style.display = 'none';
        if (createNavItem) createNavItem.style.display = 'none';
    }
            const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            // Проверяем, инициализирован ли уже dropdown
            if (!bootstrap.Dropdown.getInstance(userDropdown)) {
                new bootstrap.Dropdown(userDropdown);
            }
        }
    } 


// Setup navigation event handlers
function setupNavigationHandlers() {
    // Login button click handler
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }

    // Hero get started button
    const heroGetStarted = document.getElementById('heroGetStarted');
    if (heroGetStarted) {
        heroGetStarted.addEventListener('click', function() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    window.location.href = 'create.html';
                } else {
                    showLoginModal();
                }
            });
        });
    }

    // Logout button click handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Show login modal
function showLoginModal() {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

// Handle user logout
async function handleLogout() {
    try {
        await firebase.auth().signOut();
        
        // Redirect to home page if on protected pages
        const currentPage = window.location.pathname;
        if (currentPage.includes('create.html') || currentPage.includes('profile.html')) {
            window.location.href = 'index.html';
        }
        
        // Show success message
        showNotification('Logged out successfully!', 'success');
    } catch (error) {
        console.error('Error signing out:', error);
        showNotification('Error signing out: ' + error.message, 'error');
    }
}

// Load category counts for the home page
async function loadCategoryCounts() {
    const categories = ['Art', 'Science', 'Literature', 'Audio'];
    
    for (const category of categories) {
        try {
            const snapshot = await firebase.firestore()
                .collection('works')
                .where('category', '==', category)
                .get();
            
            const count = snapshot.size;
            const countElement = document.getElementById(category.toLowerCase() + 'Count');
            if (countElement) {
                countElement.textContent = `${count} work${count !== 1 ? 's' : ''}`;
            }
        } catch (error) {
            console.error(`Error loading ${category} count:`, error);
        }
    }
}

// Add loading animations to elements
function addLoadingAnimations() {
    const animatedElements = document.querySelectorAll('.category-card, .feature-item, .work-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.top = '100px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Utility function to format date
function formatDate(timestamp) {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Utility function to format file size
function formatFileSize(bytes) {
    if (!bytes) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility function to truncate text
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Smooth scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Debounce function for search/filter operations
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

// Validate file type and size
function validateFile(file, allowedTypes, maxSizeMB = 10) {
    if (!file) return { valid: false, error: 'No file selected' };
    
    // Check file type
    const fileType = file.type.toLowerCase();
    const isValidType = allowedTypes.some(type => fileType.startsWith(type));
    
    if (!isValidType) {
        return { 
            valid: false, 
            error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
        };
    }
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return { 
            valid: false, 
            error: `File too large. Maximum size: ${maxSizeMB}MB` 
        };
    }
    
    return { valid: true };
}

// Generate unique ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Handle network errors gracefully
function handleNetworkError(error) {
    console.error('Network error:', error);
    
    if (error.code === 'unavailable') {
        showNotification('Network unavailable. Please check your connection and try again.', 'error');
    } else if (error.code === 'permission-denied') {
        showNotification('Permission denied. Please sign in and try again.', 'error');
    } else {
        showNotification('An error occurred. Please try again later.', 'error');
    }
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        showNotification('Failed to copy to clipboard', 'error');
    }
}

// Check if user is on mobile device
function isMobileDevice() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Initialize tooltips and popovers
function initializeBootstrapComponents() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
            
            // Log slow loads
            if (loadTime > 3000) {
                console.warn('Slow page load detected:', loadTime + 'ms');
            }
        });
    }
}

// Initialize performance monitoring
monitorPerformance();

// Initialize Bootstrap components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeBootstrapComponents();
});

// Export utility functions for use in other scripts
window.MindoraUtils = {
    showNotification,
    formatDate,
    formatFileSize,
    truncateText,
    scrollToElement,
    debounce,
    validateFile,
    generateUniqueId,
    handleNetworkError,
    copyToClipboard,
    isMobileDevice
};
