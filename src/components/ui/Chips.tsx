import React, { useState } from "react";
import styled from "@emotion/styled";

import { Avatar, Chip as MuiChip } from "@mui/material";
import { spacing, SpacingProps } from "@mui/system";

interface ChipProps extends SpacingProps {
  component?: React.ElementType;
  href?: string;
  icon?: JSX.Element | null;
}

const Chip = styled(MuiChip)<ChipProps>(spacing);

export const DfltChip = styled(MuiChip)<{ color?: string }>`
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
