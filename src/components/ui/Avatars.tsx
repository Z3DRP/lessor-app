import styled from "@emotion/styled";

import {
  CardContent,
  Grid2 as Grid,
  Avatar as MuiAvatar,
  Card as MuiCard,
  Typography,
} from "@mui/material";
import { deepOrange, deepPurple, green, pink } from "@mui/material/colors";
import {
  Assignment as AssignmentIcon,
  Folder as FolderIcon,
  Pageview as PageviewIcon,
} from "@mui/icons-material";
import { spacing } from "@mui/system";

const Card = styled(MuiCard)(spacing);

const Avatar = styled(MuiAvatar)`
  margin-right: ${(props) => props.theme.spacing(2)};
`;

const BigAvatar = styled(Avatar)`
  width: 60px;
  height: 60px;
`;

const PinkAvatar = styled(Avatar)`
  background-color: ${pink[500]};
`;

const GreenAvatar = styled(Avatar)`
  background-color: ${green[500]};
`;

const OrangeAvatar = styled(Avatar)`
  background-color: ${deepOrange[500]};
`;

const PurpleAvatar = styled(Avatar)`
  background-color: ${deepPurple[500]};
`;

export type InitialAvatarProps = {
  initials: string;
};

export function InitialAvatar({ initials }: InitialAvatarProps) {
  return <OrangeAvatar>{initials}</OrangeAvatar>;
}

export function ImageAvatars() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Image Avatars
        </Typography>
        <Typography variant="body2" gutterBottom>
          Image avatars can be created by passing standard img props src or
          srcSet into the component.
        </Typography>

        <Grid container justifyContent="center" alignItems="center">
          <Avatar alt="Remy Sharp" src="/static/img/avatars/avatar-1.jpg" />
          <BigAvatar alt="Remy Sharp" src="/static/img/avatars/avatar-1.jpg" />
        </Grid>
      </CardContent>
    </Card>
  );
}

export function LetterAvatars() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Letter avatars
        </Typography>
        <Typography variant="body2" gutterBottom>
          Avatars containing simple characters can be created by passing your
          string as children.
        </Typography>

        <Grid container justifyContent="center" alignItems="center">
          <Avatar>H</Avatar>
          <OrangeAvatar>N</OrangeAvatar>
          <PurpleAvatar>OP</PurpleAvatar>
        </Grid>
      </CardContent>
    </Card>
  );
}

export function IconAvatars() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Icon avatars
        </Typography>
        <Typography variant="body2" gutterBottom>
          Icon avatars are created by passing an icon as children.
        </Typography>

        <Grid container justifyContent="center" alignItems="center">
          <Avatar>
            <FolderIcon />
          </Avatar>
          <PinkAvatar>
            <PageviewIcon />
          </PinkAvatar>
          <GreenAvatar>
            <AssignmentIcon />
          </GreenAvatar>
        </Grid>
      </CardContent>
    </Card>
  );
}
