// MINDORA.ART Firebase Configuration

// Firebase configuration object
// These values should be set as environment variables in production
const firebaseConfig = {
  apiKey: "AIzaSyCYn_fK-QUbvD5-ZhlWjH20FyX4Er918qo",
  authDomain: "mindorart-8747d.firebaseapp.com",
  projectId: "mindorart-8747d",
  storageBucket: "mindorart-8747d.firebasestorage.app",
  messagingSenderId: "1058130358558",
  appId: "1:1058130358558:web:fa832733bfaece78c8590f",
  measurementId: "G-7NFV3MB1PE"
};

// Initialize Firebase
try {
    // Initialize Firebase app
    firebase.initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    const auth = firebase.auth();
    const firestore = firebase.firestore();
    const storage = firebase.storage();
    
    // Configure Firestore settings
    firestore.settings({
        timestampsInSnapshots: true
    });
    
    // Enable offline persistence for Firestore
    firestore.enablePersistence().catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Firestore persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
            console.warn('Firestore persistence not supported in this browser');
        }
    });
    
    // Configure Authentication settings
    auth.languageCode = 'en';
    
    // Set up auth state persistence
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch((error) => {
        console.warn('Auth persistence failed:', error);
    });
    
    console.log('Firebase initialized successfully');
    
} catch (error) {
    console.error('Firebase initialization failed:', error);
    
    // Show user-friendly error message
    document.addEventListener('DOMContentLoaded', function() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger position-fixed';
        errorDiv.style.top = '100px';
        errorDiv.style.right = '20px';
        errorDiv.style.zIndex = '9999';
        errorDiv.innerHTML = `
            <strong>Connection Error:</strong> Unable to connect to MINDORA.ART services. 
            Please check your internet connection and refresh the page.
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
        document.body.appendChild(errorDiv);
    });
}

// Firebase service instances for global access
window.firebaseAuth = firebase.auth();
window.firebaseFirestore = firebase.firestore();
window.firebaseStorage = firebase.storage();

// Collection references for easy access
window.FirebaseCollections = {
    WORKS: 'works',
    USERS: 'users',
    CATEGORIES: 'categories'
};

// Storage references for file uploads
window.FirebaseStorageRefs = {
    ART: 'art/',
    AUDIO: 'audio/',
    DOCUMENTS: 'documents/',
    AVATARS: 'avatars/'
};

// Firebase utility functions
window.FirebaseUtils = {
    // Get current timestamp
    timestamp: () => firebase.firestore.Timestamp.now(),
    
    // Get server timestamp for consistent ordering
    serverTimestamp: () => firebase.firestore.FieldValue.serverTimestamp(),
    
    // Array union for adding to arrays
    arrayUnion: (...elements) => firebase.firestore.FieldValue.arrayUnion(...elements),
    
    // Array remove for removing from arrays
    arrayRemove: (...elements) => firebase.firestore.FieldValue.arrayRemove(...elements),
    
    // Increment for numeric fields
    increment: (value) => firebase.firestore.FieldValue.increment(value),
    
    // Delete field
    deleteField: () => firebase.firestore.FieldValue.delete(),
    
    // Batch operations
    batch: () => firebase.firestore().batch(),
    
    // Transaction
    runTransaction: (updateFunction) => firebase.firestore().runTransaction(updateFunction)
};

// Error handling utilities
window.FirebaseErrorHandler = {
    // Handle Firestore errors
    handleFirestoreError: (error, operation = 'operation') => {
        console.error(`Firestore ${operation} error:`, error);
        
        let userMessage = `Error during ${operation}. `;
        
        switch (error.code) {
            case 'permission-denied':
                userMessage += 'You do not have permission to perform this action.';
                break;
            case 'unavailable':
                userMessage += 'Service is currently unavailable. Please try again later.';
                break;
            case 'deadline-exceeded':
                userMessage += 'Request timed out. Please try again.';
                break;
            case 'resource-exhausted':
                userMessage += 'Too many requests. Please wait a moment and try again.';
                break;
            default:
                userMessage += 'Please try again later.';
        }
        
        if (window.MindoraUtils && window.MindoraUtils.showNotification) {
            window.MindoraUtils.showNotification(userMessage, 'error');
        }
        
        return userMessage;
    },
    
    // Handle Storage errors
    handleStorageError: (error, operation = 'file operation') => {
        console.error(`Storage ${operation} error:`, error);
        
        let userMessage = `Error during ${operation}. `;
        
        switch (error.code) {
            case 'storage/unauthorized':
                userMessage += 'You do not have permission to access this file.';
                break;
            case 'storage/canceled':
                userMessage += 'Operation was canceled.';
                break;
            case 'storage/unknown':
                userMessage += 'An unknown error occurred.';
                break;
            case 'storage/object-not-found':
                userMessage += 'File not found.';
                break;
            case 'storage/bucket-not-found':
                userMessage += 'Storage bucket not found.';
                break;
            case 'storage/project-not-found':
                userMessage += 'Project not found.';
                break;
            case 'storage/quota-exceeded':
                userMessage += 'Storage quota exceeded.';
                break;
            case 'storage/unauthenticated':
                userMessage += 'You must be signed in to perform this action.';
                break;
            case 'storage/retry-limit-exceeded':
                userMessage += 'Retry limit exceeded. Please try again later.';
                break;
            case 'storage/invalid-checksum':
                userMessage += 'File upload failed due to checksum mismatch.';
                break;
            case 'storage/canceled':
                userMessage += 'Upload was canceled.';
                break;
            default:
                userMessage += 'Please try again later.';
        }
        
        if (window.MindoraUtils && window.MindoraUtils.showNotification) {
            window.MindoraUtils.showNotification(userMessage, 'error');
        }
        
        return userMessage;
    }
};

// Connection monitoring
let isOnline = navigator.onLine;

window.addEventListener('online', () => {
    isOnline = true;
    console.log('Connection restored');
    if (window.MindoraUtils && window.MindoraUtils.showNotification) {
        window.MindoraUtils.showNotification('Connection restored!', 'success');
    }
});

window.addEventListener('offline', () => {
    isOnline = false;
    console.log('Connection lost');
    if (window.MindoraUtils && window.MindoraUtils.showNotification) {
        window.MindoraUtils.showNotification('Connection lost. Some features may be limited.', 'warning');
    }
});

// Export connection status
window.FirebaseConnection = {
    isOnline: () => isOnline,
    waitForConnection: () => {
        return new Promise((resolve) => {
            if (isOnline) {
                resolve();
            } else {
                const checkConnection = () => {
                    if (isOnline) {
                        window.removeEventListener('online', checkConnection);
                        resolve();
                    }
                };
                window.addEventListener('online', checkConnection);
            }
        });
    }
};

// Development mode logging
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('MINDORA.ART running in development mode');
    
    // Enable Firebase debug logging in development
    firebase.firestore.setLogLevel('debug');
}

console.log('Firebase configuration loaded successfully');
