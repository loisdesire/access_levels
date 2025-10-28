document.addEventListener('DOMContentLoaded', () => {
    // Get logged-in user data from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // If no user is logged in, redirect to login page
    if (!loggedInUser) {
        // alert('You need to log in to access this page.');
        window.location.href = '../auth/login/login.html';
        return;
    }

    // Display logged-in user's name in the header
    const userProfile = document.querySelector('.user-profile span');
    if (userProfile) {
        userProfile.textContent = `Welcome, ${loggedInUser.firstName}`;
    }

    // Fetch all users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Count the number of admins, students, and staff
    const dashboardData = {
        admins: users.filter(user => user.role === 'admin').length,
        students: users.filter(user => user.role === 'student').length,
        staffs: users.filter(user => user.role === 'staff').length,
    };

    // Check role and update dashboard accordingly
    const role = loggedInUser.role;

    if (role === 'admin') {
        updateAdminDashboard(dashboardData);
    } else if (role === 'staff') {
        updateStaffDashboard(dashboardData);
    } else if (role === 'student') {
        updateStudentDashboard(dashboardData);
    }

    // Function to update Admin dashboard
    function updateAdminDashboard(data) {
        const revenueWidget = document.getElementById('revenueWidget');
        const usersWidget = document.getElementById('usersWidget');
        const messagesWidget = document.getElementById('messagesWidget');
        const announcementsWidget = document.getElementById('announcementsWidget');
        
        if (revenueWidget) revenueWidget.querySelector('p').textContent = data.admins;
        if (usersWidget) usersWidget.querySelector('p').textContent = data.students;
        if (messagesWidget) messagesWidget.querySelector('p').textContent = data.staffs;
        
        // Get announcements count
        const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
        if (announcementsWidget) {
            announcementsWidget.querySelector('p').textContent = announcements.length;
        }
        
        // Display recent announcements
        displayRecentAnnouncements(announcements);
    }
    
    // Function to display recent announcements
    function displayRecentAnnouncements(announcements, limit = 5) {
        const recentList = document.getElementById('recentAnnouncementsList');
        if (!recentList) return;
        
        if (announcements.length === 0) {
            recentList.innerHTML = '<p class="no-data">No announcements yet.</p>';
            return;
        }
        
        // Get the most recent announcements
        const recentAnnouncements = announcements
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
        
        recentList.innerHTML = recentAnnouncements.map(announcement => {
            const date = new Date(announcement.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            return `
                <div class="announcement-card">
                    <div class="announcement-header">
                        <h4>${announcement.title}</h4>
                        <span class="announcement-date">${date}</span>
                    </div>
                    <p class="announcement-content">${announcement.text}</p>
                    <div class="announcement-meta">
                        <span><i class="fas fa-user"></i> ${announcement.createdBy || 'Admin'}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Function to update Staff dashboard
    function updateStaffDashboard(data) {
        const myAnnouncementsWidget = document.getElementById('myAnnouncementsWidget');
        const totalAnnouncementsWidget = document.getElementById('totalAnnouncementsWidget');
        
        // Get announcements
        const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
        
        // Count announcements created by this staff member
        const myAnnouncements = announcements.filter(a => 
            a.createdBy === `${loggedInUser.firstName} ${loggedInUser.lastName}` || 
            a.createdBy === loggedInUser.email
        );
        
        if (myAnnouncementsWidget) {
            myAnnouncementsWidget.querySelector('p').textContent = myAnnouncements.length;
        }
        if (totalAnnouncementsWidget) {
            totalAnnouncementsWidget.querySelector('p').textContent = announcements.length;
        }
        
        // Display recent announcements
        displayRecentAnnouncements(announcements);
    }

    // Function to update Student dashboard
    function updateStudentDashboard(data) {
        const announcementsWidget = document.getElementById('announcementsWidget');
        
        // Get announcements count
        const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
        if (announcementsWidget) {
            announcementsWidget.querySelector('p').textContent = announcements.length;
        }
        
        // Display recent announcements (show more for students - 7 announcements)
        displayRecentAnnouncements(announcements, 7);
    }

    // Logout functionality
    const checkLogoutButton = () => {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('loggedInUser');
                alert('You have been logged out.');
                window.location.href = '../auth/login/login.html';
            });
        } else {
            console.error('Logout button not found in the DOM, retrying...');
            setTimeout(checkLogoutButton, 100);
        }
    };

    // Start checking for the logout button
    checkLogoutButton();
});

