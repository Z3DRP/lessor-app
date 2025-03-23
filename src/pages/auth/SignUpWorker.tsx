import { Typography } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet-async";
import SignUpWorkerComponent from "@/components/auth/SignUpWorker";

function SignUpWorker() {
  return (
    <React.Fragment>
      <Helmet title="Sign Up Worker" />

      <Typography component="h1" variant="h3" align="center" gutterBottom>
        Get started
      </Typography>
      <Typography component="h2" variant="subtitle1" align="center">
        Start creating the best possible experience for your customers{" "}
        <strong>while managing less</strong>
      </Typography>

      <SignUpWorkerComponent />
    </React.Fragment>
  );
}

export default SignUpWorker;
