import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchProperties } from "@/redux/slices/propertiesSlice";
import useAuth from "@/hooks/useAuth";
import { LinearLoading } from "../ui/Loaders";
import { TransitionAlert } from "../ui/CustomAlerts";
import { Property } from "@/types/property";

export type PropertyMapProps = {
  onSelectLocation: (loc: Property) => void;
};

export default function PropertyMap({ onSelectLocation }: PropertyMapProps) {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);
  const { properties, status } = useSelector(
    (state: RootState) => state.property
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === "idle") {
          await dispatch(
            fetchProperties({ alsrId: user?.uid, page: 1 })
          ).unwrap();
        }
      } catch (err: any) {
        setError(err?.message || err?.error || "something went wrong");
      }
    };

    if (user) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {});

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
        {status === "loading" ? (
          <LinearLoading />
        ) : (
          <>
            <TransitionAlert
              variant="error"
              message={error ?? ""}
              isOpen={error != null}
              closeHandler={() => setError(null)}
            />
            {!error && (
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
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
