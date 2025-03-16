import React, { useState, useEffect, ReactNode } from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { DollarSignIcon } from "lucide-react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { faker } from "@faker-js/faker";

import {
  Avatar,
  AvatarGroup as MuiAvatarGroup,
  Breadcrumbs as MuiBreadcrumbs,
  Box,
  Button,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Grid2 as Grid,
  Link,
  Typography as MuiTypography,
  Popover,
} from "@mui/material";
import { spacing } from "@mui/system";
import { green } from "@mui/material/colors";
import { Add as AddIcon } from "@mui/icons-material";
import { InitialAvatar } from "@/components/ui/Avatars";
import { TaskStatusChip } from "@/components/tasks/taskChips";
import { PriorityLevel, TaskStatus } from "enums/enums";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from "@/redux/slices/tasksSlice";
import useAuth from "@/hooks/useAuth";
import { LinearLoading } from "@/components/ui/Loaders";
import Error from "@/layouts/Error";
import { determineTaskStatus, Task } from "@/types/task";
import { getInitials } from "@/types/user";
import EmptyCard from "@/components/ui/EmptyCard";
import InfoPopover from "@/components/ui/InfoPopover";
import NewTaskDialog from "@/components/task-dialogs/NewTaskDialog";
import EditTaskDialog from "@/components/task-dialogs/EditTaskDialog";
import EditTaskDialog from "@/components/task-dialogs/EditTaskDialog";
import EditTaskDialog from "@/components/task-dialogs/EditTaskDialog";
import DeleteTaskDialog from "@/components/task-dialogs/DeleteTaskDialog";
import { enqueueSnackbar } from "notistack";
import { RequestDto } from "@/types/requestResult";
import { TransitionAlert } from "@/components/ui/CustomAlerts";

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

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

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

const TaskAmountIcon = styled(DollarSignIcon)`
  color: ${(props) => props.theme.palette.grey[500]};
  vertical-align: middle;
`;

const TaskNotifications = styled.div`
  display: flex;
  position: absolute;
  bottom: ${(props) => props.theme.spacing(4)};
  right: ${(props) => props.theme.spacing(4)};
`;

const TaskNotificationsAmount = styled.div`
  color: ${(props) => props.theme.palette.grey[500]};
  font-weight: 800;
  margin-left: ${(props) => props.theme.spacing(1)};
  margin-right: ${(props) => props.theme.spacing(1)};
  line-height: 1.95;
`;

const Typography = styled(MuiTypography)(spacing);

const TaskTitle = styled(Typography)`
  font-weight: 600;
  font-size: 15px;
  margin-right: ${(props) => props.theme.spacing(10)};
`;

const mockItems2 = [
  {
    id: faker.datatype.uuid(),
    title: "Google Adwords best practices",
    badges: [1],
    notifications: 609.82,
    avatars: [2, 3],
  },
  {
    id: faker.datatype.uuid(),
    title: "Stripe payment integration",
    badges: [1],
    notifications: 0,
    avatars: [2],
  },
];

interface Column {
  title: string;
  level: PriorityLevel;
  description: string;
  items: Task[];
}

const lowColId = faker.datatype.uuid();
const medColId = faker.datatype.uuid();
const hiColId = faker.datatype.uuid();

//maybe define them here but then remove the items and then use below in the state
const priorityColumns: Record<string, Column> = {
  [lowColId]: {
    title: "Low",
    level: PriorityLevel.Low,
    description: "Tasks in this bucket will be completed last",
    items: [],
  },
  [medColId]: {
    title: "Medium",
    level: PriorityLevel.Medium,
    description: "Tasks in this bucket will be completed before the lowest",
    items: [],
  },
  [hiColId]: {
    title: "High",
    level: PriorityLevel.High,
    description:
      "Tasks in this bucket will be completed before any other, unless marked as urgent",
    items: [],
  },
};

const onDragEnd = (result: DropResult, columns: any, setColumns: any) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });

    const updatedTasks = columns[destination.droppableId];
    if (updatedTasks) {
      //  make api call to update task priorities
    }
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

interface LaneProps {
  column: {
    title: string;
    level: PriorityLevel;
    description: string;
    items: Task[];
  };
  children: ReactNode;
  onAddTask: (priority: PriorityLevel) => void;
}

const Lane = ({ column, children, onAddTask }: LaneProps) => {
  return (
    <Grid
      size={{
        xs: 12,
        lg: 4,
        xl: 4,
      }}
    >
      <Card mb={6}>
        <CardContent pb={0}>
          <Grid
            container
            display="flex"
            justifyItems="center"
            alignItems="center"
            spacing={1}
            direction="row"
            sx={{ mb: 2 }}
          >
            <Grid>
              <Typography variant="h6">{column.title}</Typography>
            </Grid>
            <Grid>
              <InfoPopover message={column.description} />
            </Grid>
          </Grid>
          {children}
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => onAddTask(column.level)}
          >
            <AddIcon />
            Add new task
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

interface TaskProps {
  task: Task;
}

const TaskItem = ({ task }: TaskProps) => {
  return (
    <TaskWrapper mb={4}>
      <TaskWrapperContent>
        <TaskStatusChip status={determineTaskStatus(task)} />

        <TaskTitle variant="body1" sx={{ mt: 1 }} gutterBottom>
          {task?.name}
        </TaskTitle>

        <TaskAvatars>
          <AvatarGroup max={3}>
            <InitialAvatar
              initials={getInitials(
                task.worker?.user?.firstName ?? "",
                task.worker?.user?.lastName ?? ""
              )}
            />
          </AvatarGroup>
        </TaskAvatars>

        {!!task.estimatedCost && task.estimatedCost >= 0 && (
          <TaskNotifications>
            <TaskAmountIcon />
            <TaskNotificationsAmount>
              {task.estimatedCost}
            </TaskNotificationsAmount>
          </TaskNotifications>
        )}
      </TaskWrapperContent>
    </TaskWrapper>
  );
};

function Tasks() {
  const [columns, setColumns] = useState(priorityColumns);
  const [documentReady, setDocumentReady] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, status } = useSelector((state: RootState) => state.task);
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [openNewDialog, setOpenNewDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | Partial<Task> | null>(
    null
  );
  const [taskToDelete, setTaskToDelete] = useState<Task | Partial<Task> | null>(
    null
  );
  const [refreshPage, setRefreshPage] = useState<boolean>(false);
  const [selectedColumnPriority, setSelectedColumnPriority] =
    useState<PriorityLevel | null>(null);

  useEffect(() => {
    if (status === "idle") {
      try {
        const results = dispatch(
          fetchTasks({ alsrId: user?.Uid, page: 1, limit: 30 })
        ).unwrap();
        console.log("results", results);
      } catch (err: any) {
        console.error("error fetching tasks ", err);
        setError(err.message || "unkown error");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.Uid, refreshPage]);

  useEffect(() => {
    const sortedTasks = tasks.sort(
      (t1, t2) =>
        t1.scheduledAt.getUTCMilliseconds() -
        t2.scheduledAt.getUTCMilliseconds()
    );

    setColumns((prev) => ({
      ...prev,
      [lowColId]: {
        ...prev[lowColId],
        items: sortedTasks.filter(
          (t: Task) => t.priority === PriorityLevel.Low
        ),
      },
      [medColId]: {
        ...prev[medColId],
        items: sortedTasks.filter(
          (t: Task) => t.priority === PriorityLevel.Medium
        ),
      },
      [hiColId]: {
        ...prev[hiColId],
        items: sortedTasks.filter(
          (t: Task) => t.priority === PriorityLevel.High
        ),
      },
    }));
  }, [tasks, refreshPage]);

  useEffect(() => {
    if (status !== "loading") {
      setDocumentReady(true);
    }
  }, [status]);

  if (status === "loading") {
    return <LinearLoading />;
  }

  // if (status === "failed") {
  //   return (
  //     <Error>
  //       <Typography>Failed to fetch tasks</Typography>
  //     </Error>
  //   );
  // }

  const handleAddTask = (columnPriority: PriorityLevel) => {
    setSelectedColumnPriority(columnPriority);
    setOpenNewDialog(true);
  };

  const handleSave = async (task: Partial<Task>): Promise<RequestDto> => {
    try {
      const result = await dispatch(createTask({ data: task })).unwrap();
      return { success: true, msg: null, data: result };
    } catch (err: any) {
      return {
        success: false,
        msg: err?.message ?? `${JSON.stringify(err)}`,
        data: null,
      };
    }
  };

  const handleEdit = async (
    task: Task | Partial<Task>
  ): Promise<RequestDto> => {
    try {
      const result = await dispatch(updateTask({ data: task })).unwrap();
      return { success: true, msg: null, data: result };
    } catch (err: any) {
      return {
        success: false,
        msg: err.message || "an unexpected error occurred",
        data: null,
      };
    }
  };

  const handleDelete = async (taskId: string): Promise<RequestDto> => {
    try {
      await dispatch(deleteTask({ id: taskId })).unwrap();
      return { success: true, msg: null, data: null };
    } catch (err: any) {
      return {
        success: false,
        msg: err.message || "an unexpected error occurred",
        data: null,
      };
    }
  };

  return (
    <React.Fragment>
      <Helmet title="Tasks" />
      <Typography variant="h3" gutterBottom display="inline">
        Tasks
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/dashboard">
          Dashboard
        </Link>
        <Link component={NavLink} to="/dashboard">
          Pages
        </Link>
        <Typography>Tasks</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        {error && (
          <TransitionAlert
            variant="error"
            message={error}
            isOpen={error != null}
            closeHandler={() => setError(null)}
          />
        )}
        {!!documentReady && (
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            {Object.entries(columns)
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .filter(([_, col]: [string, Column]) => col.title)
              .map(([columnId, column]) => (
                <Lane key={columnId} column={column} onAddTask={handleAddTask}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            minHeight: 50,
                          }}
                        >
                          {column.items.length === 0 ? (
                            <EmptyCard
                              title="Empty"
                              body="no tasks have been created for this priority bucket"
                            />
                          ) : (
                            <>
                              {column.items.map((item, index) => {
                                return (
                                  <Draggable
                                    key={item?.tid}
                                    draggableId={item?.tid || "inv"}
                                    index={index}
                                  >
                                    {(provided) => {
                                      return (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                        >
                                          <TaskItem task={item} />
                                        </div>
                                      );
                                    }}
                                  </Draggable>
                                );
                              })}
                            </>
                          )}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </Lane>
              ))}
          </DragDropContext>
        )}
      </Grid>

      {user && selectedColumnPriority && openNewDialog && (
        <NewTaskDialog
          lessorId={user.Uid}
          priority={selectedColumnPriority}
          open={openNewDialog}
          openHandler={setOpenNewDialog}
          onSave={handleSave}
          refreshState={() => setRefreshPage(true)}
        />
      )}

      {user && taskToEdit && openEditDialog && (
        <EditTaskDialog
          task={taskToEdit}
          open={openEditDialog}
          openSetter={setOpenEditDialog}
          handleEdit={handleEdit}
        />
      )}

      {user && taskToDelete && openDeleteDialog && (
        <DeleteTaskDialog
          task={taskToDelete}
          open={openDeleteDialog}
          openSetter={setOpenDeleteDialog}
          handleDelete={handleDelete}
          refreshPage={() => setRefreshPage(true)}
        />
      )}
    </React.Fragment>
  );
}

export default Tasks;
