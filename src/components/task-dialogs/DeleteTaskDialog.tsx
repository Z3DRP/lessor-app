import { RequestDto } from "@/types/requestResult";
import { Task } from "@/types/task";
import {
  Grid2 as Grid,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { TransitionAlert } from "../ui/CustomAlerts";

export type DeleteTaskDialogProps = {
  task: Task | Partial<Task>;
  open: boolean;
  openSetter: (isOpen: boolean) => void;
  handleDelete: (taskId: string) => Promise<RequestDto>;
  refreshPage: () => void;
};
export default function DeleteTaskDialog({
  task,
  open,
  openSetter,
  handleDelete,
  refreshPage,
}: DeleteTaskDialogProps) {
  const [error, setError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    try {
      if (!task.tid) {
        setError("task id is required");
        return;
      }
      const { success, msg } = await handleDelete(task.tid);

      if (!success) {
        setError(msg ?? "something went wrong");
        enqueueSnackbar("an error occurred while deleting task", {
          variant: "error",
        });
      }

      enqueueSnackbar("task successfully deleted", { variant: "success" });
      refreshPage();
      openSetter(false);
    } catch (err: any) {
      setError(`${err.message ?? err.error}`);
      enqueueSnackbar("an error occurred while deleting task", {
        variant: "error",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => openSetter(false)}
      aria-labelledBy="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">Delete</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          <Typography gutterBottom>
            You are about to delete the following task:
          </Typography>
          <Grid container direction="row" spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography color="textPrimary" gutterBottom>
                <strong>{task.name}</strong>
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography color="textPrimary" gutterBottom>
                {task.details}
              </Typography>
            </Grid>
          </Grid>
          <Typography>
            This data will be lostk, Do you wish to continue?
          </Typography>
        </DialogContentText>
        <TransitionAlert
          isOpen={error != null}
          variant="error"
          message={error ?? ""}
          closeHandler={() => setError(null)}
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
          color="warning"
          variant="contained"
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
