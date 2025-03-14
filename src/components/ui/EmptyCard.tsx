import { Card as MuiCard, CardContent, Typography } from "@mui/material";
import styled from "@emotion/styled";

import { spacing } from "@mui/system";
import { useTheme } from "@emotion/react";

const Card = styled(MuiCard)(spacing);

export interface EmptyCardProps {
  title: string;
  body: string;
}

export default function EmptyCard({ title, body }: EmptyCardProps) {
  const theme = useTheme();
  return (
    <Card mb={6} sx={{ border: `1px solid ${theme.palette.divider}` }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {body}
        </Typography>
      </CardContent>
    </Card>
  );
}
