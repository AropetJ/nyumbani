let signupForm = document.querySelector(".my-form");
let email = document.getElementById("email");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirm-password");

async function registerUser(email, password) {
    try {
        const response = await fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            // Handle registration failure
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to register');
        }

        // Registration successful
        // Optionally, you can handle the response here if needed
        const responseData = await response.json();
        console.log('User registered successfully:', responseData);

        // Redirect to login page or perform any other action upon successful registration
        window.location.href = 'http://localhost:5500/login';
    } catch (error) {
        // Handle error
        console.error('Registration failed:', error.message);
        // Display error message to the user (e.g., in a toast or alert)
    }
}

signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    registerUser(email.value, password.value);
});

function onChange() {
  if (confirmPassword.value === password.value) {
    confirmPassword.setCustomValidity("");
  } else {
    confirmPassword.setCustomValidity("Passwords do not match!");
  }
}

password.addEventListener("change", onChange);
confirmPassword.addEventListener("change", onChange);
