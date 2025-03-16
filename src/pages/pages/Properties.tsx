import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  Avatar,
  Button,
  CardActions,
  Chip,
  Collapse,
  Grid2 as Grid,
  IconButton,
  IconButtonProps,
  Link,
  styled,
} from "@mui/material";
import { Eye, Pencil, TrashIcon } from "lucide-react";
import { Add as AddIcon } from "@mui/icons-material";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card, CardContent, CardMedia, Divider } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import StatusChip from "@/components/ui/PropertyStatusChip";
import { Address, formattedAddress, Property } from "@/types/property";
import { NewPropertyDialog } from "@/components/property-dialogs/NewPropertyDialog";
import useAuth from "@/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  deleteProperty,
  fetchProperties,
  updateProperty,
} from "@/redux/slices/propertiesSlice";
import { useSnackbar } from "notistack";
import { LinearLoading } from "@/components/ui/Loaders";
import EmptyCard from "@/components/ui/EmptyCard";
import { PropertyStatus } from "enums/enums";
import { EditPropertyDialog } from "@/components/property-dialogs/EditPropertyDialog";
import PropertyViewAccordian from "@/components/property/PropertyViewAccordion";
import { ExpandMore } from "@/components/ui/ExpandMore";
import { Stack } from "@mui/system";
import DeletePropertyDialog from "@/components/property-dialogs/DeletePropertyDialog";

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

type LessorPropertyProps = {
  property: Property;
  image: string | null;
  chip: JSX.Element;
  onEdit: (selectedProperty: Property) => Promise<void>;
  onDelete: (selectedProperty: Property) => Promise<void>;
};

const LessorProperty: React.FC<LessorPropertyProps> = ({
  property,
  image,
  chip,
  onEdit,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const getOccupancyAvatars = (occupancy: number) => {
    const avatars = [];
    for (let i = 0; i < occupancy; i++) {
      avatars.push(
        <Avatar key={i} alt="Avatar" src="/static/img/avatars/default.png" />
      );
    }
    return avatars;
  };

  return (
    <Card>
      {property?.imageUrl ? (
        <CardMedia image={property?.imageUrl} title="lessor-property-image" />
      ) : null}
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {property?.address?.street}, {property?.address?.city},{" "}
          {property?.address?.state}
        </Typography>

        {chip}

        <Stack spacing={0.5}>
          <Typography variant="body2" fontSize={16}>
            Baths:
          </Typography>
          <Typography variant="body2" color="textSecondary" fontSize={16}>
            {property.baths}
          </Typography>
          <Typography variant="body2" fontSize={16}>
            Beds:
          </Typography>
          <Typography variant="body2" color="textSecondary" fontSize={16}>
            {property.bedrooms}
          </Typography>
          <Typography variant="body2" fontSize={16}>
            Available:{" "}
          </Typography>
          <Typography variant="body2" color="textSecondary" fontSize={16}>
            {property?.isAvailable ? "Yes" : "No"}
          </Typography>
        </Stack>

        <AvatarGroup max={3}>
          {getOccupancyAvatars(property?.maxOccupancy ?? 1)}
        </AvatarGroup>
      </CardContent>
      <CardActions>
        <IconButton
          size="small"
          color="secondary"
          onClick={() => {
            onEdit(property);
          }}
        >
          <Pencil />
        </IconButton>
        <IconButton
          size="small"
          color="secondary"
          onClick={() => {
            onDelete(property);
          }}
        >
          <TrashIcon />
        </IconButton>

        <ExpandMore
          expand={expanded}
          onClick={() => setExpanded(!expanded)}
          color="secondary"
          aria-expanded={expanded}
          aria-label="show more"
        >
          <Eye />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container direction="row" rowSpacing={2}>
            <Grid container size={{ xs: 12 }} spacing={1}>
              <Grid>
                <Typography sx={{ mb: 2 }}>SqFt:</Typography>{" "}
              </Grid>
              <Grid>
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  {property?.squareFootage}
                </Typography>
              </Grid>
            </Grid>
            <Grid container size={{ xs: 12 }} spacing={1}>
              <Grid>
                <Typography sx={{ mb: 2 }}>Tax Rate:</Typography>{" "}
              </Grid>
              <Grid>
                <Typography color="textSecondary">
                  {property?.taxRate}
                </Typography>
              </Grid>
            </Grid>
            <Grid container size={{ xs: 12 }} spacing={1}>
              <Grid>
                <Typography sx={{ mb: 2 }}>Tax Due:</Typography>{" "}
              </Grid>
              <Grid>
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  {property?.taxAmountDue}
                </Typography>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ mb: 2 }}>Notes:</Typography>
              <Typography mb={4} color="textSecondary" component="p">
                {property?.notes == null || property?.notes === ""
                  ? "No notes available"
                  : property?.notes}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};

function Properties() {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const [openNewDialog, setOpenNewDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [propertyToEdit, setPropertyToEdit] = useState<Property | undefined>();
  const [propertyToDelete, setPropertyToDelete] = useState<
    Property | undefined
  >();
  const [refreshPage, setRefreshPage] = useState<boolean>(true);
  const handleOpenNewDialog = () => setOpenNewDialog(true);
  const properties = useSelector(
    (state: RootState) => state.property.properties
  );

  const handleEditClick = async (property: Property) => {
    setPropertyToEdit(property);
    setOpenEditDialog(true);
  };

  const handleEdit = async (
    property?: Partial<Property>,
    address?: Address,
    file?: File
  ) => {
    try {
      let result;
      if (property) {
        result = await dispatch(
          updateProperty({
            updatedData: property,
            address: address,
            file: file,
          })
        ).unwrap();
      }
      console.log(result);

      return { success: true, msg: undefined };
    } catch (err: any) {
      return {
        success: false,
        msg: err.error || err.message || "an unexpected error ocurred",
      };
    }
  };

  const handleDeleteClick = async (property: Property) => {
    setPropertyToDelete(property);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async (propertyId: string) => {
    try {
      await dispatch(deleteProperty({ id: propertyId }));
      return { success: true, msg: "" };
    } catch (err: any) {
      return {
        success: false,
        msg: err.error ?? err.message ?? "something went wrong",
      };
    }
  };

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

    if (user && refreshPage) {
      handleFetch();
      setRefreshPage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, user, dispatch, refreshPage]);

  return (
    <React.Fragment>
      <Helmet title="Properties" />
      <Grid justifyContent="space-between" container spacing={10}>
        <Grid>
          <Typography variant="h3" gutterBottom display="inline">
            Properties
          </Typography>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/dashboard">
              Dashboard
            </Link>
            <Link component={NavLink} to="/dashboard">
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
        <LinearLoading />
      ) : (
        <>
          {properties.length > 0 ? (
            <Grid container spacing={6}>
              {properties &&
                properties.map((p: Property) => (
                  <Grid key={p.pid} size={{ xs: 12, lg: 6, xl: 3 }}>
                    <LessorProperty
                      property={p}
                      image={p.imageUrl || null}
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
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
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
              refreshSetter={() => setRefreshPage(true)}
            />
          )}

          {user && propertyToDelete && (
            <DeletePropertyDialog
              key={propertyToDelete?.pid}
              property={propertyToDelete}
              address={formattedAddress(propertyToDelete)}
              open={openDeleteDialog}
              openSetter={setOpenDeleteDialog}
              handleDelete={handleDelete}
              refreshSetter={() => setRefreshPage(true)}
            />
          )}

          {user && propertyToEdit && (
            <EditPropertyDialog
              key={propertyToEdit.id}
              property={propertyToEdit ?? null}
              open={openEditDialog}
              openSetter={setOpenEditDialog}
              handleEdit={handleEdit}
              refreshSetter={() => setRefreshPage(true)}
            />
          )}
        </>
      )}
    </React.Fragment>
  );
}

export default Properties;
