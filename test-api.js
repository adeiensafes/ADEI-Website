// Script pour tester tous les endpoints API
const https = require('https');

const API_BASE = 'https://api.adei-ensaf.ma';

const endpoints = [
  { name: 'Health Check', path: '/health', method: 'GET' },
  { name: 'Test Endpoint', path: '/api/test', method: 'GET' },
  { name: 'Clubs', path: '/api/clubs', method: 'GET' },
  { name: 'Events', path: '/api/events', method: 'GET' },
  { name: 'News', path: '/api/news', method: 'GET' },
  { name: 'Filières', path: '/api/filieres', method: 'GET' },
  { name: 'ADEI Members', path: '/api/adei-members', method: 'GET' }
];

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `${API_BASE}${endpoint.path}`;
    
    const options = {
      method: endpoint.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'fr-FR,fr;q=0.9',
        'Referer': 'https://adei-ensaf.ma/'
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const count = Array.isArray(json) ? json.length : 'N/A';
          resolve({
            name: endpoint.name,
            status: res.statusCode,
            success: res.statusCode === 200,
            count: count,
            sample: Array.isArray(json) && json.length > 0 ? json[0] : json,
            fullData: json
          });
        } catch (e) {
          resolve({
            name: endpoint.name,
            status: res.statusCode,
            success: false,
            error: 'Invalid JSON',
            preview: data.substring(0, 200)
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        name: endpoint.name,
        status: 'ERROR',
        success: false,
        error: error.message
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        name: endpoint.name,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Test des APIs - https://api.adei-ensaf.ma\n');
  console.log('='.repeat(80));
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    
    const icon = result.success ? '✅' : '❌';
    console.log(`\n${icon} ${result.name}`);
    console.log(`   URL: ${API_BASE}${endpoints.find(e => e.name === result.name).path}`);
    console.log(`   Status: ${result.status}`);
    
    if (result.success) {
      if (result.count !== 'N/A') {
        console.log(`   Count: ${result.count} items`);
      }
      if (result.sample) {
        const keys = Object.keys(result.sample);
        console.log(`   Sample keys: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}`);
      }
      // Show full data for debugging
      console.log(`   Data: ${JSON.stringify(result.fullData).substring(0, 150)}...`);
    } else {
      console.log(`   Error: ${result.error || 'Failed'}`);
      if (result.preview) {
        console.log(`   Preview: ${result.preview}...`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✨ Tests terminés!\n');
}

runTests();
