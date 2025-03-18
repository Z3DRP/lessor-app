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
  Person,
} from "@mui/icons-material";
import { spacing } from "@mui/system";
import { User, UserIcon, UserRoundIcon } from "lucide-react";

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

const OrangeAvatar = styled(MuiAvatar)`
  background-color: ${deepOrange[500]};
`;

const PurpleAvatar = styled(Avatar)`
  background-color: ${deepPurple[500]};
`;

export type InitialAvatarProps = {
  firstName: string | null;
  lastName: string | null;
};

export function InitialAvatar({ firstName, lastName }: InitialAvatarProps) {
  if (firstName == null || lastName == null) {
    return (
      <OrangeAvatar>
        <Person fontSize="large" />
      </OrangeAvatar>
    );
  }
  return <OrangeAvatar>{`${firstName[0]}${lastName[0]}`}</OrangeAvatar>;
}

export function ImageAvatars() {
  return (
    <Card mb={6}>
      <CardContent>
        <Grid container justifyContent="center" alignItems="center">
          <Avatar alt="Remy Sharp" src="/static/img/avatars/avatar-1.jpg" />
          <BigAvatar alt="Remy Sharp" src="/static/img/avatars/avatar-1.jpg" />
        </Grid>
      </CardContent>
    </Card>
  );
}

export function LetterAvatars() {
  return <PurpleAvatar>OP</PurpleAvatar>;
}

export function IconAvatars() {
  return (
    <Card mb={6}>
      <CardContent>
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
