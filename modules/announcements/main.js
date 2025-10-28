document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    // Check if user is logged in
    if (!loggedInUser) {
        alert('You need to log in to access this page.');
        window.location.href = '../../auth/login/login.html';
        return;
    }
    
    const role = loggedInUser.role; // Get the user's role from localStorage

    // Update user profile display
    const userProfile = document.querySelector('.user-profile span');
    if (userProfile) {
        userProfile.textContent = `Welcome, ${loggedInUser.firstName}`;
    }

    // Elements
    const announcementList = document.getElementById('announcement-list');
    const createBtn = document.getElementById('create-btn');
    const announcementText = document.getElementById('announcement-text');
    const announcementTitle = document.getElementById('announcement-title');

    // Fetch and display announcements
    let announcements = JSON.parse(localStorage.getItem('announcements')) || [];

    const displayAnnouncements = () => {
        announcementList.innerHTML = '';
        if (announcements.length === 0) {
            announcementList.innerHTML = '<p style="color: #999; font-style: italic;">No announcements yet.</p>';
            return;
        }
        announcements.forEach((announcement, index) => {
            const div = document.createElement('div');
            div.classList.add('announcement-item');
            // Staff can only edit/delete their own announcements
            let canEdit = false, canDelete = false;
            if (role === 'admin') {
                canEdit = true;
                canDelete = true;
            } else if (role === 'staff') {
                canEdit = (announcement.createdBy === loggedInUser.firstName);
                canDelete = (announcement.createdBy === loggedInUser.firstName);
            }
            div.innerHTML = `
                <h4 style="color:#2C3E50;margin-bottom:5px;">${announcement.title || '(No Title)'}</h4>
                <p>${announcement.text}</p>
                <div class="announcement-actions" style="margin-top:10px;">
                    ${canEdit ? `<button class=\"edit-btn\" onclick=\"editAnnouncement(${index})\">Edit</button>` : ''}
                    ${canDelete ? `<button class=\"delete-btn\" onclick=\"deleteAnnouncement(${index})\">Delete</button>` : ''}
                </div>
            `;
            announcementList.appendChild(div);
        });
    };

    // CRUD Operations
    const addAnnouncement = () => {
        const title = announcementTitle.value.trim();
        const text = announcementText.value.trim();
        if (!title) {
            alert('Please enter an announcement title.');
            return;
        }
        if (!text) {
            alert('Please enter an announcement text.');
            return;
        }
        const newAnnouncement = {
            title: title,
            text: text,
            createdBy: loggedInUser.firstName,
            createdAt: new Date().toISOString(),
            role: role
        };
        announcements.push(newAnnouncement);
        localStorage.setItem('announcements', JSON.stringify(announcements));
        announcementTitle.value = '';
        announcementText.value = '';
        displayAnnouncements();
        alert('Announcement created successfully!');
    };

    window.editAnnouncement = (index) => {
        const newTitle = prompt('Edit the announcement title:', announcements[index].title || '');
        if (newTitle === null || newTitle.trim() === '') return;
        const newText = prompt('Edit the announcement:', announcements[index].text);
        if (newText !== null && newText.trim() !== '') {
            announcements[index].title = newTitle.trim();
            announcements[index].text = newText.trim();
            announcements[index].editedBy = loggedInUser.firstName;
            announcements[index].editedAt = new Date().toISOString();
            localStorage.setItem('announcements', JSON.stringify(announcements));
            displayAnnouncements();
            alert('Announcement updated successfully!');
        }
    };

    window.deleteAnnouncement = (index) => {
        if (confirm('Are you sure you want to delete this announcement?')) {
            announcements.splice(index, 1);
            localStorage.setItem('announcements', JSON.stringify(announcements));
            displayAnnouncements();
            alert('Announcement deleted successfully!');
        }
    };

    // Only admins and staff can create or edit
    if (role === 'admin' || role === 'staff') {
        createBtn.addEventListener('click', addAnnouncement);
        
        // Allow Enter key to submit
        announcementText.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addAnnouncement();
            }
        });
    } else {
        document.getElementById('announcement-actions').style.display = 'none'; // Hide the form for students
    }

    displayAnnouncements();

    // --- Sidebar Navigation: Make Home link role-aware ---
    function updateSidebarHomeLink() {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) return;
        const role = loggedInUser.role;
        const homeLink = document.querySelector('.nav-link[data-page="admin"]');
        if (homeLink) {
            if (role === 'admin') {
                homeLink.href = '../../dashboard/admin.html';
            } else if (role === 'staff') {
                homeLink.href = '../../dashboard/staff.html';
            } else if (role === 'student') {
                homeLink.href = '../../dashboard/student.html';
            }
        }
    }
    // Wait for sidebar to load, then update Home link
    setTimeout(updateSidebarHomeLink, 200);

    // --- Logout Button Functionality ---
    function setupLogoutButton() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('loggedInUser');
                alert('You have been logged out.');
                window.location.href = '../../auth/login/login.html';
            });
        }
    }
    setTimeout(setupLogoutButton, 200);

    // Patch: Always ensure bullhorn icon is present on Announcements nav
    function ensureBullhornIconOnSidebar() {
        const navLinks = document.querySelectorAll('.nav-link[data-page="announcements"]');
        navLinks.forEach(link => {
            if (!link.querySelector('i.fas.fa-bullhorn')) {
                const icon = document.createElement('i');
                icon.className = 'fas fa-bullhorn';
                link.prepend(icon);
            }
        });
    }
    setTimeout(ensureBullhornIconOnSidebar, 400);
});
