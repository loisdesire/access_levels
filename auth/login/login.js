document.querySelector('.login-form').addEventListener('submit', function (e) {
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
        alert('Login successful!');
        
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
                window.location.href = '../../dashboard/student.html';
                break;
            default:
                alert('Invalid role. Please contact the administrator.');
        }
    } else {
        alert('Invalid email or password. Please try again.\n\nTip: Make sure you registered first and entered the exact email and password.');
        console.error('Login failed. No matching user found.');
    }
});
