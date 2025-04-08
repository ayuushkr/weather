import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = '9a70909f424e4bafc96da9e144c60147';

  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  return (
    <div className="app">
      <h1 className="app-title">Weather Dashboard</h1>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {loading && <div className="loading">Loading weather data...</div>}

      {error && (
        <div className="error">
          Error: {error}. Please try another city.
        </div>
      )}

      {weatherData && !loading && (
        <WeatherCard data={weatherData} />
      )}
    </div>
  );
}

const WeatherCard = ({ data }) => {
  const weatherIcon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

  return (
    <div className="weather-card">
      <h2 className="city-name">{data.name}, {data.sys.country}</h2>
      <div className="weather-main">
        <img src={iconUrl} alt={data.weather[0].description} className="weather-icon" />
        <div className="temperature">{Math.round(data.main.temp)}°C</div>
      </div>
      <div className="weather-condition">{data.weather[0].main}</div>
      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Humidity:</span>
          <span className="detail-value">{data.main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind Speed:</span>
          <span className="detail-value">{data.wind.speed} km/h</span>
        </div>
      </div>
    </div>
  );
};

export default App;
