// Test welcome email by creating a new user
import fetch from 'node-fetch';

const testWelcomeEmail = async () => {
  try {
    const testUser = {
      email: `test${Date.now()}@eximpoglobal.net`,
      password: 'Test@123',
      fullName: 'Test User Email',
      companyName: 'Test Company Email',
      country: '1',
      phone: '+1234567890',
      role: 'buyer'
    };

    console.log('🧪 Testing welcome email...');
    console.log('📧 Test email will be sent to:', testUser.email);
    console.log('');

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ User created successfully!');
      console.log('📧 Email:', testUser.email);
      console.log('🔑 Password:', testUser.password);
      console.log('');
      console.log('📊 Check Bull Dashboard: http://localhost:5000/api/admin/queues');
      console.log('📧 Check if welcome email was queued and sent');
      console.log('');
      console.log('User ID:', data.user?.id);
    } else {
      console.error('❌ Failed to create user:', data.message || data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testWelcomeEmail();
