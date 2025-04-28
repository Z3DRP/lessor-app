import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { MoreVertical } from "lucide-react";

import {
  Card as MuiCard,
  CardHeader,
  IconButton,
  Chip as MuiChip,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { determineTaskStatus, displayDate, Task } from "@/types/task";
import { LinearLoading } from "@/components/ui/Loaders";
import { fetchTasks } from "@/redux/slices/tasksSlice";
import useAuth from "@/hooks/useAuth";
import { TaskStatus } from "enums/enums";
import {
  CompletedStatusChip,
  FailedStatusChip,
  PausedStatusChip,
  ScheduledStatusChip,
  StartedStatusChip,
} from "@/components/tasks/taskChips";
import { TransitionAlert } from "@/components/ui/CustomAlerts";

const Card = styled(MuiCard)(spacing);

const Chip = styled(MuiChip)<{ color: string }>`
  height: 20px;
  padding: 4px 0;
  font-size: 90%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
`;

const Paper = styled(MuiPaper)(spacing);

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)});
`;

// Data
let id = 0;
function createData(
  name: string,
  start: string,
  end: string,
  state: JSX.Element,
  assignee: string
) {
  id += 1;
  return { id, name, start, end, state, assignee };
}

const rows = [
  createData(
    "Project Aurora",
    "01/01/2023",
    "31/06/2023",
    <Chip label="Done" color="success" />,
    "James Dalton"
  ),
  createData(
    "Project Eagle",
    "01/01/2023",
    "31/06/2023",
    <Chip label="In Progress" color="warning" />,
    "Tracy Mack"
  ),
  createData(
    "Project Fireball",
    "01/01/2023",
    "31/06/2023",
    <Chip label="Done" color="success" />,
    "Sallie Love"
  ),
  createData(
    "Project Omega",
    "01/01/2023",
    "31/06/2023",
    <Chip label="Cancelled" color="error" />,
    "Glenda Jang"
  ),
  createData(
    "Project Yoda",
    "01/01/2023",
    "31/06/2023",
    <Chip label="Done" color="success" />,
    "Raymond Ennis"
  ),
  createData(
    "Project Zulu",
    "01/01/2023",
    "31/06/2023",
    <Chip label="Done" color="success" />,
    "Matthew Winters"
  ),
];

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

const DashboardTable = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, status }: { tasks: Task[]; status: any } = useSelector(
    (state: RootState) => state.task
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === "idle") {
          console.log("status is ", status);
          await dispatch(
            fetchTasks({ alsrId: user?.uid, page: 1, limit: 6 })
          ).unwrap();
        }
      } catch (err: any) {
        console.error("ERR ", err);
      }
    };

    if (user) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  return (
    <Card mb={6}>
      <CardHeader
        action={
          <IconButton aria-label="settings" size="large">
            <MoreVertical />
          </IconButton>
        }
        title="Latest Tasks"
      />
      <Paper>
        {status === "loading" ? (
          <LinearLoading />
        ) : (
          <TableWrapper>
            <TransitionAlert
              variant="error"
              message={error ?? ""}
              isOpen={error != null}
              closeHandler={() => setError(null)}
            />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Assignee</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((row) => (
                  <TableRow key={row.tid}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{displayDate(row.startedAt)}</TableCell>
                    <TableCell>{displayDate(row.completedAt)}</TableCell>
                    <TableCell>{getStatusChip(row)}</TableCell>
                    <TableCell>
                      {row?.worker != null
                        ? `${row.worker?.user?.firstName} ${row.worker?.user?.lastName}`
                        : "--"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        )}
      </Paper>
    </Card>
  );
};

export default DashboardTable;
