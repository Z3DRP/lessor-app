import styled from "@emotion/styled";
import { Chip as MuiChip } from "@mui/material";

const StatusChip = styled(MuiChip)<{ color?: string }>`
  height: 30px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].dark};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)};
`;

export default StatusChip;
