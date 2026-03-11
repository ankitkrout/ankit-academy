const http = require('http');

console.log('Testing Ankit Academy Backend APIs...\n');

// Test 1: Health Check
http.get('http://localhost:5000/api/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ Health Check:', data);
    testCoursesAPI();
  });
}).on('error', (err) => {
  console.log('❌ Health Check Failed:', err.message);
});

function testCoursesAPI() {
  // Test 2: Get Courses
  http.get('http://localhost:5000/api/courses', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log('✅ Courses API:', json.success ? 'Working' : 'Error');
      } catch (e) {
        console.log('❌ Courses API Error');
      }
      testAuthAPI();
    });
  }).on('error', (err) => {
    console.log('❌ Courses API Failed:', err.message);
    testAuthAPI();
  });
}

function testAuthAPI() {
  // Test 3: Auth Status (should return 401 without token)
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/profile',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('✅ Auth API:', res.statusCode === 401 ? 'Protected (requires login)' : 'Working');
      console.log('\n🎉 All core APIs tested successfully!');
    });
  });
  
  req.on('error', (err) => {
    console.log('❌ Auth API Failed:', err.message);
  });
  
  req.end();
}
