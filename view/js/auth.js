// auth.js
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                // Store isAdmin flag
                localStorage.setItem('isAdmin', data.isAdmin);
                alert('Login successful');
                if (data.isAdmin) {
                  console.log(`admin log in`);

                    window.location.href = 'admin.html'; // Redirect to the admin page
                } else {
                  console.log(`user log in`)
                    window.location.href = 'index.html'; // Redirect to the home page
                }
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
}

  if (registerForm) {
      registerForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const username = document.getElementById('username').value;
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const confirmPassword = document.getElementById('confirmPassword').value;

          if (password !== confirmPassword) {
              alert('Passwords do not match');
              return;
          }

          fetch('http://localhost:3000/users/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, email, password })
          })
          .then(response => response.json())
          .then(data => {
              alert(data.message);
                  window.location.href = 'login.html';

          })
          .catch(error => console.error('Error:', error));
      });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const authLinks = document.getElementById('authLinks');
  
  if (localStorage.getItem('token')) {
      authLinks.innerHTML = '<a href="#" onclick="logout()">Logout</a>';
  } else {
      authLinks.innerHTML = '<a href="login.html">Login</a> | <a href="register.html">Sign Up</a>';
  }
});

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'navi.html';
}
