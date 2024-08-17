import { useState, useEffect } from 'react'
import './App.css'

const BASE_URL = 'https://api.resrobot.se/v2.1/location.nearbystops?';
const API_KEY = 'ffd23683-ea2a-4aa6-9131-2b56cb691a4f';

function App() {
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates>();
  const [stopNames, setStopNames] = useState<string[]>([]);

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

    const busStopLocations = data.stopLocationOrCoordLocation;
    // console.log(busStopLocations);
    showBusStops(busStopLocations);
  }

  function showBusStops(busStopLocations: any) {
    if (busStopLocations && Array.isArray(busStopLocations)) {
      const stopNamesArray = busStopLocations.map(busStopLocation => busStopLocation.StopLocation.name);
      console.log(stopNamesArray);
      setStopNames(stopNamesArray);
    }
  }

  return (
    <div>
      <h1>Pendlaren</h1>
      <button onClick={getUserLocation}>Get User Location</button>
      <p>Närmaste hållplatser är:</p>
      <ol>
        {stopNames.map((stopName, index) => (
          <li key={index}>{stopName}</li>
        ))}
      </ol>
    </div>
  );
}

export default App