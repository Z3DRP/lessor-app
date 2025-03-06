import React from "react";
import styled from "@emotion/styled";

import {
  CardContent,
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionSummary,
  Card as MuiCard,
  Typography,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { spacing } from "@mui/system";

const Card = styled(MuiCard)(spacing);

export default function Accordion() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    // eslint-disable-next-line @typescript-eslint/ban-types
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <MuiAccordion
      expanded={expanded === "panel1"}
      onChange={handleChange("panel1")}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>General settings</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
          Aliquam eget maximus est, id dignissim quam.
        </Typography>
      </AccordionDetails>
    </MuiAccordion>
  );
}
