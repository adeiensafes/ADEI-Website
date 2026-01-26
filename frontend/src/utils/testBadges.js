// Test function to check badge API
export const testBadgeAPI = async (token) => {
  console.log('=== TESTING BADGE API ===');
  
  try {
    // Test 1: Get current user profile
    console.log('1. Testing /api/users/me endpoint...');
    const profileResponse = await fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (profileResponse.ok) {
      const profile = await profileResponse.json();
      console.log('✅ Profile endpoint works:', profile);
      console.log('Badge fields present:', {
        is_president: profile.hasOwnProperty('is_president'),
        is_representant: profile.hasOwnProperty('is_representant'),
        is_membre_adei: profile.hasOwnProperty('is_membre_adei'),
        is_bureau_adei: profile.hasOwnProperty('is_bureau_adei')
      });
    } else {
      console.log('❌ Profile endpoint failed:', profileResponse.status);
    }

    // Test 2: Get all users (admin only)
    console.log('2. Testing /api/users endpoint...');
    const usersResponse = await fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (usersResponse.ok) {
      const users = await usersResponse.json();
      console.log('✅ Users endpoint works, count:', users.length);
      if (users.length > 0) {
        console.log('First user badge fields:', {
          is_president: users[0].hasOwnProperty('is_president'),
          is_representant: users[0].hasOwnProperty('is_representant'),
          is_membre_adei: users[0].hasOwnProperty('is_membre_adei'),
          is_bureau_adei: users[0].hasOwnProperty('is_bureau_adei')
        });
      }
    } else {
      console.log('❌ Users endpoint failed:', usersResponse.status);
    }

    // Test 3: Test badge update (if user ID provided)
    const testUserId = prompt('Enter a user ID to test badge update (or cancel):');
    if (testUserId) {
      console.log('3. Testing badge update...');
      const updateResponse = await fetch(`/api/users/${testUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          is_president: true,
          is_representant: false,
          is_membre_adei: true,
          is_bureau_adei: false
        })
      });
      
      if (updateResponse.ok) {
        const updatedUser = await updateResponse.json();
        console.log('✅ Badge update works:', updatedUser);
      } else {
        console.log('❌ Badge update failed:', updateResponse.status);
        const error = await updateResponse.text();
        console.log('Error details:', error);
      }
    }

  } catch (error) {
    console.error('❌ API test error:', error);
  }
};

// Add to window for easy testing in browser console
if (typeof window !== 'undefined') {
  window.testBadgeAPI = testBadgeAPI;
}