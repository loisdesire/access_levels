document.querySelector('.login-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form submission

    // Get the input values and trim whitespace
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Fetch user data from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    console.log('Attempting login with:', { email, password });
    console.log('Users in storage:', users);

    // Check if the user exists and the password matches
    const user = users.find(u => u.email.trim() === email && u.password.trim() === password);

    if (user) {
        // Check if user account is inactive
        if (user.status === 'inactive') {
            await customAlert('Your account has been deactivated. Please contact the administrator.', 'Account Deactivated');
            return;
        }
        
        // Check if user must change password on first login
        if (user.mustChangePassword) {
            const result = await customForm([
                { name: 'newPassword', label: 'New Password', value: '', type: 'password', placeholder: '8+ chars, uppercase, lowercase, number' }
            ], 'Change Password', 'You must change your password before continuing.');
            
            if (!result || !result.newPassword) {
                await customAlert('Password change is required. Login cancelled.', 'Password Change Required');
                return;
            }
            
            const newPassword = result.newPassword;
            
            // Validate new password
            const hasMinLength = newPassword.length >= 8;
            const hasUpper = /[A-Z]/.test(newPassword);
            const hasLower = /[a-z]/.test(newPassword);
            const hasNumber = /[0-9]/.test(newPassword);
            
            if (!hasMinLength || !hasUpper || !hasLower || !hasNumber) {
                await customAlert('Password does not meet requirements:\n- At least 8 characters\n- One uppercase letter\n- One lowercase letter\n- One number\n\nPlease try logging in again.', 'Invalid Password');
                return;
            }
            
            // Update password and remove flag
            user.password = newPassword;
            user.mustChangePassword = false;
            users = users.map(u => u.email === user.email ? user : u);
            localStorage.setItem('users', JSON.stringify(users));
            await customAlert('Password changed successfully!', 'Success');
        }
        
        await customAlert('Login successful! Redirecting to your dashboard...', 'Welcome Back');
        
        // Save the logged-in user to localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(user)); // Store the logged-in user's details

        // Redirect to the correct dashboard based on the role
        switch (user.role) {
            case 'admin':
                window.location.href = '../../dashboard/admin.html';
                break;
            case 'staff':
                window.location.href = '../../dashboard/staff.html';
                break;
            case 'student':
                window.location.href = '../../modules/announcements/main.html';
                break;
            default:
                await customAlert('Invalid role. Please contact the administrator.', 'Error');
        }
    } else {
        await customAlert('Invalid email or password. Please try again.\n\nTip: Make sure you registered first and entered the exact email and password.', 'Login Failed');
        console.error('Login failed. No matching user found.');
    }
});
