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
} from "@mui/material";
import { spacing } from "@mui/system";
import { green } from "@mui/material/colors";
import { Add as AddIcon } from "@mui/icons-material";
import { InitialAvatar } from "@/components/ui/Avatars";
import { TaskStatusChip } from "@/components/tasks/taskChips";
import { PriorityLevel, TaskStatus } from "enums/enums";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchTasks } from "@/redux/slices/tasksSlice";
import useAuth from "@/hooks/useAuth";
import { LinearLoading } from "@/components/ui/Loaders";
import Error from "@/layouts/Error";

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

const mockItems1 = [
  {
    id: faker.datatype.uuid(),
    title: "Redesign the homepage",
    badges: [1],
    notifications: 1200.34,
    avatars: [1, 2, 3, 4],
  },
  {
    id: faker.datatype.uuid(),
    title: "Upgrade dependencies to latest versions",
    badges: [green[600]],
    notifications: 103.43,
    avatars: [2],
  },
  {
    id: faker.datatype.uuid(),
    title: "Google Adwords best practices",
    badges: [1],
    notifications: 232.49,
    avatars: [2, 3],
  },
  {
    id: faker.datatype.uuid(),
    title: "Improve site speed",
    badges: [1],
    notifications: 300.89,
    avatars: [],
  },
  {
    id: faker.datatype.uuid(),
    title: "Stripe payment integration",
    badges: [1],
    notifications: 50.32,
    avatars: [],
  },
];

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

const mockItems3 = [
  {
    id: faker.datatype.uuid(),
    title: "Improve site speed",
    badges: [1],
    notifications: 0,
    avatars: [1, 2],
  },
  {
    id: faker.datatype.uuid(),
    title: "Google Adwords best practices",
    badges: [1],
    notifications: 3000.0,
    avatars: [2],
  },
  {
    id: faker.datatype.uuid(),
    title: "Redesign the homepage",
    badges: [1],
    notifications: 240.49,
    avatars: [],
  },
];

//maybe define them here but then remove the items and then use below in the state
const priorityColumns = {
  [faker.datatype.uuid()]: {
    title: "Low",
    description: "Tasks in this bucket will be completed last",
    items: mockItems1,
  },
  [faker.datatype.uuid()]: {
    title: "Medium",
    description: "Tasks in this bucket will be completed before the lowest",
    items: mockItems2,
  },
  [faker.datatype.uuid()]: {
    title: "High",
    description:
      "Tasks in this bucket will be completed before any other, unless marked as urgent",
    items: mockItems3,
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
    description: string;
  };
  children: ReactNode;
}

const Lane = ({ column, children }: LaneProps) => {
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
          <Typography variant="h6" gutterBottom>
            {column.title}
          </Typography>
          <Typography variant="body2" mb={4}>
            {column.description}
          </Typography>
          {children}
          <Button color="primary" variant="contained" fullWidth>
            <AddIcon />
            Add new task
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

interface TaskProps {
  item: {
    badges: any;
    title: string;
    avatars: any;
    notifications: any;
  };
}

const Task = ({ item }: TaskProps) => {
  return (
    <TaskWrapper mb={4}>
      <TaskWrapperContent>
        {item.badges &&
          item.badges.map((color: any, i: number) => (
            <TaskStatusChip key={i} status={TaskStatus.Completed} />
          ))}

        <TaskTitle variant="body1" sx={{ mt: 1 }} gutterBottom>
          {item.title}
        </TaskTitle>

        <TaskAvatars>
          <AvatarGroup max={3}>
            {!!item.avatars &&
              item.avatars.map((avatar: any, i: number) => (
                //<InitialAvatar initials={worker.initials} />
                <Avatar
                  src={`/static/img/avatars/avatar-${avatar}.jpg`}
                  key={i}
                />
              ))}
          </AvatarGroup>
        </TaskAvatars>

        {!!item.notifications && item.notifications > 0 && (
          <TaskNotifications>
            <TaskAmountIcon />
            <TaskNotificationsAmount>
              {item.notifications}
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

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks({ alsrId: user?.Uid, page: 1, limit: 30 }));
    }
  }, [user, status, dispatch]);

  useEffect(() => {
    setDocumentReady(true);
  }, []);

  if (status === "loading") {
    return <LinearLoading />;
  }

  if (status === "failed") {
    return (
      <Error>
        <Typography>Failed to fetch tasks</Typography>
      </Error>
    );
  }

  const priorityColumns = {
    [faker.datatype.uuid()]: {
      title: "Low",
      description: "Tasks in this bucket will be completed last",
      items: tasks
        .sort(
          (t1, t2) =>
            t1.scheduledAt.getUTCMilliseconds() -
            t2.scheduledAt.getUTCMilliseconds()
        )
        .filter((t) => t.priority === PriorityLevel.Low),
    },
    [faker.datatype.uuid()]: {
      title: "Medium",
      description: "Tasks in this bucket will be completed before the lowest",
      items: tasks
        .sort(
          (t1, t2) =>
            t1.scheduledAt.getUTCMilliseconds() -
            t2.scheduledAt.getUTCMilliseconds()
        )
        .filter((t) => t.priority === PriorityLevel.High),
    },
    [faker.datatype.uuid()]: {
      title: "High",
      description:
        "Tasks in this bucket will be completed before any other, unless marked as urgent",
      items: tasks
        .sort(
          (t1, t2) =>
            t1.scheduledAt.getUTCMilliseconds() -
            t2.scheduledAt.getUTCMilliseconds()
        )
        .filter((t) => t.priority === PriorityLevel.High),
    },
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
        {!!documentReady && (
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            {Object.entries(columns).map(([columnId, column]) => (
              <Lane key={columnId} column={column}>
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
                                    <Task item={item} />
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
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
    </React.Fragment>
  );
}

export default Tasks;
