import { Task } from "@/types/task";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { TransitionAlert } from "../ui/CustomAlerts";

type statuses = "start" | "pause" | "fail" | "complete";

export type StatusConfirmation = {
  task: Task;
  reason?: string | null;
};

export type TaskStatusUpdateDialogProps = {
  status: statuses;
  task: Task | null;
  open: boolean;
  openSetter: (value: boolean) => void;
  onConfirm: (confirmation: StatusConfirmation) => Promise<void>;
};

type DialogContent = {
  title: string;
  body: string;
};

type ContentMap = {
  [key in statuses]: DialogContent;
};

const contents: ContentMap = {
  start: {
    title: "Start",
    body: "Starting this task will assign it to you. You will be responsible for the completion of this task. Do not start this task if you are not able to start immediately",
  },
  pause: {
    title: "Pause",
    body: "You are about to pause this task. This means it is not completed or failed but temporarily set asside. In order to pause the task you must specify a reason.",
  },
  fail: {
    title: "Fail",
    body: "You are about to update this task to failed, there must be a blocking condition for you to fail the task. Furthermore, you must also enter a reason for the failure.",
  },
  complete: {
    title: "Complete",
    body: "You are about to update this task to completed, please do not do so unless task was successfully finished.",
  },
};

const isPauseStatus = (status: statuses) => status === "pause";

const isFailStatus = (status: statuses) => status === "fail";

export default function TaskStatusUpdateDialog({
  status,
  open,
  task,
  openSetter,
  onConfirm,
}: TaskStatusUpdateDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [pausedReason, setPausedReason] = useState<string | null>(null);
  const [failedReason, setFailedReason] = useState<string | null>(null);
  const dContents: DialogContent = contents[status];

  const handleConfirm = async () => {
    if (isPauseStatus(status) && pausedReason == null) {
      setError("to mark a task as paused you need to enter a paused reason");
      return;
    }

    if (isFailStatus(status) && failedReason == null) {
      setError("to mark a task as failed you need to enter a failed reason");
      return;
    }

    if (task == null) {
      setError("task is null verify task and start over");
      return;
    }

    const confirmation: StatusConfirmation = {
      task: task,
      reason: isFailStatus(status)
        ? failedReason
        : isPauseStatus(status)
        ? pausedReason
        : null,
    };

    await onConfirm(confirmation);
  };

  return (
    <Dialog
      open={open}
      onClose={() => openSetter(false)}
      aria-labelledby="status-dialog"
      aria-describedby="status-dialog-description"
    >
      <DialogTitle id="status-dialog">
        <Typography variant="h4">{dContents.title} Task</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="status0dialog-description">
          <Typography gutterBottom>{dContents.body}</Typography>
          {status === "pause" && (
            <TextField
              label="Paused Reason"
              onClick={(e: any) => setPausedReason(e.target.value)}
            />
          )}

          {status === "fail" && (
            <TextField
              label="Failed Reason"
              onClick={(e: any) => setFailedReason(e.target.value)}
            />
          )}
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
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
