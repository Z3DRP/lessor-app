import React, { useState, useEffect, ReactNode } from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { faker } from "@faker-js/faker";

import {
  AvatarGroup as MuiAvatarGroup,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Grid2 as Grid,
  Link,
  Typography as MuiTypography,
  Collapse,
  IconButton,
} from "@mui/material";
import { spacing, Stack, useTheme } from "@mui/system";
import { Add as AddIcon, PersonOff } from "@mui/icons-material";
import { EmptyUserAvatar, InitialAvatar } from "@/components/ui/Avatars";
import { TaskStatusChip } from "@/components/tasks/taskChips";
import { PriorityLevel } from "enums/enums";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
  updateTaskPriority,
} from "@/redux/slices/tasksSlice";
import useAuth from "@/hooks/useAuth";
import { LinearLoading } from "@/components/ui/Loaders";
import { determineTaskStatus, Task } from "@/types/task";
import EmptyCard from "@/components/ui/EmptyCard";
import InfoPopover from "@/components/ui/InfoPopover";
import NewTaskDialog from "@/components/task-dialogs/NewTaskDialog";
import EditTaskDialog from "@/components/task-dialogs/EditTaskDialog";
import DeleteTaskDialog from "@/components/task-dialogs/DeleteTaskDialog";
import { enqueueSnackbar } from "notistack";
import { RequestDto } from "@/types/requestResult";
import { TransitionAlert } from "@/components/ui/CustomAlerts";
import { ExpandMore } from "@/components/ui/ExpandMore";
import { formattedAddress } from "@/types/property";
import { fetchWorkers } from "@/redux/slices/workerSlice";
import { fetchProperties } from "@/redux/slices/propertiesSlice";
import { Icon, iconExists } from "@iconify/react";
import { ButtonSpan } from "@/components/styled/StyledCmp";

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

const TaskWorkers = styled.div`
  margin-top: ${(props) => props.theme.spacing(1)};
`;

const TaskAvatars = styled.div`
  margin-top: ${(props) => props.theme.spacing(1)};
`;

const TaskAmountIcon = styled(Icon)`
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

// type tdata = {
//   id: string;
//   name: string;
//   fInitial: string;
//   lInitial: string;
//   worker: { user: { firstName: string; lastName: string } };
//   estimatedCost: number;
// };
// const mockItems2: Task[] = [
//   {
//     id: 1,
//     name: "Google Adwords best practices",
//     worker: {
//       user: {
//         id: "1",
//         username: "usr",
//         firstName: "zach",
//         lastName: "palmer",
//         profileType: "alessor",
//         phone: "1231212345",
//         email: "email@gmail.com",
//       },
//     },
//     estimatedCost: 609.82,
//   },
//   {
//     id: faker.datatype.uuid(),
//     name: "Stripe payment integration",
//     fInitial: "Z",
//     lInitial: "P",
//     worker: { user: { firstName: "elias", lastName: "king" } },
//     estimatedCost: 450.32,
//   },
// ];

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
  [PriorityLevel.Low]: {
    title: "Low",
    level: PriorityLevel.Low,
    description:
      "Tasks in this bucket are of lowest priority and will be completed last after all other priority buckets are empty, unless a task takes precedence",
    items: [],
  },
  [PriorityLevel.Medium]: {
    title: "Medium",
    level: PriorityLevel.Medium,
    description:
      "Tasks in this bucket are mid priority will be completed before the lowest and after the highest, unless a task takes precedence",
    items: [],
  },
  [PriorityLevel.High]: {
    title: "High",
    level: PriorityLevel.High,
    description:
      "Tasks in this bucket are of the highest priority and will be completed before any other, unless marked as urgent, unless a task takes precedence",
    items: [],
  },
};

const onDragEnd = (
  result: DropResult,
  columns: any,
  setColumns: any,
  updateItem: (
    task: Task | Partial<Task>,
    priorityLevel: PriorityLevel
  ) => Promise<void>
) => {
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

    updateItem(removed, destColumn?.level);
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
              <InfoPopover
                title="Priority Level"
                message={column.description}
              />
            </Grid>
          </Grid>
          {children}
          <Button
            color="primary"
            variant="contained"
            fullWidth
            startIcon={
              <Icon icon="ic:baseline-add-circle-outline" fontSize={22} />
            }
            onClick={() => {
              console.log(column.level);
              onAddTask(column.level);
            }}
          >
            New Task
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

interface TaskProps {
  task: Task;
  onEdit: (task: Task) => Promise<void>;
  onDelete: (task: Task) => Promise<void>;
}

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
            <TaskStatusChip status={determineTaskStatus(task)} />
          </Grid>

          <Grid>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyItems="flex-end"
            >
              <Grid>
                <IconButton
                  size="small"
                  onClick={() => {
                    onEdit(task);
                  }}
                >
                  <Icon
                    color={theme.palette.secondary.main}
                    icon="ic:round-edit"
                    fontSize={26}
                  />
                </IconButton>
              </Grid>
              <Grid>
                <IconButton size="small" onClick={() => onDelete(task)}>
                  <Icon
                    icon="ic:baseline-delete-forever"
                    color={theme.palette.secondary.main}
                    fontSize={26}
                  />
                </IconButton>
              </Grid>
              <Grid>
                <ExpandMore
                  expand={expanded}
                  onClick={() => setExpanded(!expanded)}
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
          </Grid>
        </Grid>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TaskTitle variant="h4" sx={{ mt: 1 }} gutterBottom>
            <strong>{task?.name}</strong>,
          </TaskTitle>
          <Typography variant="body1">{` ${formattedAddress(
            task.property
          )}`}</Typography>
        </Stack>

        <TaskWorkers>
          {task?.worker ? (
            <Typography>Worker(s)</Typography>
          ) : (
            <Typography mt={2}>Not Assigned</Typography>
          )}
        </TaskWorkers>

        <TaskAvatars>
          <AvatarGroup max={4}>
            {task?.worker ? (
              <InitialAvatar
                firstName={task?.worker?.user?.firstName || null}
                lastName={task?.worker?.user?.lastName || null}
              />
            ) : (
              <EmptyUserAvatar
                icon={<Icon icon="ic:baseline-person-off" fontSize={28} />}
              />
            )}
          </AvatarGroup>
        </TaskAvatars>

        {!!task.estimatedCost && task.estimatedCost >= 0 && (
          <TaskNotifications>
            <TaskAmountIcon icon="ic:round-attach-money" fontSize={22} />
            <TaskNotificationsAmount>
              {task?.actualCost ? task?.actualCost : task?.estimatedCost}
            </TaskNotificationsAmount>
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
    </TaskWrapper>
  );
};

function Tasks() {
  const [columns, setColumns] = useState(priorityColumns);
  const [documentReady, setDocumentReady] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, status } = useSelector((state: RootState) => state.task);
  const { workers, status: workerStatus } = useSelector(
    (state: RootState) => state.worker
  );
  const { properties, status: propertyStatus } = useSelector(
    (state: RootState) => state.property
  );
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

  const handleEditClick = async (tsk: Task) => {
    setTaskToEdit(tsk);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = async (tsk: Task) => {
    setTaskToDelete(tsk);
    setOpenDeleteDialog(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reslt = await dispatch(
          fetchTasks({ alsrId: user?.uid, page: 1, limit: 30 })
        ).unwrap();
        console.log("tasks: ", reslt);
      } catch (err: any) {
        console.log("error fetching tasks ", err);
        setError(err?.message || err?.error || "unexpected error");
      }
    };

    const fetchWorkerData = async () => {
      try {
        const result = await dispatch(
          fetchWorkers({ alsrId: user?.uid, page: 1, limit: 30 })
        ).unwrap();
        console.log("workers: ", result);
      } catch (err: any) {
        setError(err?.message || "an unexpected error occurred");
      }
    };

    const fetchPropertyData = async () => {
      try {
        const result = await dispatch(
          fetchProperties({ alsrId: user?.uid, page: 1 })
        ).unwrap();
        console.log("properties: ", result);
      } catch (err: any) {
        setError(err?.message || "an unexpected error occurred");
      }
    };

    if (status === "idle") {
      fetchData().finally(() => setDocumentReady(true));
    }

    if (workerStatus === "idle") {
      fetchWorkerData();
    }

    if (propertyStatus === "idle") {
      fetchPropertyData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, refreshPage]);

  useEffect(() => {
    const sortColumns = () => {
      // const sortedTasks = tasks.sort(
      //   (t1, t2) => t1.scheduledAt - t2.scheduledAt
      // );

      setColumns((prev) => ({
        ...prev,
        [PriorityLevel.Low]: {
          ...prev[PriorityLevel.Low],
          items: tasks.filter((t: Task) => t.priority === PriorityLevel.Low),
        },
        [PriorityLevel.Medium]: {
          ...prev[PriorityLevel.Medium],
          items: tasks.filter((t: Task) => t.priority === PriorityLevel.Medium),
        },
        [PriorityLevel.High]: {
          ...prev[PriorityLevel.High],
          items: tasks.filter((t: Task) => t.priority === PriorityLevel.High),
        },
      }));
    };

    if (tasks.length > 0) {
      sortColumns();
    }
  }, [tasks]);

  // useEffect(() => {
  //   if (status !== "loading" && documentReady === false) {
  //     setDocumentReady(true);
  //   }
  // }, [status, documentReady]);

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
      setColumns((prev) => {
        const updatedColumns = { ...prev };
        Object.keys(updatedColumns).forEach((key) => {
          updatedColumns[key].items = updatedColumns[key].items.filter(
            (t) => t.tid !== taskId
          );
        });
        return updatedColumns;
      });
      return { success: true, msg: null, data: null };
    } catch (err: any) {
      return {
        success: false,
        msg: err.message || "an unexpected error occurred",
        data: null,
      };
    }
  };

  const handleChangePriorities = async (
    task: Task | Partial<Task>,
    newPriority: PriorityLevel
  ) => {
    try {
      console.log("task being updated ", task);
      const updatedTask = {
        ...task,
        priority: newPriority,
      };
      console.log("new generated task ", updatedTask);
      const result = await dispatch(
        updateTaskPriority({ data: updatedTask })
      ).unwrap();

      if (result) {
        enqueueSnackbar("task priorities updated", { variant: "success" });
      }
    } catch (err: any) {
      setError(
        err?.message ||
          err ||
          "an unexpected error occurred while updating priority"
      );
      enqueueSnackbar("could not update task priorities", { variant: "error" });
    }
  };

  return (
    <React.Fragment>
      <Helmet title="Tasks" />
      <Typography variant="h3" gutterBottom display="inline">
        Tasks
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} color="secondary" to="/dashboard">
          Dashboard
        </Link>
        <Link component={NavLink} color="secondary" to="/dashboard">
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

        {status === "loading" ? (
          <LinearLoading />
        ) : (
          <>
            {!!documentReady && (
              <DragDropContext
                onDragEnd={(result) =>
                  onDragEnd(result, columns, setColumns, handleChangePriorities)
                }
              >
                {Object.entries(columns)
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  .filter(([_, col]: [string, Column]) => col.title)
                  .map(([columnId, column]) => (
                    <Lane
                      key={columnId}
                      column={column}
                      onAddTask={handleAddTask}
                    >
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
                                              <TaskItem
                                                task={item}
                                                onEdit={handleEditClick}
                                                onDelete={handleDeleteClick}
                                              />
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
          </>
        )}
      </Grid>

      {user && selectedColumnPriority && (
        <NewTaskDialog
          lessorId={user.uid}
          priority={selectedColumnPriority}
          open={openNewDialog}
          openHandler={setOpenNewDialog}
          onSave={handleSave}
          refreshState={setRefreshPage}
        />
      )}

      {user && taskToEdit && openEditDialog && (
        <EditTaskDialog
          task={taskToEdit}
          open={openEditDialog}
          properties={properties}
          workers={workers}
          openSetter={setOpenEditDialog}
          handleEdit={handleEdit}
          refreshState={setRefreshPage}
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
