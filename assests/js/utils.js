// Utility functions

// Get logged in user
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('loggedInUser'));
}

// Update user profile display
function updateUserProfileDisplay() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;
    
    const userProfile = document.querySelector('.user-profile span');
    if (userProfile) {
        userProfile.textContent = `Welcome, ${loggedInUser.firstName}`;
    }
}

// Logout handler
async function handleLogout() {
    localStorage.removeItem('loggedInUser');
    await customAlert('You have been logged out.', 'Goodbye');
    window.location.href = getLoginPath();
}

// Get login path based on current location
function getLoginPath() {
    const path = window.location.pathname;
    if (path.includes('/dashboard/') || path.includes('/admin/')) {
        return '../auth/login/login.html';
    } else if (path.includes('/modules/')) {
        return '../../auth/login/login.html';
    }
    return '../auth/login/login.html';
}

// Attach logout button handler
function attachLogoutHandler() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn && !logoutBtn.dataset.bound) {
        logoutBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            await handleLogout();
        });
        logoutBtn.dataset.bound = 'true';
    }
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format timestamp
function formatTimestamp(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
}

// Validate password strength
function validatePasswordStrength(password) {
    const requirements = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password)
    };
    
    const allMet = Object.values(requirements).every(req => req);
    return { requirements, allMet };
}
