import React from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  CardContent,
  ClickAwayListener,
  Fab,
  Fade,
  Grid2 as Grid,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  Divider as MuiDivider,
  IconButton as MuiIconButton,
  Paper as MuiPaper,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { spacing } from "@mui/system";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);

const IconButton = styled(MuiIconButton)(spacing);

const Button = styled(MuiButton)(spacing);

function TransitionsTooltips() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Simple Tooltips
        </Typography>
        <Typography variant="body2" gutterBottom>
          Tooltips display informative text when users hover over, focus on, or
          tap an element.
        </Typography>
        <Paper mt={3}>
          <Tooltip title="Add">
            <Button variant="contained" color="secondary" mr={2}>
              Grow
            </Button>
          </Tooltip>
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            title="Add"
          >
            <Button variant="contained" color="secondary" mr={2}>
              Fade
            </Button>
          </Tooltip>
          <Tooltip TransitionComponent={Zoom} title="Add">
            <Button variant="contained" color="secondary" mr={2}>
              Zoom
            </Button>
          </Tooltip>
        </Paper>
      </CardContent>
    </Card>
  );
}
