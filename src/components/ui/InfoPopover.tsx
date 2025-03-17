import React, { useState } from "react";
import {
  Popover as MuiPopover,
  IconButton,
  Typography,
  Divider as MuiDivider,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info"; // "ⓘ" Icon
import { styled } from "@mui/material/styles";

const Popover = styled(MuiPopover)(({ theme }) => ({
  "& .MuiPaper-root": {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: "8px",
    boxShadow: theme.shadows[3],
    maxWidth: "250px",
    wordWrap: "break-word",
    overFlow: "hidden",
  },
}));

const Divider = styled(MuiDivider)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
}));

const InfoPopover = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => {
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
        <Typography sx={{ p: 2 }}>{title}</Typography>
        <Divider />
        <Typography sx={{ p: 2 }} variant="body1">
          {message}
        </Typography>
      </Popover>
    </>
  );
};

export default InfoPopover;
