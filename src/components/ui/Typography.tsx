import { Typography as MuiTypography } from "@mui/material";
import { spacing, SpacingProps, styled } from "@mui/system";

interface TypographyProps extends SpacingProps {
  component?: string;
}
export const Typography = styled(MuiTypography)<TypographyProps>(spacing);
