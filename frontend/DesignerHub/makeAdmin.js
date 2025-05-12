// This script will make the currently logged in user an admin
// Run it in your browser console when logged in

function makeCurrentUserAdmin() {
  // Get current user info
  const userInfoStr = localStorage.getItem('userInfo');
  
  if (!userInfoStr) {
    console.error('No user is logged in. Please login first.');
    return;
  }
  
  try {
    // Parse the user info
    const userInfo = JSON.parse(userInfoStr);
    
    // Add admin flag
    userInfo.isAdmin = true;
    
    // Save back to localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    console.log('Success! User is now an admin. Refresh the page to see changes.');
    console.log('Admin user:', userInfo);
    
    // Suggest refresh
    if (confirm('User updated to admin. Refresh page now?')) {
      window.location.reload();
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

// Execute the function
makeCurrentUserAdmin(); 