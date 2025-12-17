import { useEffect, useState } from 'react';
import { api } from '../api';

const openWeatherKey = process.env.REACT_APP_OPENWEATHER_KEY;
const googleMapsKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

const DashboardPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favMessage, setFavMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/destinations');
        setDestinations(res.data);
      } catch (err) {
        setError('Failed to load destinations');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!openWeatherKey || destinations.length === 0) return;
      const results = {};
      await Promise.all(
        destinations.map(async (d) => {
          try {
            const res = await api.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${d.latitude}&lon=${d.longitude}&appid=${openWeatherKey}&units=metric`
            );
            results[d._id] = res.data;
          } catch (e) {
            // ignore per-destination errors
          }
        })
      );
      setWeatherData(results);
    };

    fetchWeather();
  }, [destinations]);

  const addFavorite = async (destinationId) => {
    setFavMessage('');
    try {
      await api.post('/favorites', { destinationId });
      setFavMessage('Added to favorites');
    } catch (err) {
      setFavMessage(err.response?.data?.message || 'Could not add favorite');
    }
  };

  if (loading) return <p>Loading destinations...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="grid">
      {destinations.map((dest) => {
        const weather = weatherData[dest._id];
        return (
          <div key={dest._id} className="card">
            <h3>{dest.name}</h3>
            <p className="muted">{dest.country}</p>
            {dest.description && <p>{dest.description}</p>}
            {weather && (
              <p className="muted">
                {weather.main?.temp}°C, {weather.weather?.[0]?.description}
              </p>
            )}
            {!openWeatherKey && <p className="muted">Set REACT_APP_OPENWEATHER_KEY for weather</p>}
            <button onClick={() => addFavorite(dest._id)}>Add to Favorites</button>
            {favMessage && <p className="muted">{favMessage}</p>}
            {googleMapsKey ? (
              <iframe
                title={`${dest.name}-map`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/view?key=${googleMapsKey}&center=${dest.latitude},${dest.longitude}&zoom=10`}
                className="map-frame"
              />
            ) : (
              <p className="muted">Set REACT_APP_GOOGLE_MAPS_KEY to view map</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardPage;


