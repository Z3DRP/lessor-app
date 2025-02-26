import styled from "@emotion/styled";
import { AvatarGroup as MuiAvatarGroup } from "@mui/material";

export const AvatarGroup = styled(MuiAvatarGroup)`
  margin-left: ${(props) => props.theme.spacing(2)};
`;
