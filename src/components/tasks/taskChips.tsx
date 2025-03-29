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

export const PrimaryChip = styled(MuiChip)<{
  color?: string;
  mx?: number;
  mb?: number;
}>`
  height: 20px;
  padding: 4px 0;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${({ theme }) => theme.palette.primary.main};
  margin-left: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
  margin-right: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
  margin-bottom: ${({ mb }) => (mb !== undefined ? "${mb}px" : "0px")};
`;

export const SecondaryChip = styled(MuiChip)<{
  color?: string;
  mx?: number;
  mb?: number;
}>`
  height: 20px;
  padding: 4px 0;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${({ theme }) => theme.palette.secondary.default};
  margin-left: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
  margin-right: ${({ mx }) => (mx !== undefined ? `${mx}px` : "0px")};
  margin-bottom: ${({ mb }) => (mb !== undefined ? "${mb}px" : "0px")};
`;

export const StartedChip = styled(MuiChip)<{
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

export function StartedStatusChip() {
  return <StartedChip label="Started" />;
}

export const DeepPurpleChip = styled(MuiChip)<{
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

export function ScheduledStatusChip() {
  return <DeepPurpleChip label="Scheduled" />;
}

export const GreenChip = styled(MuiChip)<{
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

export function CompletedStatusChip() {
  return <GreenChip label="Completed" />;
}

export const YellowChip = styled(MuiChip)<{
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

export function PausedStatusChip() {
  return <YellowChip label="Paused" />;
}

export const RedChip = styled(MuiChip)<{
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

export function FailedStatusChip() {
  return <RedChip label="Failed" />;
}

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
      return <DeepPurpleChip label={TaskStatus.Scheduled} />;
    case TaskStatus.Started:
      return (
        <Stack direction="row" spacing={2}>
          <DeepPurpleChip label={TaskStatus.Scheduled} mb={2} />
          <StartedChip label={TaskStatus.Started} mb={2} />
        </Stack>
      );
    case TaskStatus.Paused:
      return (
        <Stack direction="row" spacing={2}>
          <DeepPurpleChip label={TaskStatus.Scheduled} mb={2} />
          <StartedChip label={TaskStatus.Started} mb={2} />
          <YellowChip label={TaskStatus.Paused} />
        </Stack>
      );
    case TaskStatus.Failed:
      return (
        <Stack direction="row" spacing={2}>
          <DeepPurpleChip label={TaskStatus.Scheduled} mb={2} />
          <StartedChip label={TaskStatus.Started} mb={2} />
          <RedChip label={TaskStatus.Failed} mb={2} />
        </Stack>
      );
    case TaskStatus.Completed:
      return (
        <Stack direction="row" spacing={2}>
          <DeepPurpleChip label={TaskStatus.Scheduled} mb={2} />
          <StartedChip label={TaskStatus.Started} mb={2} />
          <GreenChip label={TaskStatus.Completed} mb={2} />
        </Stack>
      );
    default:
      return <DefaultChip />;
  }
}
