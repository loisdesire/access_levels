document.querySelector('.login-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    // Get the input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Fetch user data from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the user exists and the password matches
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert('Login successful!');
        
        // Save the logged-in user to localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(user)); // Store the logged-in user's details

        // Redirect to the correct dashboard based on the role
        switch (user.role) {
            case 'admin':
                window.location.href = '/dashboard/admin.html';
                break;
            case 'staff':
                window.location.href = '/dashboard/staff.html';
                break;
            case 'student':
                window.location.href = '/dashboard/student.html';
                break;
            default:
                alert('Invalid role. Please contact the administrator.');
        }
    } else {
        alert('Invalid email or password. Please try again.');
    }
});
