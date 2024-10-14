document.addEventListener('DOMContentLoaded', () => {
    // Get logged-in user data from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  
    document.addEventListener('DOMContentLoaded', function () {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
        // If no user is logged in, redirect to login page
        if (!loggedInUser) {
            // alert('You need to log in to access this page.');
            window.location.href = '/auth/login/login.html'; // Redirect to login
        } else {
            // Display logged-in user's name and role in the dashboard
            const userProfile = document.querySelector('.user-profile span');
            if (userProfile) {
                userProfile.textContent = `Welcome, ${loggedInUser.firstName}`;
            }
        }
    });

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
        document.getElementById('revenueWidget').querySelector('p').textContent = data.admins;
        document.getElementById('usersWidget').querySelector('p').textContent = data.students;
        document.getElementById('messagesWidget').querySelector('p').textContent = data.staffs;
    }

    // Placeholder functions for other dashboards (you can expand these later if needed)
    function updateStaffDashboard(data) {
        // Modify this function to update staff-specific widgets
    }

    function updateStudentDashboard(data) {
        // Modify this function to update student-specific widgets
    }

    // Logout functionality
    const checkLogoutButton = () => {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('loggedInUser');
                alert('You have been logged out.');
                window.location.href = '/auth/login/login.html';
            });
        } else {
            console.error('Logout button not found in the DOM, retrying...');
            setTimeout(checkLogoutButton, 100);
        }
    };

    // Start checking for the logout button
    checkLogoutButton();
});

