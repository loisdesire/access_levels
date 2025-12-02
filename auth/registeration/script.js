// Password strength validation
function validatePasswordStrength(password) {
    const requirements = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password)
    };
    
    const allMet = Object.values(requirements).every(req => req);
    return { requirements, allMet };
}

// Real-time password strength feedback
const passwordInput = document.getElementById('password');
const strengthDiv = document.getElementById('passwordStrength');

passwordInput.addEventListener('input', function() {
    const password = this.value;
    
    if (password.length === 0) {
        strengthDiv.style.display = 'none';
        return;
    }
    
    strengthDiv.style.display = 'block';
    const { requirements, allMet } = validatePasswordStrength(password);
    
    // Update requirement checks
    document.getElementById('req-length').style.color = requirements.length ? '#388e3c' : '#d32f2f';
    document.getElementById('req-length').innerHTML = requirements.length ? '✓ At least 8 characters' : '✗ At least 8 characters';
    
    document.getElementById('req-upper').style.color = requirements.upper ? '#388e3c' : '#d32f2f';
    document.getElementById('req-upper').innerHTML = requirements.upper ? '✓ One uppercase letter' : '✗ One uppercase letter';
    
    document.getElementById('req-lower').style.color = requirements.lower ? '#388e3c' : '#d32f2f';
    document.getElementById('req-lower').innerHTML = requirements.lower ? '✓ One lowercase letter' : '✗ One lowercase letter';
    
    document.getElementById('req-number').style.color = requirements.number ? '#388e3c' : '#d32f2f';
    document.getElementById('req-number').innerHTML = requirements.number ? '✓ One number' : '✗ One number';
    
    // Update strength text
    const strengthText = document.getElementById('strengthText');
    if (allMet) {
        strengthText.textContent = 'Strong password ✓';
        strengthText.style.color = '#388e3c';
    } else {
        const metCount = Object.values(requirements).filter(r => r).length;
        if (metCount <= 1) {
            strengthText.textContent = 'Weak password';
            strengthText.style.color = '#d32f2f';
        } else if (metCount <= 2) {
            strengthText.textContent = 'Fair password';
            strengthText.style.color = '#f57c00';
        } else {
            strengthText.textContent = 'Good password';
            strengthText.style.color = '#fbc02d';
        }
    }
});

document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the form from submitting normally

    // Get form values and trim whitespace
    const firstName = document.getElementById('fname').value.trim();
    const lastName = document.getElementById('lname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value; // Role selector

    // Validate inputs
    if (!firstName || !lastName || !email || !password) {
        await customAlert('Please fill in all fields.', 'Missing Information');
        return;
    }
    
    // Validate password strength
    const { allMet } = validatePasswordStrength(password);
    if (!allMet) {
        await customAlert('Password does not meet requirements. Please ensure it has:\n- At least 8 characters\n- One uppercase letter\n- One lowercase letter\n- One number', 'Weak Password');
        return;
    }

    // Create a user object with timestamp
    const user = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        password,
        role,
        status: 'active',
        createdAt: new Date().toISOString(),
        createdBy: 'self-registration'
    };

    // Check if user already exists
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(u => u.email.trim() === email);

    if (userExists) {
        await customAlert('User already exists! Please log in.', 'Account Exists');
    } else {
        // Add the new user to the users array
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users)); // Store updated user data

        console.log('User registered:', user);
        console.log('All users:', users);

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

        await customAlert('Account created successfully! You can now log in.\n\nEmail: ' + email, 'Registration Successful');
        window.location.href = '../login/login.html'; // Redirect to login page
    }
});
