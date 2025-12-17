import { useEffect, useState } from 'react';
import { api } from '../api';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFavorites = async () => {
    try {
      const res = await api.get('/favorites');
      setFavorites(res.data);
    } catch (err) {
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const removeFavorite = async (id) => {
    try {
      await api.delete(`/favorites/${id}`);
      setFavorites((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      setError('Could not remove favorite');
    }
  };

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="grid">
      {favorites.length === 0 && <p>No favorites yet.</p>}
      {favorites.map((fav) => (
        <div key={fav._id} className="card">
          <h3>{fav.destination?.name}</h3>
          <p className="muted">{fav.destination?.country}</p>
          <button onClick={() => removeFavorite(fav._id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default FavoritesPage;


