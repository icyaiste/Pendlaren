import { useState, useEffect } from 'react'
import './App.css'

const BASE_URL = 'https://api.resrobot.se/v2.1/location.nearbystops?';
const API_KEY = 'ffd23683-ea2a-4aa6-9131-2b56cb691a4f';

function App() {
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates>();

  useEffect(() => {
    if (userLocation?.latitude) getBusStops();
  }, [userLocation]);

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {  //what to do once we have the position
          console.log(position);
          setUserLocation(position.coords);// update the state with the new location
        },
        (error) => {
          console.error('Error getting user location');
        }
      );
    }
    //If there's an error getting the user location
    else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  async function getBusStops() {
    const url = `${BASE_URL}originCoordLat=${userLocation?.latitude}&originCoordLong=${userLocation?.longitude}&format=json&accessId=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  }

  return (
    <div>
      <h1>Pendlaren</h1>
      <button onClick={getUserLocation}>Get User Location</button>
      <p>Latitude: {userLocation?.latitude}</p>
      <p>Longitude: {userLocation?.longitude}</p>
    </div>
  );
}

export default App
