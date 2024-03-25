const loginForm = document.getElementById('loginForm');
let email = document.getElementById("email");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirm-password");
let newPassword = document.getElementById("passwordReset");

async function loginUser(email, password) {
    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            // Handle login failure
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to login');
        }

        // Extract JWT token from response
        const { token } = await response.json();

        // Store token in local storage
        localStorage.setItem('token', token);

        // Redirect to dashboard or perform any other action upon successful login
        window.location.href = 'http://127.0.0.1:5500/client/dashboard/home.html';
    } catch (error) {
        // console.log(error);
    }
}

async function requestPasswordReset(email) {
    try {
        const response = await fetch('/api/reset-password-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            // Handle error response
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to request password reset');
        }

        // Password reset request successful
        // Optionally handle the response here if needed
        const responseData = await response.json();
        console.log('Password reset request successful:', responseData);

        // Redirect to a confirmation page or display a success message to the user
        // For example:
        // window.location.href = '/password-reset-success';
    } catch (error) {
        // Handle error
        console.error('Password reset request failed:', error.message);
        // Display error message to the user (e.g., in a toast or alert)
    }
}



loginForm.addEventListener("click", async (event) => {
    event.preventDefault();
    
    try {
      loginUser(email.value, password.value);
    } catch (error) {
      console.error('Login failed:', error.message);
    }
});

newPassword.addEventListener("click", (event) => {
  event.preventDefault();
  loginUser(email.value, password.value);
});
