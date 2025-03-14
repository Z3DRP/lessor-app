import React, { useState } from "react";
import styled from "@emotion/styled";

import {
  CardContent,
  Card as MuiCard,
  CircularProgress as MuiCircularProgress,
  LinearProgress as MuiLinearProgress,
  Paper as MuiPaper,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";

const Card = styled(MuiCard)(spacing);

const Paper = styled(MuiPaper)(spacing);

const CircularProgress = styled(MuiCircularProgress)(spacing);

const LinearProgress = styled(MuiLinearProgress)(spacing);

export function CircularIndeterminate() {
  return (
    <Card mb={6}>
      <CardContent>
        <Paper mt={3}>
          <CircularProgress m={2} />
          <CircularProgress m={2} color="secondary" />
        </Paper>
      </CardContent>
    </Card>
  );
}

export function CircularDeterminate() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Card mb={6}>
      <CardContent>
        <Paper mt={3}>
          <CircularProgress variant="determinate" value={progress} />
        </Paper>
      </CardContent>
    </Card>
  );
}

export function CircularStatic() {
  return (
    <Card mb={6}>
      <CardContent>
        <Paper mt={3}>
          <CircularProgress m={2} variant="determinate" value={5} />
          <CircularProgress m={2} variant="determinate" value={25} />
          <CircularProgress m={2} variant="determinate" value={50} />
          <CircularProgress m={2} variant="determinate" value={75} />
          <CircularProgress m={2} variant="determinate" value={100} />
        </Paper>
      </CardContent>
    </Card>
  );
}

export function LinearIndeterminate() {
  return (
    <Card mb={6}>
      <CardContent>
        <Paper mt={3}>
          <LinearProgress my={2} />
          <LinearProgress my={2} color="secondary" />
        </Paper>
      </CardContent>
    </Card>
  );
}

export function LinearBuffer() {
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);

  const progressRef = React.useRef(() => {});
  React.useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 10;
        const diff2 = Math.random() * 10;
        setProgress(progress + diff);
        setBuffer(progress + diff + diff2);
      }
    };
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Card mb={6}>
      <CardContent>
        <Paper mt={3}>
          <LinearProgress
            my={2}
            variant="buffer"
            value={progress}
            valueBuffer={buffer}
          />
          <LinearProgress
            my={2}
            color="secondary"
            variant="buffer"
            value={progress}
            valueBuffer={buffer}
          />
        </Paper>
      </CardContent>
    </Card>
  );
}

export function LinearDeterminate() {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Card mb={6}>
      <CardContent>
        <Paper mt={3}>
          <LinearProgress my={2} variant="determinate" value={progress} />
          <LinearProgress
            my={2}
            variant="determinate"
            value={progress}
            color="secondary"
          />
        </Paper>
      </CardContent>
    </Card>
  );
}

export function LinearLoading() {
  return (
    <Card mb={6}>
      <CardContent>
        <Paper mt={3}>
          <LinearProgress my={2} variant="query" />
          <LinearProgress my={2} variant="query" color="secondary" />
        </Paper>
      </CardContent>
    </Card>
  );
}
