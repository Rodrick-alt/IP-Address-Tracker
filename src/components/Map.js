import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';


function Map(props) {

  function ChangeView({ center }) {
    const map = useMap();
    map.setView(center, 13);
    return null;
  }

  return (
    <MapContainer
      style={{ height: "100vh" }}
      center={props.positionNum} zoom={13}>
      <ChangeView center={props.positionNum} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={props.positionNum}>
        <Popup>
          Your Approximate location
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default Map