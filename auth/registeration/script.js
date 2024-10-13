document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevents the form from submitting normally

    // Get form values
    const firstName = document.getElementById('fname').value;
    const lastName = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Create a user object
    const user = {
        firstName,
        lastName,
        email,
        password,
        role,
    };

    // Check if user already exists
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(u => u.email === email);

    if (userExists) {
        alert('User already exists! Please log in.');
    } else {
        // Add the new user to the users array
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users)); // Store updated user data
        alert('Account created successfully! You can now log in.');
        window.location.href = '/auth/login/login.html'; // Redirect to login page
    }
});