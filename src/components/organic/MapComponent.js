import React, { useState, useEffect } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const MapContainer = ({ google, latitude, longitude }) => {
    // const [position, setPosition] = useState({ lat: 0, lng: 0 });
    let position = {
        lat: latitude,
        lng: longitude
    }


    return (
        <Map
            google={google}
            zoom={15}
            initialCenter={position}
            center={position}
            style={{ width: '100%', height: '100%' }}
        >
            <Marker position={position} />
        </Map>
    );
};

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBtPqvB5fSoEsqEQ7hEGDYu_FNC6ZTC3hc' // Replace with your Google Maps API key
})(MapContainer);