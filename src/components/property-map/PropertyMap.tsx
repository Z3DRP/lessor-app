import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Box, Card, CardContent, CardHeader, Select } from "@mui/material";
import { formattedAddress, Property } from "@/types/property";
import { useEffect, useRef, useState } from "react";

export type Coordinates = {
  lat: number;
  lng: number;
};

export type PropertyMapProps = {
  center: Coordinates;
  properties: Property[];
  onSelectLocation: (loc: Property | null) => void;
};

export default function PropertyMap({
  center,
  properties,
  onSelectLocation,
}: PropertyMapProps) {
  const defaultIcon = new L.Icon({
    iconUrl: "/static/img/markers/location.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [-3, -76],
  });
  const selectedIcon = new L.Icon({
    iconUrl: "/static/img/markers/location_active.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -35],
  });
  const [currentCenter, setCurrentCenter] = useState<Coordinates>(center);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const markerRefs = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (selectedPropertyId && markerRefs.current[selectedPropertyId]) {
      markerRefs.current[selectedPropertyId].openPopup();
    }
  }, [selectedPropertyId]);

  return (
    <Card sx={{ width: "100% ", px: 2 }}>
      <CardHeader
        title="Task Map"
        action={
          <Select
            native
            fullWidth
            defaultValue="all"
            value={selectedPropertyId}
            onChange={(e: any) => {
              console.log("changing to ", e.target.value);
              if (e.target.value === "all") {
                setCurrentCenter(center);
                setSelectedPropertyId(null);
                onSelectLocation(null);
                return;
              }
              const selectedProp = properties?.filter(
                (p) => p?.pid === e.target.value
              )[0];
              if (selectedProp) {
                setCurrentCenter({
                  lat: selectedProp.address.lat!,
                  lng: selectedProp.address.lng!,
                });
                setSelectedPropertyId(selectedProp.pid!);
                onSelectLocation(selectedProp);
              }
            }}
          >
            <option value="all">All</option>
            {properties?.map((p) => (
              <option key={p?.pid} value={p?.pid}>
                {formattedAddress(p)}
              </option>
            ))}
          </Select>
        }
      />
      <CardContent>
        {
          <Card>
            <Box sx={{ width: "100%", height: "500px" }}>
              <MapContainer
                center={currentCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapPanner center={currentCenter} />
                {properties.map((p) => (
                  <Marker
                    key={p.pid}
                    position={[p.address.lat!, p.address.lng!]}
                    icon={
                      p.pid === selectedPropertyId ? selectedIcon : defaultIcon
                    }
                    eventHandlers={{
                      click: () => {
                        onSelectLocation(p);
                        setSelectedPropertyId(p.pid!);
                      },
                    }}
                    ref={(ref) => {
                      if (ref) {
                        markerRefs.current[p.pid!] = ref;
                      }
                    }}
                  >
                    <Popup autoPan={false}>{formattedAddress(p)}</Popup>
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

type PannerProps = {
  center: Coordinates;
};

function MapPanner({ center }: PannerProps) {
  const map = useMap();
  useEffect(() => {
    if (center?.lat && center?.lng) {
      map.panTo([center.lat, center.lng]);
    }
  }, [center, map]);

  return null;
}
