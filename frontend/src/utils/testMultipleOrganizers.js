// Test file to demonstrate multiple organizers functionality
import { getOrganizerName } from './helpers';

// Sample clubs data
const sampleClubs = [
  { id: 1, club: 'Club Informatique' },
  { id: 2, club: 'Club Robotique' },
  { id: 3, club: 'Club Entrepreneuriat' }
];

// Test cases for multiple organizers
const testCases = [
  {
    name: 'Single ADEI organizer',
    event: {
      title: 'Conférence Tech',
      clubIds: ['adei']
    },
    expected: 'ADEI'
  },
  {
    name: 'Single ENSA organizer',
    event: {
      title: 'Journée Portes Ouvertes',
      clubIds: ['ensa']
    },
    expected: 'Administration ENSA Fès'
  },
  {
    name: 'Single club organizer',
    event: {
      title: 'Workshop IA',
      clubIds: ['1']
    },
    expected: 'Club Informatique'
  },
  {
    name: 'Two organizers (ADEI + Club)',
    event: {
      title: 'Hackathon',
      clubIds: ['adei', '1']
    },
    expected: 'ADEI & Club Informatique'
  },
  {
    name: 'Two club organizers',
    event: {
      title: 'Compétition Robotique',
      clubIds: ['1', '2']
    },
    expected: 'Club Informatique & Club Robotique'
  },
  {
    name: 'Three organizers',
    event: {
      title: 'Forum Entreprises',
      clubIds: ['adei', '1', '3']
    },
    expected: 'ADEI, Club Informatique & Club Entrepreneuriat'
  },
  {
    name: 'Four organizers',
    event: {
      title: 'Semaine Innovation',
      clubIds: ['adei', '1', '2', '3']
    },
    expected: 'ADEI, Club Informatique, Club Robotique & Club Entrepreneuriat'
  },
  {
    name: 'Legacy single organizer (backward compatibility)',
    event: {
      title: 'Ancien événement',
      organizer: 'Club Legacy'
    },
    expected: 'Club Legacy'
  }
];

// Run tests
export const runMultipleOrganizersTests = () => {
  console.log('🧪 Testing Multiple Organizers Functionality');
  console.log('='.repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((testCase, index) => {
    const result = getOrganizerName(testCase.event, sampleClubs);
    const success = result === testCase.expected;
    
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`  Event: ${testCase.event.title}`);
    console.log(`  ClubIds: ${JSON.stringify(testCase.event.clubIds || 'none')}`);
    console.log(`  Expected: "${testCase.expected}"`);
    console.log(`  Got: "${result}"`);
    console.log(`  Status: ${success ? '✅ PASS' : '❌ FAIL'}`);
    console.log('');
    
    if (success) {
      passed++;
    } else {
      failed++;
    }
  });
  
  console.log('='.repeat(50));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  console.log(`Success Rate: ${Math.round((passed / testCases.length) * 100)}%`);
  
  return { passed, failed, total: testCases.length };
};

// Example usage in browser console:
// import { runMultipleOrganizersTests } from './utils/testMultipleOrganizers';
// runMultipleOrganizersTests();