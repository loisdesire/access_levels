// script.js

document.addEventListener('DOMContentLoaded', () => {
  // Sidebar and toggle button
  const sidebar = document.getElementById('sidebar');
  const toggleSidebarBtn = document.getElementById('toggleSidebar');


  // Check for the logout button in a polling manner
  const checkLogoutButton = () => {
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
          logoutBtn.addEventListener('click', function (e) {
              e.preventDefault(); // Prevent the default anchor behavior
              localStorage.removeItem('loggedInUser'); // Clear user data from Local Storage
              alert('You have been logged out.'); // Alert the user
              window.location.href = '/auth/login/login.html'; // Redirect to login page
          });
      } else {
          console.error('Logout button not found in the DOM, retrying...');
          setTimeout(checkLogoutButton, 100); // Retry after 100ms
      }
  };

  // Start checking for the logout button
  checkLogoutButton();

});
