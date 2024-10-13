// Login script
document.querySelector('.login-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    // Get the input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Retrieve users from Local Storage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the user exists and the password matches
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert('Login successful!');
        // You can add code here to redirect to a dashboard or main page
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
    }
});


// document.getElementById('loginForm').addEventListener('submit', function (e) {
//     e.preventDefault(); // Prevents the form from submitting normally

//     // Get form values
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     // const role = document.getElementById('role').value;

//     // Check if user exists and password is correct
//     let users = JSON.parse(localStorage.getItem('users')) || [];
//     const user = users.find(u => u.email === email && u.password === password);

//     if (user) {
//         alert('Login successful!');
//         // You can add code here to redirect to a dashboard or main page
//         switch (user.role) {
//             case 'admin':
//                 window.location.href = '/dashboard/admin.html';
//                 break;
//             case 'staff':
//                 window.location.href = '/dashboard/staff.html';
//                 break;
//             case 'student':
//                 window.location.href = '/dashboard/student.html';
//                 break;
//             default:
//                 alert('Invalid role. Please contact the administrator.');
//         }

//     } else {
//         alert('Invalid email, password, or role. Please try again.');
//     }
// });


// /*In nav, display username and role. Protect the route*/