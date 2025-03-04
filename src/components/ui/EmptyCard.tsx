import { Card as MuiCard, CardContent, Typography } from "@mui/material";
import styled from "@emotion/styled";

import { spacing } from "@mui/system";

const Card = styled(MuiCard)(spacing);

export interface EmptyCardProps {
  title: string;
  body: string;
}

export default function EmptyCard({ title, body }: EmptyCardProps) {
  return (
    <Card mb={6}>
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
