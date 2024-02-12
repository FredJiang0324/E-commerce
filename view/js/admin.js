document.addEventListener('DOMContentLoaded', () => {
    fetchUsersAndFavorites();
  });
  
  function fetchUsersAndFavorites() {
    const token = localStorage.getItem('token'); 
  
    fetch('http://localhost:3000/users/admin', { 
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    })
    .then(displayUsersWithFavorites)
    .catch(error => console.error('Error:', error));
  }
  
  function displayUsersWithFavorites(users) {
    const usersContainer = document.getElementById('usersList'); 
    usersContainer.innerHTML = ''; 
  
    users.forEach(user => {
      const userElement = document.createElement('div');
      userElement.className = 'user';
      userElement.innerHTML = `
        <h3 style="color:blue">${user.username} (${user.email})</h3>
        <h4>Favorites:</h4>
        <ul>
          ${user.favorites.map(fav => `<li>${fav.name}</li>`).join('')}
        </ul>
      `;
  
      usersContainer.appendChild(userElement);
    });
  }
  