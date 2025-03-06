import React from "react";
import styled from "@emotion/styled";

import {
  CardContent,
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionSummary,
  Card as MuiCard,
  Typography,
  IconButton,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon, Eye } from "@mui/icons-material";
import { spacing } from "@mui/system";
import { Eye } from "lucide-react";

const Card = styled(MuiCard)(spacing);

export interface PropertyViewAccordionProps {
  expandWidthSetter: (value: boolean) => void;
}

export default function PropertyViewAccordian({
  expandWidthSetter,
}: PropertyViewAccordionProps) {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    // eslint-disable-next-line @typescript-eslint/ban-types
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      expandWidthSetter(isExpanded);
    };

  return (
    <MuiAccordion
      expanded={expanded === "panel1"}
      onChange={handleChange("panel1")}
    >
      <AccordionSummary
        expandIcon={
          <IconButton size="small" color="primary" sx={{ mt: 1 }}>
            <Eye />
          </IconButton>
        }
      ></AccordionSummary>
      {expanded && (
        <AccordionDetails>
          <Typography>
            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
            Aliquam eget maximus est, id dignissim quam.
          </Typography>
        </AccordionDetails>
      )}
    </MuiAccordion>
  );
}
