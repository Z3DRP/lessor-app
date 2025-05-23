import React from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Typography,
} from "@mui/material";
import { Container, spacing } from "@mui/system";
import TaskHub from "@/components/task-hub/TaskHub";
import useAuth from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

function WorkerTaskDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  return (
    <React.Fragment>
      <Helmet title="Worker Home">
        <title>Worker Home Page</title>
        <meta name="description" content="worker home page to manage tasks" />
      </Helmet>
      <Typography variant="h3" gutterBottom display="inline">
        Task Dashboard
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/worker">
          Dashboard
        </Link>
        <Link component={NavLink} to="/worker">
          Pages
        </Link>
        <Typography>Task Dashboard</Typography>
      </Breadcrumbs>
      <Typography variant="subtitle1">
        {t("Welcome back")}, {user?.firstName} {t("We've missed you")}.{" "}
        <span role="img" aria-label="Waving Hand Sign">
          👋
        </span>
      </Typography>
      <Divider my={6} />
      <Container>
        <TaskHub />
      </Container>
    </React.Fragment>
  );
}

export default WorkerTaskDashboard;
