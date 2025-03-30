import { Property } from "@/types/property";
import styled from "@emotion/styled";
import { Card as MuiCard, Grid2 as Grid } from "@mui/material";
import { spacing } from "@mui/system";
import { useState } from "react";
import PropertyMap from "../property-map/PropertyMap";
import TaskList from "../tasks/taskList";

const Card = styled(MuiCard)(spacing);

export default function TaskHub() {
  const [selectedLocation, setSelectedLocation] = useState<Property | null>(
    null
  );
  return (
    <Grid container spacing={6} direction="row">
      <Grid size={{ xs: 12, md: 6 }}>
        <PropertyMap onSelectLocation={setSelectedLocation} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TaskList location={selectedLocation} />
      </Grid>
    </Grid>
  );
}
