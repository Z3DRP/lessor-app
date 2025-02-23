import React, { useState } from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  Avatar,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Card as MuiCard,
  CardActions,
  CardContent as MuiCardContent,
  CardMedia as MuiCardMedia,
  Chip as MuiChip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  Grid2 as Grid,
  IconButton,
  Link,
  TextField,
  Typography as MuiTypography,
} from "@mui/material";
import { AvatarGroup as MuiAvatarGroup } from "@mui/material";
import { spacing, SpacingProps } from "@mui/system";
import { Eye, Pencil, TrashIcon } from "lucide-react";
import { Add as AddIcon } from "@mui/icons-material";

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  border-bottom: 1px solid ${(props) => props.theme.palette.grey[300]};
`;

const CardMedia = styled(MuiCardMedia)`
  height: 220px;
`;

const Divider = styled(MuiDivider)(spacing);

interface TypographyProps extends SpacingProps {
  component?: string;
}
const Typography = styled(MuiTypography)<TypographyProps>(spacing);

const Chip = styled(MuiChip)<{ color?: string }>`
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)};
`;

const AvatarGroup = styled(MuiAvatarGroup)`
  margin-left: ${(props) => props.theme.spacing(2)};
`;

type PropertyProps = {
  image?: string;
  title: string;
  description: string;
  chip: JSX.Element;
};
const Property: React.FC<PropertyProps> = ({
  image,
  title,
  description,
  chip,
}) => {
  return (
    <Card>
      {image ? <CardMedia image={image} title="Contemplative Reptile" /> : null}
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {title} bs
        </Typography>

        {chip}

        <Typography mb={4} color="textSecondary" component="p">
          {description}
        </Typography>

        <AvatarGroup max={3}>
          <Avatar alt="Avatar" src="/static/img/avatars/avatar-1.jpg" />
          <Avatar alt="Avatar" src="/static/img/avatars/avatar-2.jpg" />
          <Avatar alt="Avatar" src="/static/img/avatars/avatar-3.jpg" />
        </AvatarGroup>
      </CardContent>
      <CardActions>
        <IconButton size="small" color="primary">
          <Pencil size={16} />
        </IconButton>
        <IconButton size="small" color="primary">
          <TrashIcon size={16} />
        </IconButton>
        <IconButton size="small" color="primary">
          <Eye />
        </IconButton>
      </CardActions>
    </Card>
  );
};

function Properties() {
  const [openNewDialog, setOpenNewDialog] = useState<boolean>(false);
  const handleCreateProperty = () => setOpenNewDialog(true);

  return (
    <React.Fragment>
      <Helmet title="Properties" />
      <Grid justifyContent="space-between" container spacing={10}>
        <Grid>
          <Typography variant="h3" gutterBottom display="inline">
            Properties
          </Typography>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/">
              Dashboard
            </Link>
            <Link component={NavLink} to="/">
              Pages
            </Link>
            <Typography>Properties</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateProperty}
            >
              <AddIcon />
              New Property
            </Button>
          </div>
        </Grid>
      </Grid>
      <Divider my={6} />
      <Grid container spacing={6}>
        <Grid
          size={{
            xs: 12,
            lg: 6,
            xl: 3,
          }}
        >
          <Property
            title="Landing page redesign"
            description="Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum."
            chip={<Chip label="Finished" color="success" />}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6,
            xl: 3,
          }}
        >
          <Property
            title="Company posters"
            description="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa."
            chip={<Chip label="In progress" color="warning" />}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6,
            xl: 3,
          }}
        >
          <Property
            title="Product page design"
            description="Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum."
            chip={<Chip label="Finished" color="success" />}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6,
            xl: 3,
          }}
        >
          <Property
            title="Upgrade CRM software"
            description="Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris."
            chip={<Chip label="In progress" color="warning" />}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6,
            xl: 3,
          }}
        >
          <Property
            title="Fix form validation"
            description="Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris."
            chip={<Chip label="In progress" color="warning" />}
            image="/static/img/unsplash/unsplash-1.jpg"
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6,
            xl: 3,
          }}
        >
          <Property
            title="New company logo"
            description="Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum."
            chip={<Chip label="Paused" color="error" />}
            image="/static/img/unsplash/unsplash-2.jpg"
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6,
            xl: 3,
          }}
        >
          <Property
            title="Upgrade to latest Maps API"
            description="Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris."
            chip={<Chip label="Finished" color="success" />}
            image="/static/img/unsplash/unsplash-3.jpg"
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6,
            xl: 3,
          }}
        >
          <Property
            title="Refactor backend templates"
            description="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa."
            chip={<Chip label="Paused" color="error" />}
            image="/static/img/unsplash/unsplash-4.jpg"
          />
        </Grid>
      </Grid>

      {openNewDialog && (
        <Dialog
          open={openNewDialog}
          onClose={() => setOpenNewDialog(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Typography variant="h3">Create</Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="P"
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ m: 2 }}>
            <Button onClick={() => setOpenNewDialog(false)} color="warning">
              Cancel
            </Button>
            <Button
              onClick={() => setOpenNewDialog(false)}
              color="primary"
              variant="contained"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </React.Fragment>
  );
}

export default Properties;
