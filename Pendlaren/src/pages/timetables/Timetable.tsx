import { useState, useEffect } from "react";

const BASE_URL = 'https://api.resrobot.se/v2.1/departureBoard?id=';
const API_KEY = 'ffd23683-ea2a-4aa6-9131-2b56cb691a4f';


interface TimetableProps {
    extId: number;
    selectedStop: string;
}


function Timetable({ extId, selectedStop }: TimetableProps) {
    const [departures, setDepartures] = useState<any[]>([]);

    useEffect(() => {
        async function getDepartures() {
            const url = `${BASE_URL}?id=${extId}&maxJourneys=10&format=json&accessId=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            setDepartures(Array.isArray(data.Departure) ? data.Departure : []);
        }

        getDepartures();
    }, []);

    return (
        <main>
            <h1>Avgångar för denna hållplatsen: {selectedStop} </h1>
            <ul>
                {departures.map((departure, index) => (
                    <li key={index}>
                        {departure.Product.name} - {departure.time} - {departure.direction}
                    </li>
                ))}
            </ul>
        </main>
    )
}

export default Timetable
