document.addEventListener('DOMContentLoaded', async function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    // Check if user is logged in
    if (!loggedInUser) {
        await customAlert('You need to log in to access this page.', 'Login Required');
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
    const sortBySelect = document.getElementById('sortBy');

    const sortAnnouncements = (announcements) => {
        const sortBy = sortBySelect.value;
        const sorted = [...announcements];
        
        if (sortBy === 'priority') {
            const priorityOrder = { urgent: 0, important: 1, general: 2 };
            sorted.sort((a, b) => {
                const aPriority = priorityOrder[a.priority || 'general'];
                const bPriority = priorityOrder[b.priority || 'general'];
                if (aPriority !== bPriority) {
                    return aPriority - bPriority;
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        } else if (sortBy === 'date-asc') {
            sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else { // date-desc (default)
            sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        return sorted;
    };

    const displayAnnouncements = () => {
        announcementList.innerHTML = '';
        if (announcements.length === 0) {
            announcementList.innerHTML = '<p style="color: #999; font-style: italic;">No announcements yet.</p>';
            return;
        }
        const sortedAnnouncements = sortAnnouncements(announcements);
        sortedAnnouncements.forEach((announcement) => {
            const index = announcements.findIndex(a => a.id === announcement.id);
            const div = document.createElement('div');
            div.classList.add('announcement-item');
            
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
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <h4 style="color:#2C3E50;margin:0;flex:1;">${announcement.title || '(No Title)'}</h4>
                    <span style="background:${priorityBg};color:${priorityColor};padding:4px 12px;border-radius:12px;font-size:11px;font-weight:bold;">${priorityText}</span>
                </div>
                <p style="white-space:pre-wrap;word-wrap:break-word;">${announcement.text.replace(/\n/g, '<br>')}</p>
                <div class="announcement-actions" style="margin-top:10px;">
                    ${canEdit ? `<button class=\"edit-btn\" onclick=\"editAnnouncement(${index})\">Edit</button>` : ''}
                    ${canDelete ? `<button class=\"delete-btn\" onclick=\"deleteAnnouncement(${index})\">Delete</button>` : ''}
                </div>
            `;
            announcementList.appendChild(div);
        });
    };

    // CRUD Operations
    const addAnnouncement = async () => {
        const title = announcementTitle.value.trim();
        const text = announcementText.value.trim();
        const priority = document.getElementById('announcement-priority').value;
        if (!title) {
            await customAlert('Please enter an announcement title.', 'Missing Title');
            return;
        }
        if (!text) {
            await customAlert('Please enter an announcement text.', 'Missing Content');
            return;
        }
        const newAnnouncement = {
            id: Date.now().toString(),
            title: title,
            text: text,
            priority: priority,
            createdBy: loggedInUser.firstName,
            createdAt: new Date().toISOString(),
            role: role
        };
        announcements.push(newAnnouncement);
        localStorage.setItem('announcements', JSON.stringify(announcements));
        announcementTitle.value = '';
        announcementText.value = '';
        displayAnnouncements();
        await customAlert('Announcement created successfully!', 'Success');
    };

    window.editAnnouncement = async (index) => {
        const announcement = announcements[index];
        
        const result = await customForm([
            { name: 'title', label: 'Title', value: announcement.title || '', type: 'text' },
            { name: 'text', label: 'Content', value: announcement.text, type: 'textarea', rows: 6 }
        ], 'Edit Announcement');
        
        if (!result) return;
        if (!result.title.trim() || !result.text.trim()) {
            await customAlert('Title and content are required.', 'Missing Information');
            return;
        }
        
        announcements[index].title = result.title.trim();
        announcements[index].text = result.text.trim();
        announcements[index].editedBy = loggedInUser.firstName;
        announcements[index].editedAt = new Date().toISOString();
        localStorage.setItem('announcements', JSON.stringify(announcements));
        displayAnnouncements();
        await customAlert('Announcement updated successfully!', 'Success');
    };

    window.deleteAnnouncement = async (index) => {
        const confirmed = await customConfirm('Are you sure you want to delete this announcement? This action cannot be undone.', 'Delete Announcement', true);
        if (confirmed) {
            announcements.splice(index, 1);
            localStorage.setItem('announcements', JSON.stringify(announcements));
            displayAnnouncements();
            await customAlert('Announcement deleted successfully!', 'Success');
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

    // Sort change listener
    sortBySelect.addEventListener('change', displayAnnouncements);

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
            logoutBtn.addEventListener('click', async function (e) {
                e.preventDefault();
                localStorage.removeItem('loggedInUser');
                await customAlert('You have been logged out.', 'Logged Out');
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
