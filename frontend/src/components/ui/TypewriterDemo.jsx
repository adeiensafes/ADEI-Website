import Typewriter from "./Typewriter";

const TypewriterDemo = () => {
  const words = [
    "Bienvenue à l'ADEI", 
    "Créez des effets magnifiques", 
    "Avec React et CSS", 
    "Tapez votre message!"
  ];

  return (
    <main style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '50vh' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 5vw, 3rem)', 
          fontWeight: 'bold', 
          marginBottom: '2rem',
          color: 'var(--text-primary)'
        }}>
          <Typewriter 
            words={words} 
            speed={80} 
            delayBetweenWords={2000} 
            cursor={true} 
            cursorChar="|" 
          />
        </h1>
      </div>
    </main>
  );
};

export default TypewriterDemo;