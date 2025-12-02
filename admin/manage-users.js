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
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Render user tables
    function renderUserLists() {
        const users = getUsers();
        const staffTableBody = document.querySelector('#staffTable tbody');
        const studentTableBody = document.querySelector('#studentTable tbody');
        const searchTerm = document.getElementById('userSearch') ? document.getElementById('userSearch').value.toLowerCase() : '';
        
        staffTableBody.innerHTML = '';
        studentTableBody.innerHTML = '';
        
        const staffUsers = users.filter(u => u.role === 'staff');
        const studentUsers = users.filter(u => u.role === 'student');
        
        // Filter by search term
        const filterUser = (user) => {
            if (!searchTerm) return true;
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            const email = user.email.toLowerCase();
            return fullName.includes(searchTerm) || email.includes(searchTerm);
        };
        
        staffUsers.filter(filterUser).forEach((user, idx) => {
            // Ensure user.id exists
            if (!user.id) user.id = 'staff-' + idx + '-' + Date.now();
            if (!user.status) user.status = 'active';
            const createdDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
            const statusColor = user.status === 'active' ? '#388e3c' : '#d32f2f';
            const statusText = user.status === 'active' ? 'Active' : 'Inactive';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="checkbox" class="user-checkbox" data-id="${user.id}" style="width: 18px; height: 18px; cursor: pointer;"></td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td style="font-size:13px;color:#666;">${createdDate}</td>
                <td><span style="background:${user.status === 'active' ? '#e8f5e9' : '#ffebee'};color:${statusColor};padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600;">${statusText}</span></td>
                <td>
                    <button class="edit-btn" data-id="${user.id}" style="margin-right:8px;padding:6px 12px;font-size:13px;">Edit</button>
                    <button class="toggle-status-btn" data-id="${user.id}" style="margin-right:8px;padding:6px 12px;font-size:13px;background:${user.status === 'active' ? '#f57c00' : '#388e3c'};color:#fff;border:none;border-radius:4px;cursor:pointer;">${user.status === 'active' ? 'Deactivate' : 'Activate'}</button>
                    <button class="delete-btn" data-id="${user.id}" style="padding:6px 12px;font-size:13px;">Delete</button>
                </td>
            `;
            staffTableBody.appendChild(tr);
        });
        studentUsers.filter(filterUser).forEach((user, idx) => {
            if (!user.id) user.id = 'student-' + idx + '-' + Date.now();
            if (!user.status) user.status = 'active';
            const createdDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
            const statusColor = user.status === 'active' ? '#388e3c' : '#d32f2f';
            const statusText = user.status === 'active' ? 'Active' : 'Inactive';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td style="font-size:13px;color:#666;">${createdDate}</td>
                <td><span style="background:${user.status === 'active' ? '#e8f5e9' : '#ffebee'};color:${statusColor};padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600;">${statusText}</span></td>
                <td>
                    <button class="edit-btn" data-id="${user.id}" style="margin-right:8px;padding:6px 12px;font-size:13px;">Edit</button>
                    <button class="toggle-status-btn" data-id="${user.id}" style="margin-right:8px;padding:6px 12px;font-size:13px;background:${user.status === 'active' ? '#f57c00' : '#388e3c'};color:#fff;border:none;border-radius:4px;cursor:pointer;">${user.status === 'active' ? 'Deactivate' : 'Activate'}</button>
                    <button class="delete-btn" data-id="${user.id}" style="padding:6px 12px;font-size:13px;">Delete</button>
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
        document.querySelectorAll('.toggle-status-btn').forEach(btn => {
            btn.addEventListener('click', handleToggleStatus);
        });
    }

    async function handleEditUser(e) {
        const userId = e.target.getAttribute('data-id');
        const users = getUsers();
        const user = users.find(u => u.id == userId);
        if (!user) return;
        
        const result = await customForm([
            { name: 'firstName', label: 'First Name', value: user.firstName, type: 'text' },
            { name: 'lastName', label: 'Last Name', value: user.lastName, type: 'text' },
            { name: 'email', label: 'Email', value: user.email, type: 'email' }
        ], 'Edit User');
        
        if (!result) return;
        if (!result.firstName.trim() || !result.lastName.trim() || !result.email.trim()) {
            await customAlert('All fields are required.', 'Missing Information');
            return;
        }
        
        user.firstName = result.firstName.trim();
        user.lastName = result.lastName.trim();
        user.email = result.email.trim();
        saveUsers(users);
        renderUserLists();
        await customAlert('User updated successfully!', 'Success');
    }

    async function handleDeleteUser(e) {
        const userId = e.target.getAttribute('data-id');
        const confirmed = await customConfirm('Are you sure you want to delete this user? This action cannot be undone.', 'Delete User', true);
        if (!confirmed) return;
        let users = getUsers();
        users = users.filter(u => u.id != userId);
        saveUsers(users);
        renderUserLists();
    }

    function handleToggleStatus(e) {
        const userId = e.target.getAttribute('data-id');
        let users = getUsers();
        const user = users.find(u => u.id == userId);
        if (!user) return;
        user.status = user.status === 'active' ? 'inactive' : 'active';
        saveUsers(users);
        renderUserLists();
    }

    // Handle create user
    createUserForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const role = document.getElementById('role').value;
        const defaultPassword = 'TempPass123!'; // Default password for all new users
        
        if (!firstName || !lastName || !email || !role) {
            await customAlert('Please fill in all fields.', 'Missing Information');
            return;
        }
        let users = getUsers();
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            await customAlert('A user with this email already exists.', 'Duplicate Email');
            return;
        }
        users.push({ 
            id: Date.now().toString(), 
            firstName, 
            lastName, 
            email, 
            password: defaultPassword,
            role,
            status: 'active', // User status: active or inactive
            mustChangePassword: true, // Flag to force password change on first login
            createdAt: new Date().toISOString(),
            createdBy: loggedInUser.firstName
        });
        saveUsers(users);
        createUserForm.reset();
        renderUserLists();
        await customAlert(`User created successfully!\\n\\nTemporary password: ${defaultPassword}\\n\\nUser must change this password on first login.`, 'User Created');
    });

    // Tab switching
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
    
    // Search functionality
    document.getElementById('userSearch').addEventListener('input', renderUserLists);

    renderUserLists();
});
