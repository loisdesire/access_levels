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
        
        if (revenueWidget) revenueWidget.querySelector('p').textContent = data.admins;
        if (usersWidget) usersWidget.querySelector('p').textContent = data.students;
        if (messagesWidget) messagesWidget.querySelector('p').textContent = data.staffs;
    }

    // Function to update Staff dashboard
    function updateStaffDashboard(data) {
        const studentsWidget = document.getElementById('studentsWidget');
        const staffsWidget = document.getElementById('staffsWidget');
        
        if (studentsWidget) studentsWidget.querySelector('p').textContent = data.students;
        if (staffsWidget) staffsWidget.querySelector('p').textContent = data.staffs;
    }

    // Function to update Student dashboard
    function updateStudentDashboard(data) {
        const studentsWidget = document.getElementById('studentsWidget');
        const announcementsWidget = document.getElementById('announcementsWidget');
        
        if (studentsWidget) studentsWidget.querySelector('p').textContent = data.students;
        
        // Get announcements count
        if (announcementsWidget) {
            const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
            announcementsWidget.querySelector('p').textContent = announcements.length;
        }
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

