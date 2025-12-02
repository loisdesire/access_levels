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
            
            // Priority badge styling
            const priority = announcement.priority || 'general';
            let priorityColor, priorityBg, priorityText;
            if (priority === 'urgent') {
                priorityColor = '#d32f2f';
                priorityBg = '#ffebee';
                priorityText = 'URGENT';
            } else if (priority === 'important') {
                priorityColor = '#f57c00';
                priorityBg = '#fff3e0';
                priorityText = 'IMPORTANT';
            } else {
                priorityColor = '#1976d2';
                priorityBg = '#e3f2fd';
                priorityText = 'GENERAL';
            }
            
            return `
                <div class="announcement-card" onclick="window.location.href='../modules/announcements/main.html'" style="cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='';this.style.boxShadow=''">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                        <h4 style="color:#2C3E50;margin:0;flex:1;font-size:15px;">${announcement.title || '(No Title)'}</h4>
                        <span style="background:${priorityBg};color:${priorityColor};padding:4px 12px;border-radius:12px;font-size:11px;font-weight:bold;">${priorityText}</span>
                    </div>
                    <p style="margin:8px 0;color:#555;line-height:1.5;max-height:60px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;">${announcement.text}</p>
                    <div class="announcement-meta" style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:13px;color:#7f8c8d;">
                        <span><i class="fas fa-user"></i> ${announcement.createdBy || 'Admin'}</span>
                        <span>${date}</span>
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
        
        // Count announcements created by this staff member (matches firstName from loggedInUser)
        const myAnnouncements = announcements.filter(a => 
            a.createdBy === loggedInUser.firstName
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

    // Utility to attach logout handler
    function attachLogoutHandler() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn && !logoutBtn.dataset.bound) {
            logoutBtn.addEventListener('click', async function (e) {
                e.preventDefault();
                localStorage.removeItem('loggedInUser');
                await customAlert('You have been logged out.', 'Goodbye');
                window.location.href = '../auth/login/login.html';
            });
            logoutBtn.dataset.bound = 'true';
        }
    }

    // Attach after sidebar loads
    function waitForSidebarAndAttachLogout() {
        if (document.getElementById('logoutBtn')) {
            attachLogoutHandler();
        } else {
            setTimeout(waitForSidebarAndAttachLogout, 100);
        }
    }
    waitForSidebarAndAttachLogout();
});

