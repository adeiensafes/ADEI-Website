// Helper functions for the ADEI website

export const getCategoryLabel = (category) => {
  const categoryLabels = {
    'academic': 'Académique',
    'sportif': 'Sportif',
    'show': 'Show',
    'party': 'Party',
    'formation': 'Formation',
    'conference': 'Conférence',
    'autre': 'Autre'
  };
  return categoryLabels[category] || category;
};

export const getOrganizerName = (item) => {
  if (item.club?.club) {
    return item.club.club;
  }
  if (item.organizer) {
    return item.organizer;
  }
  if (item.clubId === 'adei') {
    return 'ADEI';
  }
  if (item.clubId === 'ensa') {
    return 'Administration ENSA Fès';
  }
  return 'ADEI';
};

export const getOrganizerLink = (item) => {
  if (item.club?.club) {
    return `/clubs#${item.club.id}`;
  }
  if (item.organizer === 'Administration ENSA Fès' || item.clubId === 'ensa') {
    return '/ensa';
  }
  return '/adei';
};

export const handleOrganizerClick = (item) => {
  const link = getOrganizerLink(item);
  if (link.startsWith('/clubs#')) {
    // For clubs, navigate to clubs page with specific club ID
    window.location.href = link;
  } else {
    // For ADEI and ENSA, navigate directly
    window.location.href = link;
  }
};

export const CATEGORY_OPTIONS = [
  { value: '', label: 'Sélectionner une catégorie' },
  { value: 'academic', label: 'Académique' },
  { value: 'sportif', label: 'Sportif' },
  { value: 'show', label: 'Show' },
  { value: 'party', label: 'Party' },
  { value: 'formation', label: 'Formation' },
  { value: 'conference', label: 'Conférence' },
  { value: 'autre', label: 'Autre' }
];