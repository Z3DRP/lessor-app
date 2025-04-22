import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import { darken } from "polished";
import { useTranslation } from "react-i18next";

import {
  Grid2 as Grid,
  InputBase,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
} from "@mui/material";

import { Menu as MenuIcon } from "@mui/icons-material";

import NavbarNotificationsDropdown from "./NavbarNotificationsDropdown";
import NavbarMessagesDropdown from "./NavbarMessagesDropdown";
import NavbarLanguagesDropdown from "./NavbarLanguagesDropdown";
import NavbarUserDropdown from "./NavbarUserDropdown";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchNotifications,
  markNotificationAsViewed,
} from "@/redux/slices/notificationSlice";
import useAuth from "@/hooks/useAuth";

const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Search = styled.div`
  border-radius: 2px;
  background-color: ${(props) => props.theme.header.background};
  display: none;
  position: relative;
  width: 100%;

  &:hover {
    background-color: ${(props) => darken(0.05, props.theme.header.background)};
  }

  ${(props) => props.theme.breakpoints.up("md")} {
    display: block;
  }
`;

const SearchIconWrapper = styled.div`
  width: 50px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: ${(props) => props.theme.header.search.color};
    padding-top: ${(props) => props.theme.spacing(2.5)};
    padding-right: ${(props) => props.theme.spacing(2.5)};
    padding-bottom: ${(props) => props.theme.spacing(2.5)};
    padding-left: ${(props) => props.theme.spacing(12)};
    width: 160px;
  }
`;

type NavbarProps = {
  onDrawerToggle: React.MouseEventHandler<HTMLElement>;
};

const Navbar: React.FC<NavbarProps> = ({ onDrawerToggle }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { notifications, status } = useSelector(
    (state: RootState) => state.notification
  );
  const handleUpdate = async (id: number) => {
    try {
      const result = dispatch(
        markNotificationAsViewed({ notificationId: id })
      ).unwrap();
    } catch (err: any) {
      console.log("error marking notification as viewed ", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(
          fetchNotifications({ alsrId: user?.uid })
        ).unwrap();
        console.log("notif result: ", result);
      } catch (err: any) {
        console.log(`error ${err?.error || err?.message || err}`);
      }
    };

    if (user && (status === "idle" || status === "failed")) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  return (
    <React.Fragment>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Grid container alignItems="center" style={{ width: "100%" }}>
            <Grid sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
                size="large"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid>
              <Search>
                <SearchIconWrapper>
                  <Icon icon="ic:outline-search" fontSize={96} />
                </SearchIconWrapper>
                {/* @ts-expect-error t can be null */}
                <Input placeholder={t("Search")} />
              </Search>
            </Grid>
            <Grid size="grow" />
            <Grid>
              <NavbarMessagesDropdown />
              <NavbarNotificationsDropdown
                notifications={notifications}
                updateHandler={handleUpdate}
              />
              <NavbarLanguagesDropdown />
              <NavbarUserDropdown />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withTheme(Navbar);
