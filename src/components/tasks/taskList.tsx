import {
  AvatarGroup as MuiAvatarGroup,
  Card as MuiCard,
  Button,
  CardContent as MuiCardContent,
  CardHeader,
  Collapse,
  Divider as MuiDivider,
  Grid2 as Grid,
  Typography as MuiTypography,
} from "@mui/material";
import styled from "@emotion/styled";
import { spacing, Stack } from "@mui/system";
import {
  CalendarDays,
  CircleCheckBig,
  CircleDotDashed,
  CircleEqual,
  CircleOff,
  Eye,
} from "lucide-react";
import { determineTaskStatus, Task, taskStatusDate } from "@/types/task";
import { useState } from "react";
import { formattedAddress, Property } from "@/types/property";
import { InitialAvatar } from "../ui/Avatars";
import {
  BlueGreyChip,
  CompletedStatusChip,
  FailedStatusChip,
  PausedStatusChip,
  PrimaryChip,
  ScheduledStatusChip,
  StartedStatusChip,
} from "./taskChips";
import { TaskStatus } from "enums/enums";
import { ExpandMore } from "../ui/ExpandMore";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import EmptyCard from "../ui/EmptyCard";
import { updateTask } from "@/redux/slices/tasksSlice";
import { TransitionAlert } from "../ui/CustomAlerts";
import TaskStatusUpdateDialog, {
  StatusConfirmation,
} from "../task-dialogs/TaskStatusUpdateDialog";
import { useSnackbar } from "notistack";
import { Icon } from "@iconify/react";
import { useTheme } from "@emotion/react";
import { ButtonSpan } from "../styled/StyledCmp";

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)<{ pb?: number }>`
  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)};
  }
`;

const AvatarGroup = styled(MuiAvatarGroup)`
  display: inline-flex;
`;

const Divider = styled(MuiDivider)(spacing);

const TaskWrapper = styled(Card)`
  border: 1px solid ${(props) => props.theme.palette.grey[300]};
  margin-bottom: ${(props) => props.theme.spacing(4)};
  cursor: grab;

  &:hover {
    background: ${(props) => props.theme.palette.background.default};
  }
`;

const TaskWrapperContent = styled(CardContent)`
  position: relative;
  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)};
  }
`;

const TaskAvatars = styled.div`
  margin-top: ${(props) => props.theme.spacing(1)};
`;

const TaskStatusDateIcon = styled(CalendarDays)`
  color: ${(props) => props.theme.palette.grey[500]};
  vertical-align: middle;
`;

const TaskNotifications = styled.div`
  display: flex;
  position: absolute;
  bottom: ${(props) => props.theme.spacing(1)};
  right: ${(props) => props.theme.spacing(4)};
`;

const TaskNotificationsDate = styled.div`
  color: ${(props) => props.theme.palette.grey[500]};
  font-weight: 800;
  margin-left: ${(props) => props.theme.spacing(1)};
  margin-right: ${(props) => props.theme.spacing(1)};
  padding-bottom: ${(props) => props.theme.spacing(1)};
  line-height: 1.95;
`;

const TaskHiddenFooter = styled.div`
  bottom: ${(props) => props.theme.spacing(12)};
  margin-left: ${(props) => props.theme.spacing(4)};
  margin-right: ${(props) => props.theme.spacing(4)};
`;

const Typography = styled(MuiTypography)(spacing);

const TaskTitle = styled(Typography)`
  font-weight: 600;
  font-size: 15px;
  margin-right: ${(props) => props.theme.spacing(10)};
`;

const getStatusChip = (task: Task) => {
  const tStatus = determineTaskStatus(task);
  switch (tStatus) {
    case TaskStatus.Started:
      return <StartedStatusChip />;
    case TaskStatus.Completed:
      return <CompletedStatusChip />;
    case TaskStatus.Paused:
      return <PausedStatusChip />;
    case TaskStatus.Failed:
      return <FailedStatusChip />;
    default:
      return <ScheduledStatusChip />;
  }
};

type statuses = "start" | "pause" | "fail" | "complete";

interface TaskProps {
  task: Task;
  onStart: (task: Task, status: statuses) => void;
  onComplete: (task: Task, status: statuses) => void;
  onPause: (task: Task, status: statuses) => void;
  onFail: (task: Task, status: statuses) => void;
}

const TaskItem = ({
  task,
  onStart,
  onComplete,
  onPause,
  onFail,
}: TaskProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const theme = useTheme();

  return (
    <TaskWrapper mb={4}>
      <TaskWrapperContent>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Grid>
            <Grid container spacing={1}>
              <Grid>
                <PrimaryChip label={task?.priority} />
              </Grid>
              <Grid>{getStatusChip(task)}</Grid>
              <Grid>
                <BlueGreyChip label={task?.category || "Maintenance"} />
              </Grid>
            </Grid>
          </Grid>
          <Grid>
            <ExpandMore
              expand={expanded}
              onClick={() => setExpanded(!expanded)}
              color="secondary"
              aria-expanded={expanded}
              aria-label="show more"
            >
              <Icon
                color={theme.palette.secondary.main}
                icon="ic:twotone-remove-red-eye"
                fontSize={26}
              />
            </ExpandMore>
          </Grid>
        </Grid>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 1 }}>
          <TaskTitle variant="h4" sx={{ mt: 1 }} gutterBottom>
            <strong>{task?.name}</strong>,
          </TaskTitle>
          <Typography variant="body1">{` ${formattedAddress(
            task.property!
          )}`}</Typography>
        </Stack>

        <TaskAvatars>
          <AvatarGroup max={4}>
            {task?.worker ? (
              <>
                <InitialAvatar
                  firstName={task?.worker?.user?.firstName || null}
                  lastName={task?.worker?.user?.lastName || null}
                />
              </>
            ) : (
              <Typography mt={2}>Not Assigned</Typography>
            )}
          </AvatarGroup>
        </TaskAvatars>

        {!!task.estimatedCost && task.estimatedCost >= 0 && (
          <TaskNotifications>
            <TaskStatusDateIcon size={22} />
            <TaskNotificationsDate>
              {taskStatusDate(task)}
            </TaskNotificationsDate>
          </TaskNotifications>
        )}
      </TaskWrapperContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <TaskHiddenFooter>
          <Typography variant="body2" sx={{ m: 2, p: 2 }}>
            {task.details}
          </Typography>
        </TaskHiddenFooter>
      </Collapse>
      <Stack direction="row" spacing={2} sx={{ ml: 3, mb: 3 }}>
        <Button
          onClick={() => onStart(task, "start")}
          disabled={
            determineTaskStatus(task) === TaskStatus.Completed ||
            determineTaskStatus(task) === TaskStatus.Failed
          }
        >
          <Icon
            icon="material-symbols:line-start-circle-outline-rounded"
            fontSize={28}
          />
          <ButtonSpan>Start</ButtonSpan>
        </Button>
        <Button
          onClick={() => onComplete(task, "complete")}
          color="success"
          disabled={
            determineTaskStatus(task) === TaskStatus.Scheduled ||
            determineTaskStatus(task) === TaskStatus.Failed
          }
        >
          <Icon icon="ic:baseline-check-circle-outline" fontSize={28} />
          <ButtonSpan>Complete</ButtonSpan>
        </Button>
        <Button
          onClick={() => onPause(task, "pause")}
          color="warning"
          disabled={
            determineTaskStatus(task) === TaskStatus.Scheduled ||
            determineTaskStatus(task) === TaskStatus.Failed ||
            determineTaskStatus(task) === TaskStatus.Completed
          }
        >
          <Icon
            icon="material-symbols:pause-circle-outline-rounded"
            fontSize={28}
          />
          <ButtonSpan>Pause</ButtonSpan>
        </Button>
        <Button
          onClick={() => onFail(task, "fail")}
          color="error"
          disabled={
            determineTaskStatus(task) === TaskStatus.Scheduled ||
            determineTaskStatus(task) === TaskStatus.Completed ||
            determineTaskStatus(task) === TaskStatus.Scheduled
          }
        >
          <Icon icon="ic:round-nearby-error" fontSize={28} />
          <ButtonSpan>Fail</ButtonSpan>
        </Button>
      </Stack>
    </TaskWrapper>
  );
};

export type TaskListProps = {
  userId: string;
  tasks: Task[];
  location: Property | null;
};

export default function TaskList({ userId, tasks, location }: TaskListProps) {
  const [error, setError] = useState<string | null>(null);
  const [openStartDialog, setOpenStartDialog] = useState<boolean>(false);
  const [openCompleteDialog, setOpenCompleteDialog] = useState<boolean>(false);
  const [openPauseDialog, setOpenPauseDialog] = useState<boolean>(false);
  const [openFailDialog, setOpenFailDialog] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch<AppDispatch>();

  const setTask = (task: Task) => setSelectedTask(task);

  const handleStatusChange = (status: statuses) => (task: Task) => {
    setTask(task);
    switch (status) {
      case "start":
        setOpenStartDialog(true);
        break;
      case "complete":
        setOpenCompleteDialog(true);
        break;
      case "pause":
        setOpenPauseDialog(true);
        break;
      case "fail":
        setOpenFailDialog(true);
        break;
    }
  };

  const handleUpdateTaskStatus =
    (status: TaskStatus) => async (confirmation: StatusConfirmation) => {
      try {
        const task = {
          // only add worker id if task is being started
          ...(status === TaskStatus.Started ? { workerId: userId } : {}),
          ...(status === TaskStatus.Paused || status === TaskStatus.Failed
            ? { reason: confirmation?.reason }
            : {}),
          ...confirmation.task,
          ...(status === TaskStatus.Started
            ? { startedAt: new Date().toISOString() }
            : {}),
          ...(status === TaskStatus.Completed
            ? { completedAt: new Date().toISOString() }
            : {}),
          ...(status === TaskStatus.Failed
            ? { failedAt: new Date().toISOString() }
            : {}),
          ...(status === TaskStatus.Paused
            ? { pausedAt: new Date().toISOString() }
            : {}),
        };
        const res = await dispatch(updateTask({ data: task })).unwrap();
        if (res) {
          enqueueSnackbar(`task moved to ${status}`, { variant: "success" });
          return;
        }
      } catch (err: any) {
        setError(err?.error || err?.message || "something went wrong");
      }
    };

  return (
    <>
      <Card sx={{ maxHeight: 800, overflow: "auto" }}>
        <CardHeader
          title={
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6">
                {location != null
                  ? `${formattedAddress(location)}`
                  : `All Tasks`}
              </Typography>
              <Typography variant="subtitle1">
                {location != null
                  ? ` - ${tasks?.length} tasks`
                  : ` - (${tasks?.length ?? 0})`}
              </Typography>
            </Stack>
          }
        />
        <CardContent>
          <TransitionAlert
            variant="error"
            message={error ?? ""}
            isOpen={error != null}
            closeHandler={() => setError(null)}
          />
          {!error && tasks.length > 0 ? (
            tasks.map((t) => (
              <TaskItem
                key={t.tid}
                task={t}
                onStart={handleStatusChange("start")}
                onComplete={handleStatusChange("complete")}
                onPause={handleStatusChange("pause")}
                onFail={handleStatusChange("fail")}
              />
            ))
          ) : (
            <EmptyCard
              title="No Tasks"
              body="this location does not have any tasks"
            />
          )}
        </CardContent>
      </Card>

      <TaskStatusUpdateDialog
        status="start"
        task={selectedTask}
        open={openStartDialog}
        openSetter={setOpenStartDialog}
        onConfirm={handleUpdateTaskStatus(TaskStatus.Started)}
      />

      <TaskStatusUpdateDialog
        status="complete"
        task={selectedTask}
        open={openCompleteDialog}
        openSetter={setOpenCompleteDialog}
        onConfirm={handleUpdateTaskStatus(TaskStatus.Completed)}
      />

      <TaskStatusUpdateDialog
        status="pause"
        task={selectedTask}
        open={openPauseDialog}
        openSetter={setOpenPauseDialog}
        onConfirm={handleUpdateTaskStatus(TaskStatus.Paused)}
      />

      <TaskStatusUpdateDialog
        status="fail"
        task={selectedTask}
        open={openFailDialog}
        openSetter={setOpenFailDialog}
        onConfirm={handleUpdateTaskStatus(TaskStatus.Failed)}
      />
    </>
  );
}
