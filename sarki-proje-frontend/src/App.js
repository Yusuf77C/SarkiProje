import React, { useState } from 'react';
import './App.css';

function App() {
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sanatçı ve şarkı adını temizle
      const cleanArtist = artist.trim();
      const cleanTitle = title.trim();

      if (!cleanArtist || !cleanTitle) {
        setError('Lütfen sanatçı ve şarkı adını girin.');
        return;
      }

      console.log('API isteği gönderiliyor...');
      const response = await fetch(`http://localhost:5189/api/lyrics/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API yanıtı alındı:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Şarkı sözleri bulunamadı. Lütfen sanatçı ve şarkı adını kontrol edin.');
        } else {
          setError(`Sunucu hatası: ${response.status}`);
        }
        setLyrics('');
        return;
      }

      const data = await response.json();
      console.log('API verisi:', data);
      
      // API yanıtını doğrudan kullan
      if (typeof data === 'string') {
        try {
          const parsedData = JSON.parse(data);
          if (parsedData.lyrics) {
            setLyrics(parsedData.lyrics);
            setError('');
          } else {
            setError('Şarkı sözleri bulunamadı.');
            setLyrics('');
          }
        } catch (err) {
          setError('Şarkı sözleri işlenirken bir hata oluştu.');
          setLyrics('');
        }
      } else if (data.lyrics) {
        setLyrics(data.lyrics);
        setError('');
      } else {
        setError('Şarkı sözleri bulunamadı.');
        setLyrics('');
      }
    } catch (err) {
      console.error('Hata detayı:', err);
      setError(`Bağlantı hatası: ${err.message}. Lütfen backend servisinin çalıştığından emin olun.`);
      setLyrics('');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Şarkı Sözleri Arama</h1>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Sanatçı Adı"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Şarkı Adı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button type="submit">Şarkı Sözlerini Getir</button>
        </form>
        
        {error && <p className="error">{error}</p>}
        
        {lyrics && (
          <div className="lyrics-container">
            <h2>{title} - {artist}</h2>
            <pre className="lyrics">{lyrics}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
