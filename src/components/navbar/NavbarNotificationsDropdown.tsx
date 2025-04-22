import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

import {
  Avatar as MuiAvatar,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover as MuiPopover,
  SvgIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import { Bell, Home, UserPlus, Server } from "lucide-react";
import {
  Notification,
  notificationIconFactory,
  NotificationType,
} from "@/types/notifications";
import { RemoveCircleOutline } from "@mui/icons-material";

const Popover = styled(MuiPopover)`
  .MuiPaper-root {
    width: 300px;
    ${(props) => props.theme.shadows[1]};
    border: 1px solid ${(props) => props.theme.palette.divider};
  }
`;

const Indicator = styled(Badge)`
  .MuiBadge-badge {
    background: ${(props) => props.theme.header.indicator.background};
    color: ${(props) => props.theme.palette.common.white};
  }
`;

const Avatar = styled(MuiAvatar)`
  background: ${(props) => props.theme.palette.primary.main};
`;

const NotificationHeader = styled(Box)`
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

function NotificationItem({
  notification,
  Icon,
  updateHandler,
}: {
  notification: Notification;
  Icon: React.ElementType;
  updateHandler: (id: number) => void;
}) {
  return (
    <ListItem
      divider
      component={Link}
      to="#"
      secondaryAction={
        <IconButton
          edge="end"
          arai-label="remove"
          onClick={() => updateHandler(notification?.id ?? -1)}
        >
          <RemoveCircleOutline color="primary" />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar>
          <SvgIcon fontSize="medium">
            <Icon />
          </SvgIcon>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={notification.title}
        primaryTypographyProps={{
          variant: "subtitle2",
          color: "textPrimary",
        }}
        secondary={notification.message}
      />
    </ListItem>
  );
}

type props = {
  notifications: Notification[];
  updateHandler: (id: number) => void;
};

function NavbarNotificationsDropdown({ notifications, updateHandler }: props) {
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Tooltip title="Notifications">
        <IconButton color="inherit" ref={ref} onClick={handleOpen} size="large">
          <Indicator badgeContent={notifications?.length}>
            <Bell />
          </Indicator>
        </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >
        <NotificationHeader p={2}>
          <Typography variant="subtitle2" color="textPrimary">
            {notifications && notifications?.length > 0
              ? `${notifications?.length} New Notifications`
              : `No Notifications`}
          </Typography>
        </NotificationHeader>
        <React.Fragment>
          <List disablePadding>
            {notifications?.map((ntf) => (
              <NotificationItem
                key={ntf?.id}
                notification={ntf}
                updateHandler={() => updateHandler(ntf.id!)}
                Icon={notificationIconFactory(ntf?.category)}
              />
            ))}
            <NotificationItem
              notification={{
                title: "Test",
                message: "this is a test notification",
                category: NotificationType.GENERAL,
                viewed: false,
                createdAt: "11/12/2025",
              }}
              updateHandler={() => updateHandler(-1)}
              Icon={notificationIconFactory(NotificationType.GENERAL)}
            />
          </List>
          {notifications?.length > 5 && (
            <Box p={1} display="flex" justifyContent="center">
              <Button size="small" component={Link} to="#">
                Show all notifications
              </Button>
            </Box>
          )}
        </React.Fragment>
      </Popover>
    </React.Fragment>
  );
}

export default NavbarNotificationsDropdown;
