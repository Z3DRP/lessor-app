import useAuth from "@/hooks/useAuth";
import { fetchProperties } from "@/redux/slices/propertiesSlice";
import { fetchTasks } from "@/redux/slices/tasksSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Property } from "@/types/property";
import { Task } from "@/types/task";
import { Grid2 as Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropertyMap, { Coordinates } from "../property-map/PropertyMap";
import TaskList from "../tasks/taskList";
import { TransitionAlert } from "../ui/CustomAlerts";
import { LinearLoading } from "../ui/Loaders";

const defaultCoordinates: Coordinates = {
  lat: 38.8933369324047,
  lng: -90.14417349276893,
};

type zError = {
  msg: string;
  type: "general" | "geolocation";
};

export default function TaskHub() {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { properties, status: pStatus } = useSelector(
    (state: RootState) => state.property
  );
  const { tasks, status: tStatus } = useSelector(
    (state: RootState) => state.task
  );
  const [selectedLocation, setSelectedLocation] = useState<Property | null>(
    null
  );
  const [filteredTasks, setFilteredTasks] = useState<Task[] | null>();
  const { enqueueSnackbar } = useSnackbar();

  const handleSelectLocation = async (loc: Property | null) => {
    if (loc == null) {
      setSelectedLocation(null);
      setFilteredTasks(tasks);
      return;
    }
    setSelectedLocation(loc);
    setFilteredTasks(tasks.filter((t) => t.propertyId === loc.pid));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log(
        "your brower does not support geolocation, could not get your location to center map"
      );
      // setError(
      //   "your brower does not support geolocation, could not get your location to center map"
      // );
      console.log("user's browser does not support geolocation api");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => {
        //setError(`geolocation error ${err?.message}`);
        //enqueueSnackbar(`Geolocation api error: ${err}`, { variant: "error" });
        console.error("error with geolocation api: ", err);
      }
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (pStatus === "idle") {
          await dispatch(
            fetchProperties({ alsrId: user?.uid, page: 1 })
          ).unwrap();
        }

        if (tStatus === "idle") {
          await dispatch(
            fetchTasks({ alsrId: user?.uid, page: 1, limit: 30 })
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

  useEffect(() => {
    // NOTE: maybe remove this setFilteredTasks
    setFilteredTasks(tasks);
  }, [tasks]);

  return (
    <Fragment>
      {tStatus === "loading" || pStatus === "loading" ? (
        <LinearLoading />
      ) : (
        <>
          <TransitionAlert
            variant="error"
            message={error ?? ""}
            isOpen={error != null}
            closeHandler={() => setError(null)}
          />
          <Grid container spacing={6} direction="row">
            <Grid size={{ xs: 12, md: 6 }}>
              <PropertyMap
                center={userLocation ?? defaultCoordinates}
                properties={properties}
                onSelectLocation={handleSelectLocation}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {filteredTasks && (
                <TaskList
                  userId={user?.uid}
                  tasks={filteredTasks}
                  location={selectedLocation}
                />
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Fragment>
  );
}
