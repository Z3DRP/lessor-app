import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import { useEffect } from "react";

const ResizeMap = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }, [map]);
  return null;
};

export default function PropertyMap() {
  const houseIcon = new L.Icon({
    iconUrl: "/static/img/marker/fi-sc-home.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [-3, -76],
  });

  return (
    <Card sx={{ width: "100% ", px: 2 }}>
      <CardHeader title="Task Map" />
      <CardContent>
        <Card>
          <Box sx={{ width: "100%", height: "500px" }}>
            <MapContainer
              center={[37.7749, -122.4194]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[40.7128, -74.006]} icon={houseIcon}>
                <Popup>task</Popup>
              </Marker>
            </MapContainer>
          </Box>
        </Card>
      </CardContent>
    </Card>
  );
}
