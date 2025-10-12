import React, { useEffect, useState } from 'react';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/news');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setPageReady(true), 100);
    }
  };

  if (loading) {
    return (
      <div className="loading fade-in">
        <div className="spinner"></div>
        Chargement des actualités...
      </div>
    );
  }

  return (
    <div className={`page-container ${pageReady ? 'fade-in' : ''}`}>
      <div
        className="hero"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero-news.png)` }}
      >
        <div className={`hero-content ${pageReady ? 'slide-up' : ''}`}>
          <h1>Actualités</h1>
          <p>Restez informés des dernières nouvelles et annonces de l'ADEI</p>
        </div>
      </div>

      <div className={`content ${pageReady ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
        {articles && articles.length > 0 ? (
          <div className="card-grid">
            {articles.map((article, index) => (
              <article
                key={article._id}
                className={`card ${pageReady ? 'slide-up' : ''}`}
                style={{ animationDelay: pageReady ? `${0.4 + index * 0.1}s` : '0s' }}
              >
                <h2 className="mt-0">{article.title}</h2>
                <small className="text-muted">{article.date}</small>
                <p>{article.content}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="card text-center">
            <h3>Aucune actualité disponible</h3>
            <p>Les actualités apparaîtront ici dès qu'elles seront publiées.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
