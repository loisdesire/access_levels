// Centralized navigation initialization
function initializeSidebarNavigation() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const userRole = loggedInUser ? loggedInUser.role : 'student';
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Determine base path based on current location
    const path = window.location.pathname;
    let basePath = '../';
    if (path.includes('/dashboard/')) {
        basePath = '../';
    } else if (path.includes('/modules/')) {
        basePath = '../../';
    } else if (path.includes('/admin/')) {
        basePath = '../';
    }
    
    navLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === 'admin') {
            // Home/Dashboard link
            if (path.includes('/dashboard/')) {
                link.href = `${userRole}.html`;
            } else {
                link.href = `${basePath}dashboard/${userRole}.html`;
            }
        } else if (page === 'announcements') {
            if (path.includes('/modules/announcements/')) {
                link.href = 'main.html';
            } else {
                link.href = `${basePath}modules/announcements/main.html`;
            }
        } else if (page === 'profile') {
            if (path.includes('/modules/profile/')) {
                link.href = 'profile.html';
            } else {
                link.href = `${basePath}modules/profile/profile.html`;
            }
        } else if (page === 'manage-users') {
            if (path.includes('/admin/')) {
                link.href = 'manage-users.html';
            } else {
                link.href = `${basePath}admin/manage-users.html`;
            }
        }
    });
    
    // Show Manage Users only for admins
    if (userRole === 'admin') {
        const manageUsersNav = document.getElementById('manageUsersNav');
        if (manageUsersNav) manageUsersNav.style.display = '';
    }
}

// Load sidebar and initialize navigation
function loadSidebar() {
    const path = window.location.pathname;
    let basePath = '../';
    if (path.includes('/modules/')) {
        basePath = '../../';
    } else if (path.includes('/admin/') || path.includes('/dashboard/')) {
        basePath = '../';
    }
    
    fetch(`${basePath}components/sideBar.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
            initializeSidebarNavigation();
        })
        .catch(error => console.error('Error loading sidebar:', error));
}
