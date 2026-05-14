'use strict';

// Hier zijn Constants, Arrow functies, Promises en async & await
// Ik zal Brussels API gebruiken

// Hier gebruik ik Constants voor de API en een integer als limiet voor aantal records.
const API_URL = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/lieux_culturels_touristiques_evenementiels_visitbrussels_vbx/records";
const LIMIT = 100; // Ik zal genoeg records fetchen zodat filtering goed werkt

// Hier gebruik ik async en arrow functies
export const fetchVenues = async () => {
    try{
        const response = await fetch(`${API_URL}?limit=${LIMIT}`)

        if(! response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.results || [];
    }catch(error) {
        console.error("Fout bij het ophalen van de data: ", error);
        return []; // Leeg array als het niet lukt
    }
}



