// Guide pour adapter le frontend aux nouvelles réponses d'API
// Les réponses d'API ont maintenant une structure standardisée

/*
ANCIEN FORMAT (direct):
[
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" }
]

NOUVEAU FORMAT (avec wrapper):
{
  success: true,
  data: [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" }
  ],
  count: 2
}

EN CAS D'ERREUR:
{
  success: false,
  message: "Message d'erreur convivial",
  code: "ERROR_CODE"
}
*/

// EXEMPLE DE MODIFICATION DANS LE FRONTEND:

// AVANT:
/*
fetch('/api/feedbacks/public')
  .then(response => response.json())
  .then(feedbacks => {
    setFeedbacks(feedbacks);
  })
  .catch(error => {
    console.error('Erreur:', error);
    setError('Erreur de chargement');
  });
*/

// APRÈS:
/*
fetch('/api/feedbacks/public')
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      setFeedbacks(result.data);
    } else {
      setError(result.message);
    }
  })
  .catch(error => {
    console.error('Erreur réseau:', error);
    setError('Problème de connexion. Veuillez réessayer.');
  });
*/

// FONCTION UTILITAIRE POUR LE FRONTEND:
/*
const apiCall = async (url) => {
  try {
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.message };
    }
  } catch (error) {
    return { 
      success: false, 
      error: 'Problème de connexion. Veuillez réessayer.' 
    };
  }
};

// Utilisation:
const { success, data, error } = await apiCall('/api/feedbacks/public');
if (success) {
  setFeedbacks(data);
} else {
  setError(error);
}
*/