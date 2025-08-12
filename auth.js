// MINDORA.ART Authentication JavaScript - Updated with Privacy Policy Fix

// Authentication module
const MindoraAuth = {
    currentUser: null,
    
    // Initialize authentication
    init() {
        this.setupAuthStateListener();
        this.setupAuthForms();
    },
    
    // Setup authentication state listener
    setupAuthStateListener() {
        firebase.auth().onAuthStateChanged(user => {
            this.currentUser = user;
            this.updateAuthUI(user);
        });
    },
    
    // Setup authentication forms
    setupAuthForms() {
        this.setupLoginModal();
        this.setupSignInForm();
        this.setupSignUpForm();
        this.setupFormToggle();
    },
    
    // Setup login modal
    setupLoginModal() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.addEventListener('hidden.bs.modal', () => {
                this.resetAuthForms();
            });
        }
    },
    
    // Setup sign in form
    setupSignInForm() {
        const signInForm = document.getElementById('signInForm');
        if (signInForm) {
            signInForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSignIn();
            });
        }
    },
    
    // Setup sign up form
    setupSignUpForm() {
        const signUpForm = document.getElementById('createAccountForm');
        if (signUpForm) {
            signUpForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSignUp();
            });
        }
    },
    
    // Setup form toggle between sign in and sign up
    setupFormToggle() {
        const showSignUp = document.getElementById('showSignUp');
        const showSignIn = document.getElementById('showSignIn');
        
        if (showSignUp) {
            showSignUp.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignUpForm();
            });
        }
        
        if (showSignIn) {
            showSignIn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignInForm();
            });
        }
    },
    
    // Show sign up form
    showSignUpForm() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signUpForm').style.display = 'block';
        this.hideAuthError();
    },
    
    // Show sign in form
    showSignInForm() {
        document.getElementById('signUpForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        this.hideAuthError();
    },
    
    // Handle sign in
    async handleSignIn() {
        const email = document.getElementById('signInEmail').value.trim();
        const password = document.getElementById('signInPassword').value;
        
        if (!this.validateSignInForm(email, password)) {
            return;
        }
        
        try {
            this.showAuthLoading('Signing in...');
            
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            
            // Close modal and show success
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            window.MindoraUtils.showNotification('Welcome back!', 'success');
            
            // Redirect if on certain pages
            this.handlePostAuthRedirect();
            
        } catch (error) {
            console.error('Sign in error:', error);
            this.showAuthError(this.getAuthErrorMessage(error));
        } finally {
            this.hideAuthLoading();
        }
    },
    
    // Handle sign up - FIXED PRIVACY POLICY CHECK
    async handleSignUp() {
        const name = document.getElementById('signUpName').value.trim();
        const email = document.getElementById('signUpEmail').value.trim();
        const password = document.getElementById('signUpPassword').value;
        
        // Get privacy checkbox - FIXED SELECTOR
        const privacyCheckbox = document.getElementById('privacyPolicy');
        
        // Privacy policy consent validation
        if (!privacyCheckbox) {
            console.error('Privacy policy checkbox element not found');
            this.showAuthError('System configuration error. Please contact support.');
            return false;
        }
        
        if (!privacyCheckbox.checked) {
            this.showAuthError('You must agree to the Privacy Policy to register');
            return false;
        }
        
        // Validate form inputs
        if (!this.validateSignUpForm(name, email, password)) {
            return;
        }
        
        try {
            this.showAuthLoading('Creating account...');
            
            // Create user account
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            
            // Update user profile with display name
            await userCredential.user.updateProfile({
                displayName: name
            });
            
            // Close modal and show success
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            window.MindoraUtils.showNotification('Account created successfully! Welcome to MINDORA.ART!', 'success');
            
            // Redirect if on certain pages
            this.handlePostAuthRedirect();
            
        } catch (error) {
            console.error('Sign up error:', error);
            this.showAuthError(this.getAuthErrorMessage(error));
        } finally {
            this.hideAuthLoading();
        }
    },
    
    // Validate sign in form
    validateSignInForm(email, password) {
        if (!email) {
            this.showAuthError('Please enter your email address.');
            return false;
        }
        
        if (!this.isValidEmail(email)) {
            this.showAuthError('Please enter a valid email address.');
            return false;
        }
        
        if (!password) {
            this.showAuthError('Please enter your password.');
            return false;
        }
        
        return true;
    },
    
    // Validate sign up form
    validateSignUpForm(name, email, password) {
        if (!name) {
            this.showAuthError('Please enter your display name.');
            return false;
        }
        
        if (name.length < 2) {
            this.showAuthError('Display name must be at least 2 characters long.');
            return false;
        }
        
        if (!email) {
            this.showAuthError('Please enter your email address.');
            return false;
        }
        
        if (!this.isValidEmail(email)) {
            this.showAuthError('Please enter a valid email address.');
            return false;
        }
        
        if (!password) {
            this.showAuthError('Please enter a password.');
            return false;
        }
        
        if (password.length < 6) {
            this.showAuthError('Password must be at least 6 characters long.');
            return false;
        }
        
        return true;
    },
    
    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Get user-friendly error messages
    getAuthErrorMessage(error) {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'No account found with this email address.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/email-already-in-use':
                return 'An account with this email already exists.';
            case 'auth/weak-password':
                return 'Password is too weak. Please choose a stronger password.';
            case 'auth/invalid-email':
                return 'Invalid email address format.';
            case 'auth/user-disabled':
                return 'This account has been disabled. Please contact support.';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection and try again.';
            default:
                return error.message || 'An error occurred during authentication.';
        }
    },
    
    // Show authentication error
    showAuthError(message) {
        const errorDiv = document.getElementById('authError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    },
    
    // Hide authentication error
    hideAuthError() {
        const errorDiv = document.getElementById('authError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    },
    
    // Show authentication loading state
    showAuthLoading(message) {
        const submitButtons = document.querySelectorAll('#signInForm button[type="submit"], #createAccountForm button[type="submit"]');
        submitButtons.forEach(button => {
            button.disabled = true;
            button.innerHTML = `<i class="fas fa-spinner fa-spin me-1"></i>${message}`;
        });
    },
    
    // Hide authentication loading state
    hideAuthLoading() {
        const signInButton = document.querySelector('#signInForm button[type="submit"]');
        const signUpButton = document.querySelector('#createAccountForm button[type="submit"]');
        
        if (signInButton) {
            signInButton.disabled = false;
            signInButton.innerHTML = 'Sign In';
        }
        
        if (signUpButton) {
            signUpButton.disabled = false;
            signUpButton.innerHTML = 'Create Account';
        }
    },
    
    // Reset authentication forms
    resetAuthForms() {
        const signInForm = document.getElementById('signInForm');
        const signUpForm = document.getElementById('createAccountForm');
        
        if (signInForm) signInForm.reset();
        if (signUpForm) signUpForm.reset();
        
        // Reset privacy checkbox specifically
        const privacyCheckbox = document.getElementById('privacyPolicyAgreement');
        if (privacyCheckbox) {
            privacyCheckbox.checked = false;
        }
        
        this.showSignInForm();
        this.hideAuthError();
        this.hideAuthLoading();
    },
    
    // Update UI based on authentication state
    updateAuthUI(user) {
        const loginNavItem = document.getElementById('loginNavItem');
        const userNavItem = document.getElementById('userNavItem');
        const createNavItem = document.getElementById('createNavItem');
        const userDisplayName = document.getElementById('userDisplayName');
        
        if (user) {
            // User is authenticated
            if (loginNavItem) loginNavItem.style.display = 'none';
            if (userNavItem) userNavItem.style.display = 'block';
            if (createNavItem) createNavItem.style.display = 'block';
            if (userDisplayName) {
                userDisplayName.textContent = user.displayName || user.email.split('@')[0];
            }
        } else {
            // User is not authenticated
            if (loginNavItem) loginNavItem.style.display = 'block';
            if (userNavItem) userNavItem.style.display = 'none';
            if (createNavItem) createNavItem.style.display = 'none';
        }
    },
    
    // Handle post-authentication redirects
    handlePostAuthRedirect() {
        const currentPath = window.location.pathname;
        
        // If user clicked "Get Started" from home page, redirect to create page
        if (currentPath.includes('index.html') || currentPath === '/') {
            // Check if there's a stored redirect intention
            const redirectIntent = sessionStorage.getItem('redirectAfterAuth');
            if (redirectIntent === 'create') {
                sessionStorage.removeItem('redirectAfterAuth');
                setTimeout(() => {
                    window.location.href = 'create.html';
                }, 1000);
            }
        }
    },
    
    // Sign out user
    async signOut() {
        try {
            await firebase.auth().signOut();
            
            // Redirect to home page if on protected pages
            const currentPage = window.location.pathname;
            if (currentPage.includes('create.html') || currentPage.includes('profile.html')) {
                window.location.href = 'index.html';
            }
            
            window.MindoraUtils.showNotification('Signed out successfully!', 'success');
        } catch (error) {
            console.error('Sign out error:', error);
            window.MindoraUtils.showNotification('Error signing out: ' + error.message, 'error');
        }
    },
    
    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    },
    
    // Get current user
    getCurrentUser() {
        return this.currentUser;
    },
    
    // Require authentication (redirect to login if not authenticated)
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
};

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    MindoraAuth.init();
    
    // Set redirect intention for "Get Started" button
    const heroGetStarted = document.getElementById('heroGetStarted');
    if (heroGetStarted) {
        heroGetStarted.addEventListener('click', function() {
            if (!MindoraAuth.isAuthenticated()) {
                sessionStorage.setItem('redirectAfterAuth', 'create');
            }
        });
    }
});

// Export for use in other scripts
window.MindoraAuth = MindoraAuth;