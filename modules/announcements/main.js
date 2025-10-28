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

    // Fetch and display announcements
    let announcements = JSON.parse(localStorage.getItem('announcements')) || [];

    const displayAnnouncements = () => {
        announcementList.innerHTML = ''; // Clear the list first
        
        if (announcements.length === 0) {
            announcementList.innerHTML = '<p style="color: #999; font-style: italic;">No announcements yet.</p>';
            return;
        }
        
        announcements.forEach((announcement, index) => {
            const div = document.createElement('div');
            div.classList.add('announcement-item');
            div.innerHTML = `
                <p>${announcement.text}</p>
                <div class="announcement-actions">
                    ${(role === 'admin' || role === 'staff') ? 
                      `<button class="edit-btn" onclick="editAnnouncement(${index})">Edit</button>` : ''}
                    ${(role === 'admin') ? 
                      `<button class="delete-btn" onclick="deleteAnnouncement(${index})">Delete</button>` : ''}
                </div>
            `;
            announcementList.appendChild(div);
        });
    };

    // CRUD Operations
    const addAnnouncement = () => {
        const text = announcementText.value.trim();
        
        if (!text) {
            alert('Please enter an announcement text.');
            return;
        }
        
        const newAnnouncement = {
            text: text,
            createdBy: loggedInUser.firstName,
            createdAt: new Date().toISOString(),
            role: role
        };
        
        announcements.push(newAnnouncement);
        localStorage.setItem('announcements', JSON.stringify(announcements));
        announcementText.value = '';
        displayAnnouncements();
        alert('Announcement created successfully!');
    };

    window.editAnnouncement = (index) => {
        const newText = prompt('Edit the announcement:', announcements[index].text);
        if (newText !== null && newText.trim() !== '') {
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
});
