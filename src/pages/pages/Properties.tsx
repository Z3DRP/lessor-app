import React, { useEffect, useState } from "react";
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
import StatusChip from "@/components/ui/PropertyStatusChip";
import { Property } from "@/types/property";
import { NewPropertyDialog } from "@/components/property-dialogs/NewPropertyDialog";
import useAuth from "@/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchProperties } from "@/redux/slices/properties";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { LinearQuery } from "@/components/ui/Loaders";
import EmptyCard from "@/components/ui/EmptyCard";
import { PropertyStatus } from "enums/enums";
import { EditPropertyDialog } from "@/components/property-dialogs/EditPropertyDialog";

const propertyStatusColors = new Map<
  PropertyStatus,
  "info" | "primary" | "success" | "warning" | "error"
>([
  [PropertyStatus.Pending, "info"],
  [PropertyStatus.InProgress, "primary"],
  [PropertyStatus.Completed, "success"],
  [PropertyStatus.Paused, "warning"],
  [PropertyStatus.Unknown, "error"],
]);

type PropertyProps = {
  //image?: string;
  property: Property;
  chip: JSX.Element;
  selectedPropertySetter: (value: Property) => void;
};

const Property: React.FC<PropertyProps> = ({
  property,
  chip,
  selectedPropertySetter,
}) => {
  useEffect(() => console.log(property));
  return (
    <Card>
      {property?.imageUrl ? (
        <CardMedia image={property.imageUrl} title="lessor-property-image" />
      ) : null}
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {property?.address?.street}, {property?.address?.city},{" "}
          {property?.address?.state}
        </Typography>

        {chip}

        <Typography mb={4} color="textSecondary" component="p">
          {property?.notes == null || property?.notes === ""
            ? "No notes available"
            : property?.notes}
        </Typography>

        <AvatarGroup max={3}>
          <Avatar alt="Avatar" src="/static/img/avatars/default.png" />
          <Avatar alt="Avatar" src="/static/img/avatars/default.png" />
          <Avatar alt="Avatar" src="/static/img/avatars/default.png" />
        </AvatarGroup>
      </CardContent>
      <CardActions>
        <IconButton
          size="small"
          color="primary"
          onClick={() => selectedPropertySetter(property)}
        >
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
  const { enqueueSnackbar } = useSnackbar();
  const [openNewDialog, setOpenNewDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [selectedProperty, setSelectedProperty] = useState<Property>();
  const handleOpenNewDialog = () => setOpenNewDialog(true);
  const properties = useSelector(
    (state: RootState) => state.property.properties
  );
  const editPropertyHandler = (property: Property) => {};
  const deletePropertyHandler = (propertyId: string) => {};

  useEffect(() => {
    const handleFetch = async () => {
      try {
        setIsLoading(true);
        if (user) {
          const res = await dispatch(
            fetchProperties({ alsrId: user.Uid, page: 1 })
          ).unwrap();

          if (!res) {
            enqueueSnackbar("an error occurred while loading properties", {
              variant: "error",
            });
            setError("unexpected error could not load data");

            return;
          }
        }
      } catch (err: any) {
        enqueueSnackbar(
          "an unexpected error occurred while loading properties",
          { variant: "error" }
        );
        setError(err.error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      handleFetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, user, dispatch]);

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

      {isLoading ? (
        <LinearQuery />
      ) : (
        <>
          {properties.length > 0 ? (
            <Grid container spacing={6}>
              {properties &&
                properties.map((p: Property) => (
                  <Grid key={p.pid} size={{ xs: 12, lg: 6, xl: 3 }}>
                    <Property
                      property={p}
                      chip={
                        <StatusChip
                          label={p.status}
                          color={
                            propertyStatusColors.get(
                              p.status ?? PropertyStatus.Pending
                            ) ?? "primary"
                          }
                        />
                      }
                      selectedPropertySetter={setSelectedProperty}
                    />
                  </Grid>
                ))}
            </Grid>
          ) : (
            <EmptyCard
              title="No Properties"
              body="you have not created any properties yet"
            />
          )}

          {user && (
            <NewPropertyDialog
              lessorId={user?.Uid || "[invalid-id]"}
              open={openNewDialog}
              openSetter={setOpenNewDialog}
            />
          )}

          {user && selectedProperty && (
            <EditPropertyDialog
              property={selectedProperty}
              open={openEditDialog}
              openSetter={setOpenEditDialog}
            />
          )}
        </>
      )}
    </React.Fragment>
  );
}

export default Properties;
