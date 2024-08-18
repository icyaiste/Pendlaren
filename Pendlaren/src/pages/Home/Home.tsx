import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timetable from '../timetables/Timetable';
import { b } from 'vitest/dist/suite-IbNSsUWN.js';

const BASE_URL = 'https://api.resrobot.se/v2.1/location.nearbystops?';
const API_KEY = 'ffd23683-ea2a-4aa6-9131-2b56cb691a4f';

interface Stop {
    name: string;
    id: number;
}


const Home: React.FC = () => {
    const [userLocation, setUserLocation] = useState<GeolocationCoordinates>();
    const [stopNames, setStopNames] = useState<Stop[]>([]);
    const [selectedStop, setSelectedStop] = useState<string>('');

    const navigate = useNavigate();

    function navigateToTimetable(extId: number) {
        navigate(`/timetable/${extId}`);
    }

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
        // console.log(data);
    
        const busStopLocations = data.stopLocationOrCoordLocation;

        if (busStopLocations) {
            const stopNamesArray = busStopLocations.map((stop: any) => {
                console.log(stop.StopLocation); // Log each StopLocation object
                return {
                    name: stop.StopLocation.name,
                    id: stop.StopLocation.extId || stop.StopLocation.id // Ensure we get either extId or id
                };
            });
            setStopNames(stopNamesArray);
            // console.log(stopNamesArray); // Log the stopNamesArray
        } else {
            console.error("No stop locations found.");
        }
        showBusStops(busStopLocations);
    }
    
    function showBusStops(busStopLocations: any) {
        if (busStopLocations && Array.isArray(busStopLocations)) {
            const stopNamesArray = busStopLocations.map((busStopLocation: any) => {
                console.log(busStopLocation); // Inspect the structure
                return {
                    name: busStopLocation.StopLocation.name,
                    id: busStopLocation.StopLocation.extId || busStopLocation.StopLocation.id
                };
            });
        } else {
            console.error("Invalid bus stop locations data.");
        }
    }

    function saveSelectedStop(stopName: string, extId: number) {
        setSelectedStop(stopName);
        console.log(`Saved stop: ${stopName}, extId: ${extId}`);
        navigateToTimetable(extId);
    }

    function renderStops() {
        return (
            <ol>
                {stopNames.map((stop, index) => (
                    <li key={index}>
                        {stop.name}
                        <button onClick={() => saveSelectedStop(stop.name, stop.id)}>Select</button>
                    </li>
                ))}
            </ol>
        );
    }



    return (
        <div>
            <h1>Pendlaren</h1>
            <button onClick={getUserLocation}>Get User Location</button>
            <p>Närmaste hållplatser är:</p>
            {renderStops()}
            <Timetable selectedStop={selectedStop} />
        </div>
    );
}

export default Home