import React, { useState } from "react";
import { Popover, IconButton, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info"; // "ⓘ" Icon

const InfoPopover = ({ message }: { message: string }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleOpen} size="small" color="primary">
        <InfoIcon />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Typography sx={{ p: 2 }}>{message}</Typography>
      </Popover>
    </>
  );
};

export default InfoPopover;
