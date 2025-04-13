import React from "react";
import styled from "@emotion/styled";

import { Button as MuiButton, Menu, MenuItem } from "@mui/material";
import { spacing } from "@mui/system";
import { Icon } from "@iconify/react";

const Button = styled(MuiButton)(spacing);

const SmallButton = styled(Button)`
  padding: 4px;
  min-width: 0;

  svg {
    width: 1em;
    height: 1em;
  }
`;

function Actions() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <SmallButton size="medium" mr={2}>
        <Icon icon="ic:round-loop" fontSize={22} />
      </SmallButton>
      <SmallButton size="medium" mr={4}>
        <Icon icon="ic:baseline-filter-list" fontSize={22} />
      </SmallButton>
      <Button
        variant="contained"
        color="primary"
        aria-owns={anchorEl ? "simple-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        Today:{" "}
        {new Date().toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
        })}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Today</MenuItem>
        <MenuItem onClick={handleClose}>Yesterday</MenuItem>
        <MenuItem onClick={handleClose}>Last 7 days</MenuItem>
        <MenuItem onClick={handleClose}>Last 30 days</MenuItem>
        <MenuItem onClick={handleClose}>This month</MenuItem>
        <MenuItem onClick={handleClose}>Last month</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default Actions;
