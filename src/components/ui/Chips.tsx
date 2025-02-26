import styled from "@emotion/styled";
import { Chip as MuiChip } from "@mui/material";

const Chip = styled(MuiChip)<{ color?: string }>`
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)};
`;

export default Chip;
