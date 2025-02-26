import styled from "@emotion/styled";
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardMedia as MuiCardMedia,
  Divider as MuiDivider,
} from "@mui/material";
import { spacing } from "@mui/system";

export const Card = styled(MuiCard)(spacing);

export const CardContent = styled(MuiCardContent)`
  border-bottom: 1px solid ${(props) => props.theme.palette.grey[300]};
`;

export const CardMedia = styled(MuiCardMedia)`
  height: 220px;
`;

export const Divider = styled(MuiDivider)(spacing);
