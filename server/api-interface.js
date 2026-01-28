// Interface web pour l'API avec thème noir et rouge
const getApiInterface = (PORT) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API ADEI ENSA Fès</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            min-height: 100vh;
            padding: 20px;
            color: #ffffff;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #000000;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            overflow: hidden;
            border: 1px solid #333;
        }
        
        .header {
            background: linear-gradient(135deg, #000000 0%, #dc2626 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 300;
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .status {
            background: #dc2626;
            color: white;
            padding: 15px;
            text-align: center;
            font-weight: bold;
            font-size: 1.1rem;
        }
        
        .content {
            padding: 40px;
            background: #111111;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section h2 {
            color: #ffffff;
            margin-bottom: 20px;
            font-size: 1.8rem;
            border-bottom: 3px solid #dc2626;
            padding-bottom: 10px;
        }
        
        .endpoints {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .endpoint {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 10px;
            padding: 20px;
            transition: all 0.3s ease;
        }
        
        .endpoint:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(220, 38, 38, 0.2);
            border-color: #dc2626;
        }
        
        .endpoint-method {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .get { background: #16a34a; color: white; }
        .post { background: #dc2626; color: white; }
        .put { background: #ea580c; color: white; }
        .delete { background: #b91c1c; color: white; }
        
        .endpoint-url {
            font-family: 'Courier New', monospace;
            background: #000000;
            color: #dc2626;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
            word-break: break-all;
            border: 1px solid #333;
        }
        
        .endpoint-desc {
            color: #cccccc;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        
        .test-btn {
            background: #dc2626;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
            margin-top: 10px;
            transition: background 0.3s ease;
        }
        
        .test-btn:hover {
            background: #b91c1c;
        }
        
        .protected-btn {
            background: #666666;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: not-allowed;
            font-size: 0.9rem;
            margin-top: 10px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .info-card {
            background: #1a1a1a;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            border: 1px solid #333;
        }
        
        .info-card h3 {
            color: #dc2626;
            margin-bottom: 10px;
        }
        
        .info-card p {
            color: #cccccc;
        }
        
        .footer {
            background: #000000;
            color: #cccccc;
            text-align: center;
            padding: 20px;
            margin-top: 40px;
            border-top: 1px solid #333;
        }
        
        .footer a {
            color: #dc2626;
            text-decoration: none;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 768px) {
            .header h1 { font-size: 2rem; }
            .header p { font-size: 1rem; }
            .content { padding: 20px; }
            .endpoints { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>API ADEI ENSA Fès</h1>
            <p>Interface de programmation pour l'Association des Étudiants Ingénieurs</p>
        </div>
        
        <div class="status">
            API Opérationnelle - Version 1.0.0 - ${new Date().toLocaleString('fr-FR')}
        </div>
        
        <div class="content">
            <div class="section">
                <h2>Informations Générales</h2>
                <div class="info-grid">
                    <div class="info-card">
                        <h3>École</h3>
                        <p>ENSA Fès</p>
                    </div>
                    <div class="info-card">
                        <h3>Association</h3>
                        <p>ADEI</p>
                    </div>
                    <div class="info-card">
                        <h3>Environnement</h3>
                        <p>Production</p>
                    </div>
                    <div class="info-card">
                        <h3>Port</h3>
                        <p>${PORT}</p>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>Endpoints Publics</h2>
                <div class="endpoints">
                    <div class="endpoint">
                        <span class="endpoint-method get">GET</span>
                        <div class="endpoint-url">/api/news</div>
                        <div class="endpoint-desc">Récupère toutes les actualités publiées</div>
                        <button class="test-btn" onclick="testEndpoint('/api/news')">Tester</button>
                    </div>
                    
                    <div class="endpoint">
                        <span class="endpoint-method get">GET</span>
                        <div class="endpoint-url">/api/events</div>
                        <div class="endpoint-desc">Récupère tous les événements à venir</div>
                        <button class="test-btn" onclick="testEndpoint('/api/events')">Tester</button>
                    </div>
                    
                    <div class="endpoint">
                        <span class="endpoint-method get">GET</span>
                        <div class="endpoint-url">/api/clubs</div>
                        <div class="endpoint-desc">Liste de tous les clubs étudiants</div>
                        <button class="test-btn" onclick="testEndpoint('/api/clubs')">Tester</button>
                    </div>
                    
                    <div class="endpoint">
                        <span class="endpoint-method get">GET</span>
                        <div class="endpoint-url">/api/filieres</div>
                        <div class="endpoint-desc">Informations sur les filières disponibles</div>
                        <button class="test-btn" onclick="testEndpoint('/api/filieres')">Tester</button>
                    </div>
                    
                    <div class="endpoint">
                        <span class="endpoint-method get">GET</span>
                        <div class="endpoint-url">/api/feedbacks/public</div>
                        <div class="endpoint-desc">Feedbacks publics de la communauté</div>
                        <button class="test-btn" onclick="testEndpoint('/api/feedbacks/public')">Tester</button>
                    </div>
                    
                    <div class="endpoint">
                        <span class="endpoint-method get">GET</span>
                        <div class="endpoint-url">/api/adei-members</div>
                        <div class="endpoint-desc">Membres du bureau ADEI</div>
                        <button class="test-btn" onclick="testEndpoint('/api/adei-members')">Tester</button>
                    </div>
                    
                    <div class="endpoint">
                        <span class="endpoint-method get">GET</span>
                        <div class="endpoint-url">/api/academic/cycles</div>
                        <div class="endpoint-desc">Structure académique complète (cycles, filières, années)</div>
                        <button class="test-btn" onclick="testEndpoint('/api/academic/cycles')">Tester</button>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>Endpoints Authentifiés</h2>
                <div class="endpoints">
                    <div class="endpoint">
                        <span class="endpoint-method post">POST</span>
                        <div class="endpoint-url">/api/login</div>
                        <div class="endpoint-desc">Authentification utilisateur</div>
                        <button class="test-btn" onclick="showLoginForm()">Tester</button>
                    </div>
                    
                    <div class="endpoint">
                        <span class="endpoint-method post">POST</span>
                        <div class="endpoint-url">/api/feedbacks</div>
                        <div class="endpoint-desc">Soumettre un nouveau feedback (authentification requise)</div>
                        <button class="protected-btn" onclick="alert('Authentification requise')">Protégé</button>
                    </div>
                    
                    <div class="endpoint">
                        <span class="endpoint-method get">GET</span>
                        <div class="endpoint-url">/api/users/me</div>
                        <div class="endpoint-desc">Profil utilisateur connecté</div>
                        <button class="protected-btn" onclick="alert('Authentification requise')">Protégé</button>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>Endpoints de Test</h2>
                <div class="endpoints">
                    <div class="endpoint">
                        <span class="endpoint-method get">GET</span>
                        <div class="endpoint-url">/health</div>
                        <div class="endpoint-desc">Vérification de l'état de santé de l'API</div>
                        <button class="test-btn" onclick="testEndpoint('/health')">Tester</button>
                    </div>
                    
                    <div class="endpoint">
                        <span class="endpoint-method get">GET</span>
                        <div class="endpoint-url">/api/test</div>
                        <div class="endpoint-desc">Test général des routes API</div>
                        <button class="test-btn" onclick="testEndpoint('/api/test')">Tester</button>
                    </div>
                    
                    <div class="endpoint">
                        <span class="endpoint-method get">GET</span>
                        <div class="endpoint-url">/api/feedbacks/test</div>
                        <div class="endpoint-desc">Test spécifique des feedbacks</div>
                        <button class="test-btn" onclick="testEndpoint('/api/feedbacks/test')">Tester</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2026 ADEI ENSA Fès - API développée avec passion pour la communauté étudiante</p>
            <p><a href="https://adei-ensaf.ma">Site Web</a> | Contact: adei_ensa@gmail.com</p>
        </div>
    </div>
    
    <script>
        function testEndpoint(endpoint) {
            const url = window.location.origin + endpoint;
            window.open(url, '_blank');
        }
        
        function showLoginForm() {
            const loginData = {
                email: "admin@example.com",
                password: "password"
            };
            
            const message = \`Pour tester l'endpoint de login, utilisez une requête POST avec:\\n\\n\` +
                           \`URL: \${window.location.origin}/api/login\\n\` +
                           \`Method: POST\\n\` +
                           \`Content-Type: application/json\\n\\n\` +
                           \`Body:\\n\${JSON.stringify(loginData, null, 2)}\`;
            
            alert(message);
        }
        
        // Animation d'entrée
        document.addEventListener('DOMContentLoaded', function() {
            const endpoints = document.querySelectorAll('.endpoint');
            endpoints.forEach((endpoint, index) => {
                endpoint.style.opacity = '0';
                endpoint.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    endpoint.style.transition = 'all 0.5s ease';
                    endpoint.style.opacity = '1';
                    endpoint.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    </script>
</body>
</html>
  `;
};

module.exports = { getApiInterface };