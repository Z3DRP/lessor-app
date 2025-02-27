import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  Avatar,
  Button,
  CardActions,
  Grid2 as Grid,
  IconButton,
  Link,
} from "@mui/material";
import { Eye, Pencil, TrashIcon } from "lucide-react";
import { Add as AddIcon } from "@mui/icons-material";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card, CardContent, CardMedia, Divider } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import Chip from "@/components/ui/Chips";
import { Address, Property } from "@/types/property";
import { NewPropertyDialog } from "@/components/property-dialogs/NewPropertyDialog";
import useAuth from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createProperty, fetchProperties } from "@/redux/slices/properties";
import { PropertyStatus } from "enums/enums";
import { useSnackbar } from "notistack";

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
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { unqueueSnackbar } = useSnackbar();
  const [openNewDialog, setOpenNewDialog] = useState<boolean>(false);
  const handleOpenNewDialog = () => setOpenNewDialog(true);
  //const [properties, setProperties] = useState<Property[]>();
  const handleGetProperties = () => {
    dispatch(fetchProperties(user?.alessorId ?? "[invalid-id]"));
  };

  const handleCreateProperty = async (data: Partial<Property>) => {
    try {
      const res = await dispatch(
        createProperty({ data: { ...data } })
      ).unwrap();
      return { success: true, data: res };
    } catch (err) {
      return { success: false, err };
    }
  };

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
              onClick={handleOpenNewDialog}
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

      <NewPropertyDialog
        lessorId={user?.uid ?? "[invalid-id]"}
        open={openNewDialog}
        openSetter={setOpenNewDialog}
        createPropertyHandler={handleCreateProperty}
      />
    </React.Fragment>
  );
}

export default Properties;
