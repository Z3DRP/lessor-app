import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export interface DeletePropertyDialogProps {
  propertyId: string;
  open: boolean;
  handleOpen: (isOpen: boolean) => void;
  // maybe make handleDelte just be a function that is called an set it to pass it the id when passing
  // // the handler to the component
  handleDelete: (propertyId: string) => void;
}

export default function DeletePropertyDialog({
  propertyId,
  open,
  handleOpen,
  handleDelete,
}: DeletePropertyDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={() => handleOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Use Google's location service?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleOpen(false)} color="primary">
          Disagree
        </Button>
        <Button
          onClick={() => handleDelete(propertyId)}
          color="primary"
          autoFocus
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
