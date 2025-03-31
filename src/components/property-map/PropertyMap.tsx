import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import { formattedAddress, Property } from "@/types/property";

export type Coordinates = {
  lat: number;
  lng: number;
};

export type PropertyMapProps = {
  center: Coordinates;
  properties: Property[];
  onSelectLocation: (loc: Property) => void;
};

export default function PropertyMap({
  center,
  properties,
  onSelectLocation,
}: PropertyMapProps) {
  const houseIcon = new L.Icon({
    iconUrl: "/static/img/markers/fi-sc-home.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [-3, -76],
  });

  return (
    <Card sx={{ width: "100% ", px: 2 }}>
      <CardHeader title="Task Map" />
      <CardContent>
        {
          <Card>
            <Box sx={{ width: "100%", height: "500px" }}>
              <MapContainer
                center={center}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {properties.map((p) => (
                  <Marker
                    key={p.pid}
                    position={[p.address.lat, p.address.lng]}
                    icon={houseIcon}
                    eventHandlers={{
                      click: () => onSelectLocation(p),
                    }}
                  >
                    <Popup>{formattedAddress(p)}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Box>
          </Card>
        }
      </CardContent>
    </Card>
  );
}
