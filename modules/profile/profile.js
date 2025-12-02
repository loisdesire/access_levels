document.addEventListener('DOMContentLoaded', async function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    if (!loggedInUser) {
        await customAlert('You need to log in to access this page.', 'Login Required');
        window.location.href = '../../auth/login/login.html';
        return;
    }

    // Update header
    const userProfile = document.querySelector('.user-profile span');
    if (userProfile) {
        userProfile.textContent = `Welcome, ${loggedInUser.firstName}`;
    }

    // Populate profile info
    document.getElementById('firstName').value = loggedInUser.firstName || '';
    document.getElementById('lastName').value = loggedInUser.lastName || '';
    document.getElementById('email').value = loggedInUser.email || '';
    document.getElementById('role').value = loggedInUser.role || '';
    
    const createdDate = loggedInUser.createdAt ? new Date(loggedInUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown';
    document.getElementById('createdAt').value = createdDate;

    // Update display info
    document.getElementById('displayName').textContent = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
    document.getElementById('displayRole').textContent = loggedInUser.role.charAt(0).toUpperCase() + loggedInUser.role.slice(1);
    document.getElementById('userAvatar').textContent = loggedInUser.firstName.charAt(0).toUpperCase();

    // Handle form submission
    document.getElementById('profileForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const currentPassword = document.getElementById('currentPassword').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        if (!firstName || !lastName || !email) {
            await customAlert('Please fill in all required fields.', 'Missing Information');
            return;
        }

        // Get all users
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === loggedInUser.email);

        if (userIndex === -1) {
            await customAlert('User not found.', 'Error');
            return;
        }

        // Check if email is being changed and if it's already in use
        if (email !== loggedInUser.email) {
            if (users.some(u => u.email === email && u.email !== loggedInUser.email)) {
                await customAlert('This email is already in use by another user.', 'Email Conflict');
                return;
            }
        }

        // Handle password change
        if (currentPassword || newPassword || confirmPassword) {
            if (!currentPassword) {
                await customAlert('Please enter your current password to change it.', 'Current Password Required');
                return;
            }
            if (currentPassword !== loggedInUser.password) {
                await customAlert('Current password is incorrect.', 'Invalid Password');
                return;
            }
            if (!newPassword || !confirmPassword) {
                await customAlert('Please fill in both new password fields.', 'Missing Password');
                return;
            }
            if (newPassword !== confirmPassword) {
                await customAlert('New passwords do not match.', 'Password Mismatch');
                return;
            }

            // Validate new password strength
            const hasMinLength = newPassword.length >= 8;
            const hasUpper = /[A-Z]/.test(newPassword);
            const hasLower = /[a-z]/.test(newPassword);
            const hasNumber = /[0-9]/.test(newPassword);

            if (!hasMinLength || !hasUpper || !hasLower || !hasNumber) {
                await customAlert('New password does not meet requirements:\n- At least 8 characters\n- One uppercase letter\n- One lowercase letter\n- One number', 'Weak Password');
                return;
            }

            users[userIndex].password = newPassword;
            users[userIndex].mustChangePassword = false;
        }

        // Update user info
        users[userIndex].firstName = firstName;
        users[userIndex].lastName = lastName;
        users[userIndex].email = email;

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Update logged in user
        loggedInUser.firstName = firstName;
        loggedInUser.lastName = lastName;
        loggedInUser.email = email;
        if (newPassword) {
            loggedInUser.password = newPassword;
            loggedInUser.mustChangePassword = false;
        }
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        await customAlert('Profile updated successfully!', 'Success');
        
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';

        // Reload page to show updated info
        window.location.reload();
    });
});
