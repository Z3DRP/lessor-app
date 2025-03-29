import {
  Avatar,
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
import { spacing, Stack, useTheme } from "@mui/system";
import {
  CalendarDays,
  CircleCheckBig,
  CircleDotDashed,
  CircleEqual,
  CircleOff,
  Eye,
  Pencil,
  TrashIcon,
} from "lucide-react";
import { determineTaskStatus, Task, taskStatusDate } from "@/types/task";
import { useState } from "react";
import { formattedAddress } from "@/types/property";
import { EmptyUserAvatar, InitialAvatar } from "../ui/Avatars";
import { PersonOff } from "@mui/icons-material";
import {
  CompletedStatusChip,
  FailedStatusChip,
  PausedStatusChip,
  PrimaryChip,
  ScheduledStatusChip,
  SecondaryChip,
  StartedStatusChip,
  YellowChip,
} from "./taskChips";
import { TaskStatus } from "enums/enums";
import { ExpandMore } from "../ui/ExpandMore";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useAuth from "@/hooks/useAuth";
import { LinearLoading } from "../ui/Loaders";
import EmptyCard from "../ui/EmptyCard";

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

const TaskWorkers = styled.div`
  margin-top: ${(props) => props.theme.spacing(1)};
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

interface TaskProps {
  task: Task;
  onEdit: (task: Task) => Promise<void>;
  onDelete: (task: Task) => Promise<void>;
}

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

const TaskItem = ({ task, onEdit, onDelete }: TaskProps) => {
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
              <Grid>{getStatusChip(task)}</Grid>
              <Grid>
                <SecondaryChip label={task?.category || "Maintenance"} />
              </Grid>
            </Grid>
          </Grid>
          <Grid>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyItems="flex-end"
            >
              <Grid>
                <CircleDotDashed
                  size={18}
                  color={theme.palette.secondary.main}
                  onClick={() => {
                    onEdit(task);
                  }}
                />
              </Grid>
              <Grid>
                <CircleCheckBig
                  size={18}
                  onClick={() => onDelete(task)}
                  color={theme.palette.secondary.main}
                />
              </Grid>
              <Grid>
                <CircleEqual
                  size={18}
                  onClick={() => onDelete(task)}
                  color={theme.palette.secondary.main}
                />
              </Grid>
              <Grid>
                <CircleOff
                  size={18}
                  onClick={() => onDelete(task)}
                  color={theme.palette.secondary.main}
                />
              </Grid>
              <Grid>
                <ExpandMore
                  expand={expanded}
                  onClick={() => setExpanded(!expanded)}
                  color="secondary"
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <Eye size={18} />
                </ExpandMore>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 1 }}>
          <TaskTitle variant="h4" sx={{ mt: 1 }} gutterBottom>
            <strong>{task?.name}</strong>,
          </TaskTitle>
          <Typography variant="body1">{` ${formattedAddress(
            task?.property
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
      <Stack direction="row" spacing={2} sx={{ ml: 3, mb: 2 }}>
        <Button startIcon={<CircleDotDashed />}>Start</Button>
        <Button color="success" startIcon={<CircleCheckBig />}>
          Complete
        </Button>
        <Button color="warning" startIcon={<CircleEqual />}>
          Pause
        </Button>
        <Button color="error" startIcon={<CircleOff />}>
          Fail
        </Button>
      </Stack>
    </TaskWrapper>
  );
};

export default function TaskList() {
  const { user } = useAuth();
  const { tasks, status } = useSelector((state: RootState) => state.task);
  const handleDelete = async () => console.log("delete");
  const handleEdit = async () => console.log("edit");

  return status === "loading" ? (
    <LinearLoading />
  ) : (
    <Card>
      <CardHeader title="Tasks" />
      <CardContent>
        {tasks.length > 0 ? (
          tasks.map((t) => (
            <TaskItem
              key={t.tid}
              task={t}
              onDelete={handleDelete}
              onEdit={handleEdit}
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
  );
}
