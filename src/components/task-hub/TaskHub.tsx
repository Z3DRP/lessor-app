import styled from "@emotion/styled";
import { Card as MuiCard, Grid2 as Grid } from "@mui/material";
import { spacing } from "@mui/system";
import PropertyMap from "../property-map/PropertyMap";
import TaskList from "../tasks/taskList";

const Card = styled(MuiCard)(spacing);

export default function TaskHub() {
  return (
    <Grid container spacing={6} direction="row">
      <Grid size={{ xs: 12, md: 6 }}>
        <PropertyMap />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TaskList />
      </Grid>
    </Grid>
  );
}
