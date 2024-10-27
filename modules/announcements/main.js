document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const role = loggedInUser.role; // Get the user's role from localStorage

    // Elements
    const announcementList = document.getElementById('announcement-list');
    const createBtn = document.getElementById('create-btn');
    const announcementText = document.getElementById('announcement-text');

    // Fetch and display announcements
    let announcements = JSON.parse(localStorage.getItem('announcements')) || [];

    const displayAnnouncements = () => {
        announcementList.innerHTML = ''; // Clear the list first
        announcements.forEach((announcement, index) => {
            const div = document.createElement('div');
            div.classList.add('announcement-item');
            div.innerHTML = `
                <p>${announcement.text}</p>
                ${(role === 'admin' || role === 'staff') ? 
                  `<button onclick="editAnnouncement(${index})">Edit</button>` : ''}
                ${(role === 'admin') ? 
                  `<button onclick="deleteAnnouncement(${index})">Delete</button>` : ''}
            `;
            announcementList.appendChild(div);
        });
    };

    // CRUD Operations
    const addAnnouncement = () => {
        const newAnnouncement = {
            text: announcementText.value
        };
        announcements.push(newAnnouncement);
        localStorage.setItem('announcements', JSON.stringify(announcements));
        announcementText.value = '';
        displayAnnouncements();
    };

    window.editAnnouncement = (index) => {
        const newText = prompt('Edit the announcement:', announcements[index].text);
        if (newText !== null) {
            announcements[index].text = newText;
            localStorage.setItem('announcements', JSON.stringify(announcements));
            displayAnnouncements();
        }
    };

    window.deleteAnnouncement = (index) => {
        announcements.splice(index, 1);
        localStorage.setItem('announcements', JSON.stringify(announcements));
        displayAnnouncements();
    };

    // Only admins and staff can create or edit
    if (role === 'admin' || role === 'staff') {
        createBtn.addEventListener('click', addAnnouncement);
    } else {
        document.getElementById('announcement-actions').style.display = 'none'; // Hide the form for students
    }

    displayAnnouncements();
});
