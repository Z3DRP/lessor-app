import styled from "@emotion/styled";
import { Chip as MuiChip } from "@mui/material";
import { spacing, SpacingProps, Stack } from "@mui/system";
import { TaskStatus } from "enums/enums";
import { green, yellow, red, deepPurple } from "@mui/material/colors";

interface ChipProps extends SpacingProps {
  component?: React.ElementType;
  icon?: JSX.Element | null;
}

const Chip = styled(MuiChip)<ChipProps>(spacing);

const StartedChip = styled(MuiChip)<{
  color?: string;
  mx?: number;
  mb?: number;
}>`
  height: 20px;
  padding: 4px 0;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  margin-left: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
  margin-right: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
  margin-bottom: ${({ mb }) => (mb !== undefined ? "${mb}px" : "0px")};
`;

const ScheduledChip = styled(MuiChip)<{
  color?: string;
  mx?: number;
  mb?: number;
}>`
  height: 20px;
  padding: 4px 0;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${deepPurple[400]};
  margin-left: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
  margin-right: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
  margin-bottom: ${({ mb }) => (mb !== undefined ? "${mb}px" : "0px")};
`;

const CompletedChip = styled(MuiChip)<{
  color?: string;
  mx?: number;
  mb?: number;
}>`
  height: 20px;
  padding: 4px 0;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${green[700]};
  margin-left: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
  margin-right: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
  margin-bottom: ${({ mb }) => (mb !== undefined ? "${mb}px" : "0px")};
`;

const PausedChip = styled(MuiChip)<{
  color?: string;
  mx?: number;
  mb?: number;
}>`
  height: 20px;
  padding: 4px 0;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${yellow[500]};
  margin-left: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
  margin-right: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
  margin-bottom: ${({ mb }) => (mb !== undefined ? "${mb}px" : "0px")};
`;

const FailedChip = styled(MuiChip)<{
  color?: string;
  mx?: number;
  mb?: number;
}>`
  height: 20px;
  padding: 4px 0;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${red[500]};
  margin-left: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
  margin-right: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
  margin-bottom: ${({ mb }) => (mb !== undefined ? "${mb}px" : "0px")};
`;

export const DefaultChip = styled(MuiChip)<{ color?: string; mx?: number }>`
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].dark};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)};
  margin-left: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
  margin-right: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
`;

export type TaskStatusChipProps = {
  status: TaskStatus;
};

export function TaskStatusChip({ status }: TaskStatusChipProps) {
  switch (status) {
    case TaskStatus.Scheduled:
      return <ScheduledChip label={TaskStatus.Scheduled} />;
    case TaskStatus.Started:
      return (
        <Stack direction="row" spacing={2}>
          <ScheduledChip label={TaskStatus.Scheduled} mb={2} />
          <StartedChip label={TaskStatus.Started} mb={2} />
        </Stack>
      );
    case TaskStatus.Paused:
      return (
        <Stack direction="row" spacing={2}>
          <ScheduledChip label={TaskStatus.Scheduled} mb={2} />
          <StartedChip label={TaskStatus.Started} mb={2} />
          <PausedChip label={TaskStatus.Paused} />
        </Stack>
      );
    case TaskStatus.Failed:
      return (
        <Stack direction="row" spacing={2}>
          <ScheduledChip label={TaskStatus.Scheduled} mb={2} />
          <StartedChip label={TaskStatus.Started} mb={2} />
          <FailedChip label={TaskStatus.Failed} mb={2} />
        </Stack>
      );
    case TaskStatus.Completed:
      return (
        <Stack direction="row" spacing={2}>
          <ScheduledChip label={TaskStatus.Scheduled} mb={2} />
          <StartedChip label={TaskStatus.Started} mb={2} />
          <CompletedChip label={TaskStatus.Completed} mb={2} />
        </Stack>
      );
    default:
      return <DefaultChip />;
  }
}
