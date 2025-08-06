// Frontend Geolocation Blocking Test
// Run this in browser console to test different locations

function testGeoLocation(lat, lng, description) {
  console.log(`\n🧪 Testing: ${description}`);
  console.log(`Coordinates: ${lat}, ${lng}`);
  
  // Mock the geolocation API
  navigator.geolocation.getCurrentPosition = (success) => {
    success({
      coords: {
        latitude: lat,
        longitude: lng
      }
    });
  };
  
  // Trigger location check by reloading or re-initializing
  window.location.reload();
}

// Test cases
const testCases = [
  {
    lat: 23.0225,
    lng: 72.5714,
    desc: 'Gujarat, India (Blocked)'
  },
  {
    lat: 42.3314,
    lng: -83.0458,
    desc: 'Michigan, US (Blocked)'
  },
  {
    lat: 19.4326,
    lng: -99.1332,
    desc: 'Mexico City, Mexico (Blocked)'
  },
  {
    lat: 37.7749,
    lng: -122.4194,
    desc: 'San Francisco, California (Allowed)'
  }
];

// Run all tests
testCases.forEach(test => {
  testGeoLocation(test.lat, test.lng, test.desc);
});

console.log('\n📋 Test Instructions:');
console.log('1. Open browser console (F12)');
console.log('2. Copy and paste this entire script');
console.log('3. Check if blocking popup appears for blocked regions');
console.log('4. Verify login/signup is prevented for blocked regions'); 