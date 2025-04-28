import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Bar } from "react-chartjs-2";

import {
  Briefcase,
  DollarSign,
  ExternalLink,
  Home,
  MapPin,
  ShoppingBag,
} from "lucide-react";

import { ReactComponent as Facebook } from "@/vendor/facebook.svg";
import { ReactComponent as Instagram } from "@/vendor/instagram.svg";

import {
  Avatar as MuiAvatar,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  Chip as MuiChip,
  Divider as MuiDivider,
  Grid2 as MuiGrid,
  LinearProgress as MuiLinearProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing, SpacingProps } from "@mui/system";
import HourglassFullTwoToneIcon from "@mui/icons-material/HourglassFullTwoTone";

import { ThemeProps } from "@/types/theme";
import useAuth from "@/hooks/useAuth";
import { AuthUser } from "@/types/auth";
import { User } from "@/types/user";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { fetchTasks } from "@/redux/slices/tasksSlice";

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Button = styled(MuiButton)(spacing);

const Card = styled(MuiCard)(spacing);

const Chip = styled(MuiChip)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Grid = styled(MuiGrid)(spacing);

const LinearProgress = styled(MuiLinearProgress)(spacing);

const Spacer = styled.div(spacing);

interface TypographyProps extends SpacingProps {
  component?: string;
}
const Typography = styled(MuiTypography)<TypographyProps>(spacing);

const Centered = styled.div`
  text-align: center;
`;

const Avatar = styled(MuiAvatar)`
  display: inline-block;
  height: 128px;
  width: 128px;
`;

const AboutIcon = styled.span`
  display: flex;
  padding-right: ${(props) => props.theme.spacing(2)};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ChartWrapper = styled.div`
  height: 280px;
  position: relative;
`;

const StatsIcon = styled.div`
  position: absolute;
  right: 16px;
  top: 32px;

  svg {
    width: 32px;
    height: 32px;
    color: ${(props) => props.theme.palette.secondary.main};
  }
`;

const ProductsChip = styled(Chip)<{ color?: string }>`
  height: 20px;
  padding: 4px 0;
  font-size: 90%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
`;

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)});
`;

type detailProps = {
  usr: AuthUser | null;
};

function Details({ usr }: detailProps) {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Profile Details
        </Typography>

        <Spacer mb={4} />

        <Centered>
          <Avatar
            alt={`${usr?.firstName} ${usr?.lastName}`}
            src={usr?.avatar ? usr.avatar : "/static/img/avatars/user5.png"}
          />
          <Typography variant="body2" component="div" gutterBottom>
            <Box fontWeight="fontWeightMedium">{`${usr?.firstName} ${usr?.lastName}`}</Box>
            <Box fontWeight="fontWeightRegular">Lead Developer</Box>
          </Typography>

          <Button mr={2} variant="contained" color="primary" size="small">
            Edit
          </Button>
          <Button mr={2} variant="contained" color="primary" size="small">
            Message
          </Button>
        </Centered>
      </CardContent>
    </Card>
  );
}

function Skills() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Skills
        </Typography>

        <Spacer mb={4} />

        <Centered>
          <Chip size="small" mr={1} mb={1} label="HTML" color="secondary" />
          <Chip size="small" mr={1} mb={1} label="JavaScript" />
          <Chip size="small" mr={1} mb={1} label="Sass" />
          <Chip size="small" mr={1} mb={1} label="React" />
          <Chip size="small" mr={1} mb={1} label="Redux" />
          <Chip size="small" mr={1} mb={1} label="Next.js" />
          <Chip size="small" mr={1} mb={1} label="Material UI" />
          <Chip size="small" mr={1} mb={1} label="UI" />
          <Chip size="small" mr={1} mb={1} label="UX" />
        </Centered>
      </CardContent>
    </Card>
  );
}

type aboutProps = {
  usr: AuthUser | null;
};
function About({ usr }: aboutProps) {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          About
        </Typography>

        <Spacer mb={4} />

        <Grid container direction="row" alignItems="center" mb={2}>
          <Grid>
            <AboutIcon>
              <Home />
            </AboutIcon>
          </Grid>
          <Grid>
            Lives in
            {usr?.address?.city != null && usr?.address?.state != null
              ? `${usr.address.city}, ${usr.address.state}`
              : " unknown"}
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" mb={2}>
          <Grid>
            <AboutIcon>
              <Briefcase />
            </AboutIcon>
          </Grid>
          <Grid>Works at unknown</Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

type elsewhereProps = {
  email: string;
};
function Elsewhere({ email }: elsewhereProps) {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Elsewhere
        </Typography>

        <Spacer mb={4} />

        <Grid container direction="row" alignItems="center" mb={2}>
          <Grid>
            <AboutIcon>
              <ExternalLink />
            </AboutIcon>
          </Grid>
          <Grid>
            <Link href="#">{email}</Link>
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" mb={2}>
          <Grid>
            <AboutIcon>
              <Facebook />
            </AboutIcon>
          </Grid>
          <Grid>
            <Link href="#">Facebook</Link>
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center">
          <Grid>
            <AboutIcon>
              <Instagram />
            </AboutIcon>
          </Grid>
          <Grid>
            <Link href="#">Instagram</Link>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function Earnings() {
  return (
    <Box position="relative">
      <Card mb={6} pt={2}>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            <Box fontWeight="fontWeightRegular">$ 47,973.32</Box>
          </Typography>
          <Typography variant="body2" gutterBottom mt={3} mb={0}>
            Total Earnings
          </Typography>

          <StatsIcon>
            <DollarSign />
          </StatsIcon>
          <LinearProgress
            variant="determinate"
            value={75}
            color="secondary"
            mt={4}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

function Orders() {
  return (
    <Box position="relative">
      <Card mb={6} pt={2}>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            <Box fontWeight="fontWeightRegular">7</Box>
          </Typography>
          <Typography variant="body2" gutterBottom mt={3} mb={0}>
            Tasks Today
          </Typography>

          <StatsIcon>
            <ShoppingBag />
          </StatsIcon>
          <LinearProgress
            variant="determinate"
            value={30}
            color="secondary"
            mt={4}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

function Pto() {
  return (
    <Box position="relative">
      <Card mb={6} pt={2}>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            <Box fontWeight="fontWeightRegular">12.24</Box>
          </Typography>
          <Typography variant="body2" gutterBottom mt={3} mb={0}>
            PTO Hours
          </Typography>

          <StatsIcon>
            <HourglassFullTwoToneIcon />
          </StatsIcon>
          <LinearProgress
            variant="determinate"
            value={50}
            color="secondary"
            mt={4}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

function Products() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Tasks
        </Typography>
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Started</TableCell>
                <TableCell>Completed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  AppStack
                </TableCell>
                <TableCell>
                  <ProductsChip size="small" label="HTML" color="primary" />
                </TableCell>
                <TableCell>Single License</TableCell>
                <TableCell>76</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Mira
                </TableCell>
                <TableCell>
                  <ProductsChip size="small" label="React" color="success" />
                </TableCell>
                <TableCell>Single License</TableCell>
                <TableCell>38</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Milo
                </TableCell>
                <TableCell>
                  <ProductsChip size="small" label="HTML" color="primary" />
                </TableCell>
                <TableCell>Single License</TableCell>
                <TableCell>43</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Robust UI Kit
                </TableCell>
                <TableCell>
                  <ProductsChip size="small" label="Angular" color="error" />
                </TableCell>
                <TableCell>Single License</TableCell>
                <TableCell>27</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Spark
                </TableCell>
                <TableCell>
                  <ProductsChip size="small" label="React" color="success" />
                </TableCell>
                <TableCell>Single License</TableCell>
                <TableCell>12</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableWrapper>
      </CardContent>
    </Card>
  );
}

const SalesRevenue = withTheme(({ theme }: ThemeProps) => {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Tasks",
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
        hoverBackgroundColor: theme.palette.secondary.main,
        hoverBorderColor: theme.palette.secondary.main,
        data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
        barPercentage: 0.625,
        categoryPercentage: 0.5,
      },
      {
        label: "Earnings",
        backgroundColor: theme.palette.grey[200],
        borderColor: theme.palette.grey[200],
        hoverBackgroundColor: theme.palette.grey[200],
        hoverBorderColor: theme.palette.grey[200],
        data: [69, 66, 24, 48, 52, 51, 44, 53, 62, 79, 51, 68],
        barPercentage: 0.625,
        categoryPercentage: 0.5,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        stacked: false,
      },

      x: {
        stacked: false,
        grid: {
          color: "transparent",
        },
      },
    },
  };

  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Tasks / Earnings
        </Typography>

        <Spacer mb={6} />

        <ChartWrapper>
          <Bar data={data} options={options} />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
});

function Profile() {
  const { user } = useAuth();
  // const dispatch = useDispatch<AppDispatch>();
  // const { tasks, status } = useState((state: RootState) => state.task);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = dispatch(fetchTasks({ alsrId: user?.lessorId }));
  //   };
  // });

  return (
    <React.Fragment>
      <Helmet title="Profile" />

      <Typography variant="h3" gutterBottom display="inline">
        Profile
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/">
          Dashboard
        </Link>
        <Link component={NavLink} to="/">
          Pages
        </Link>
        <Typography>Profile</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid size={{ xs: 12, lg: 4, xl: 3 }}>
          <Details usr={user} />
          <Skills />
          <About usr={user} />
          <Elsewhere email={user?.email} />
        </Grid>
        <Grid size={{ xs: 12, lg: 8, xl: 9 }}>
          <SalesRevenue />
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Earnings />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Orders />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Pto />
            </Grid>
          </Grid>
          <Products />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Profile;
