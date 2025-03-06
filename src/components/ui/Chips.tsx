import React, { useState } from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  Avatar,
  CardContent,
  Grid2 as Grid,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  Chip as MuiChip,
  Divider as MuiDivider,
  Typography,
  Stack,
} from "@mui/material";
import {
  Done as DoneIcon,
  Face as FaceIcon,
  TagFaces as TagFacesIcon,
} from "@mui/icons-material";
import { spacing, SpacingProps } from "@mui/system";

interface ChipProps extends SpacingProps {
  component?: React.ElementType;
  href?: string;
  icon?: JSX.Element | null;
}

const Chip = styled(MuiChip)<ChipProps>(spacing);

const DfltChip = styled(MuiChip)<{ color?: string }>`
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)};
`;

export type InitialsChipProps = {
  initials: string;
  handleClick?: () => void;
};
export function InitialsChip({ initials, handleClick }: InitialsChipProps) {
  return (
    <Chip
      avatar={<Avatar>{initials}</Avatar>}
      label={initials}
      m={1}
      {...(handleClick ? { onClick: handleClick } : {})}
      variant="outlined"
    />
  );
}

export default Chip;
