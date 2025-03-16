import variants from "@/theme/variants";
import { Property } from "@/types/property";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { TransitionAlert } from "../ui/CustomAlerts";

export interface DeletePropertyDialogProps {
  property: Property;
  address: string;
  open: boolean;
  openSetter: (isOpen: boolean) => void;
  handleDelete: (propertyId: string) => Promise<any>;
  refreshSetter: () => void;
}

export default function DeletePropertyDialog({
  property,
  address,
  open,
  openSetter,
  handleDelete,
  refreshSetter,
}: DeletePropertyDialogProps) {
  const [error, setError] = useState<string | undefined>(undefined);
  const handleConfirmDelete = async () => {
    try {
      if (!property?.pid) {
        setError("property id is required");
        return;
      }
      const { success, msg } = await handleDelete(property.pid);
      if (!success) {
        setError(msg ?? "something went wrong");
        enqueueSnackbar("an error occurred while deleting property");
      }
      enqueueSnackbar("property deleted successfully", { variant: "success" });
    } catch (err: any) {
      setError(err?.message ? err.message : "something went wrong");
      enqueueSnackbar("an error occurred while deleting property", {
        variant: "error",
      });
    } finally {
      refreshSetter();
      openSetter(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => openSetter(false)}
      aria-labelledby="new-dialog-title"
      aria-describedby="new-dialog-description"
    >
      <DialogTitle id="new-dialog-title">Delete</DialogTitle>
      <DialogContent>
        <DialogContentText id="new-dialog-description">
          <Typography gutterBottom>
            You are about to delete the following property:
          </Typography>
          <Typography textAlign="center" color="textPrimary" gutterBottom>
            <strong>{address}</strong>
          </Typography>
          <Typography>
            This data will be lost, Do you wish to continue?
          </Typography>
        </DialogContentText>
        <TransitionAlert
          isOpen={error != undefined}
          variant="error"
          message={error ?? ""}
          closeHandler={() => setError(undefined)}
        />
      </DialogContent>
      <DialogActions sx={{ m: 2 }}>
        <Button
          onClick={() => openSetter(false)}
          color="secondary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleConfirmDelete()}
          color="primary"
          variant="contained"
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
