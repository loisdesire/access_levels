// document.getElementById('registerForm').addEventListener('submit', function (e) {
//     e.preventDefault(); // Prevents the form from submitting normally

//     // Get form values
//     const firstName = document.getElementById('fname').value;
//     const lastName = document.getElementById('lname').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     const role = document.getElementById('role').value;

//     // Create a user object
//     const user = {
//         firstName,
//         lastName,
//         email,
//         password,
//         role,
//     };

//     // Check if user already exists
//     let users = JSON.parse(localStorage.getItem('users')) || [];
//     const userExists = users.some(u => u.email === email);

//     if (userExists) {
//         alert('User already exists! Please log in.');
//     } else {
//         // Add the new user to the users array
//         users.push(user);
//         localStorage.setItem('users', JSON.stringify(users)); // Store updated user data
//         alert('Account created successfully! You can now log in.');
//         window.location.href = '/auth/login/login.html'; // Redirect to login page
//     }
// });

document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting normally

    // Get form values
    const firstName = document.getElementById('fname').value;
    const lastName = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value; // Role selector

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

        // Now update dashboard data dynamically
        let dashboardData = JSON.parse(localStorage.getItem('dashboardData')) || {
            admins: 0,
            students: 0,
            staffs: 0
        };

        // Increment the relevant count based on the user's role
        if (role === 'admin') {
            dashboardData.admins += 1;
        } else if (role === 'student') {
            dashboardData.students += 1;
        } else if (role === 'staff') {
            dashboardData.staffs += 1;
        }

        // Save the updated dashboard data to localStorage
        localStorage.setItem('dashboardData', JSON.stringify(dashboardData));

        alert('Account created successfully! You can now log in.');
        window.location.href = '/auth/login/login.html'; // Redirect to login page
    }
});
