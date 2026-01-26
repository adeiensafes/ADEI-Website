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

// Helper functions for ENSA levels and sections
export const getENSALevels = (type) => {
  if (type === 'prepa') {
    return ['CP1', 'CP2'];
  } else if (type === 'filiere') {
    return ['CI1', 'CI2', 'CI3'];
  }
  return [];
};

export const getENSALevelLabel = (level) => {
  const levelLabels = {
    'CP1': 'Classes Préparatoires 1ère année',
    'CP2': 'Classes Préparatoires 2ème année',
    'CI1': 'Cycle Ingénieur 1ère année',
    'CI2': 'Cycle Ingénieur 2ème année',
    'CI3': 'Cycle Ingénieur 3ème année'
  };
  return levelLabels[level] || level;
};

export const getPrepaResponsables = (filiere) => {
  return {
    responsablePedagogique: filiere.responsablePedagogique || 'Prof. Responsable Pédagogique'
  };
};

export const createCP1Sections = (prepaData) => {
  if (!prepaData || prepaData.length === 0) return [];
  
  const baseData = prepaData[0];
  return [
    {
      ...baseData,
      id: `${baseData.id}-A1`,
      name: `Classes Préparatoires CP1 - Section A1`,
      abbreviation: `CP1 - Section A1`,
      responsablePedagogique: baseData.responsablePedagogique || 'Prof. Responsable Pédagogique',
      delegue: baseData.delegueA1 || 'Étudiant Délégué A1',
      telDelegue: baseData.telDelegueA1 || '',
      section: 'A1',
      level: 'CP1'
    },
    {
      ...baseData,
      id: `${baseData.id}-B1`,
      name: `Classes Préparatoires CP1 - Section B1`,
      abbreviation: `CP1 - Section B1`,
      responsablePedagogique: baseData.responsablePedagogique || 'Prof. Responsable Pédagogique',
      delegue: baseData.delegueB1 || 'Étudiant Délégué B1',
      telDelegue: baseData.telDelegueB1 || '',
      section: 'B1',
      level: 'CP1'
    },
    {
      ...baseData,
      id: `${baseData.id}-C1`,
      name: `Classes Préparatoires CP1 - Section C1`,
      abbreviation: `CP1 - Section C1`,
      responsablePedagogique: baseData.responsablePedagogique || 'Prof. Responsable Pédagogique',
      delegue: baseData.delegueC1 || 'Étudiant Délégué C1',
      telDelegue: baseData.telDelegueC1 || '',
      section: 'C1',
      level: 'CP1'
    }
  ];
};

export const createCP2Sections = (prepaData) => {
  if (!prepaData || prepaData.length === 0) return [];
  
  const baseData = prepaData[0];
  return [
    {
      ...baseData,
      id: `${baseData.id}-A2`,
      name: `Classes Préparatoires CP2 - Section A2`,
      abbreviation: `CP2 - Section A2`,
      responsablePedagogique: baseData.responsablePedagogique || 'Prof. Responsable Pédagogique',
      delegue: baseData.delegueA2 || 'Étudiant Délégué A2',
      telDelegue: baseData.telDelegueA2 || '',
      section: 'A2',
      level: 'CP2'
    },
    {
      ...baseData,
      id: `${baseData.id}-B2`,
      name: `Classes Préparatoires CP2 - Section B2`,
      abbreviation: `CP2 - Section B2`,
      responsablePedagogique: baseData.responsablePedagogique || 'Prof. Responsable Pédagogique',
      delegue: baseData.delegueB2 || 'Étudiant Délégué B2',
      telDelegue: baseData.telDelegueB2 || '',
      section: 'B2',
      level: 'CP2'
    },
    {
      ...baseData,
      id: `${baseData.id}-C2`,
      name: `Classes Préparatoires CP2 - Section C2`,
      abbreviation: `CP2 - Section C2`,
      responsablePedagogique: baseData.responsablePedagogique || 'Prof. Responsable Pédagogique',
      delegue: baseData.delegueC2 || 'Étudiant Délégué C2',
      telDelegue: baseData.telDelegueC2 || '',
      section: 'C2',
      level: 'CP2'
    }
  ];
};

export const createFilieresByLevel = (filieres, level) => {
  const levelNumber = level.replace('ci', '');
  const filteredFilieres = [];
  
  filieres.forEach(filiere => {
    if (filiere.type === 'filiere') {
      filteredFilieres.push({
        ...filiere,
        id: `${filiere.id}-${level.toUpperCase()}`,
        name: `${filiere.name}`,
        abbreviation: `${filiere.abbreviation}${levelNumber}`,
        displayName: `${filiere.abbreviation} ${levelNumber}`,
        level: level.toUpperCase(),
        delegue: filiere.delegueFiliere || 'Étudiant Délégué',
        telDelegue: filiere.telDelegueFiliere || ''
      });
    }
  });
  
  return filteredFilieres;
};

export const ENSA_LEVEL_OPTIONS = [
  { value: '', label: 'Tous les niveaux' },
  { value: 'CP1', label: 'CP1 - Classes Préparatoires 1ère année' },
  { value: 'CP2', label: 'CP2 - Classes Préparatoires 2ème année' },
  { value: 'CI1', label: 'CI1 - Cycle Ingénieur 1ère année' },
  { value: 'CI2', label: 'CI2 - Cycle Ingénieur 2ème année' },
  { value: 'CI3', label: 'CI3 - Cycle Ingénieur 3ème année' }
];