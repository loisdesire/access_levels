document.addEventListener('DOMContentLoaded', function() {
    // Display logged-in user's name
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser || loggedInUser.role !== 'admin') {
        window.location.href = '../auth/login/login.html';
        return;
    }
    const userProfile = document.querySelector('.user-profile span');
    if (userProfile) {
        userProfile.textContent = `Welcome, ${loggedInUser.firstName}`;
    }

    // Elements
    const createUserForm = document.getElementById('createUserForm');
    const staffList = document.getElementById('staffList');
    const studentList = document.getElementById('studentList');

    // Fetch users from localStorage
    function getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }
    function setUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Render user lists
    function renderUserLists() {
        const users = getUsers();
        const staffTableBody = document.querySelector('#staffTable tbody');
        const studentTableBody = document.querySelector('#studentTable tbody');
        staffTableBody.innerHTML = '';
        studentTableBody.innerHTML = '';
        users.filter(u => u.role === 'staff').forEach((user, idx) => {
            // Ensure user.id exists
            if (!user.id) user.id = 'staff-' + idx + '-' + Date.now();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>
                    <button class="edit-btn" data-id="${user.id}" style="margin-right:8px;">Edit</button>
                    <button class="delete-btn" data-id="${user.id}">Delete</button>
                </td>
            `;
            staffTableBody.appendChild(tr);
        });
        users.filter(u => u.role === 'student').forEach((user, idx) => {
            if (!user.id) user.id = 'student-' + idx + '-' + Date.now();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>
                    <button class="edit-btn" data-id="${user.id}" style="margin-right:8px;">Edit</button>
                    <button class="delete-btn" data-id="${user.id}">Delete</button>
                </td>
            `;
            studentTableBody.appendChild(tr);
        });
        saveUsers(users); // Save any new ids
        // Attach event listeners for edit and delete
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEditUser);
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteUser);
        });
    }

    function handleEditUser(e) {
        const userId = e.target.getAttribute('data-id');
        // Find user and prompt for new values
        const users = getUsers();
        const user = users.find(u => u.id == userId);
        if (!user) return;
        const newFirstName = prompt('Edit First Name:', user.firstName);
        if (newFirstName === null) return;
        const newLastName = prompt('Edit Last Name:', user.lastName);
        if (newLastName === null) return;
        const newEmail = prompt('Edit Email:', user.email);
        if (newEmail === null) return;
        user.firstName = newFirstName.trim();
        user.lastName = newLastName.trim();
        user.email = newEmail.trim();
        setUsers(users);
        renderUserLists();
    }

    function handleDeleteUser(e) {
        const userId = e.target.getAttribute('data-id');
        if (!confirm('Are you sure you want to delete this user?')) return;
        let users = getUsers();
        users = users.filter(u => u.id != userId);
        saveUsers(users);
        renderUserLists();
    }

    // Handle create user
    createUserForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const role = document.getElementById('role').value;
        if (!firstName || !lastName || !email || !password || !role) {
            alert('Please fill in all fields.');
            return;
        }
        let users = getUsers();
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            alert('A user with this email already exists.');
            return;
        }
        users.push({ id: Date.now(), firstName, lastName, email, password, role });
        setUsers(users);
        createUserForm.reset();
        renderUserLists();
        alert('User created successfully!');
    });

    // Tab switching logic
    document.addEventListener('DOMContentLoaded', function() {
        const staffTabBtn = document.getElementById('staffTabBtn');
        const studentTabBtn = document.getElementById('studentTabBtn');
        const staffTable = document.getElementById('staffTable');
        const studentTable = document.getElementById('studentTable');
        staffTabBtn.addEventListener('click', function() {
            staffTabBtn.classList.add('active');
            studentTabBtn.classList.remove('active');
            staffTable.style.display = '';
            studentTable.style.display = 'none';
        });
        studentTabBtn.addEventListener('click', function() {
            staffTabBtn.classList.remove('active');
            studentTabBtn.classList.add('active');
            staffTable.style.display = 'none';
            studentTable.style.display = '';
        });
    });

    renderUserLists();
});
