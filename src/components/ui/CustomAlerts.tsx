import styled from "@emotion/styled";
import {
  Card as MuiCard,
  CardContent,
  Alert as MuiAlert,
  Collapse,
  AlertTitle,
  IconButton,
  Typography,
} from "@mui/material";

import { Close as CloseIcon } from "@mui/icons-material";

import { spacing } from "@mui/system";

const Alert = styled(MuiAlert)(spacing);

export type Variants = "error" | "warning" | "success" | "info";

export type TransitionAlertProps = {
  variant: Variants;
  message: string;
  isOpen: boolean;
  closeHandler: () => void;
};

export function TransitionAlert({
  variant,
  message,
  isOpen,
  closeHandler,
}: TransitionAlertProps) {
  return (
    <Collapse in={isOpen}>
      <Alert
        severity={variant}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => closeHandler()}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <AlertTitle>{variant.toUpperCase()}</AlertTitle>
        <Typography variant="body2">{message}</Typography>
      </Alert>
    </Collapse>
  );
}

export type CustomAlertProps = {
  variant: Variants;
  message: string;
};

export function CustomAlert({ variant, message }: CustomAlertProps) {
  return (
    <Alert mb={4} severity={variant}>
      <AlertTitle>{variant.toUpperCase()}</AlertTitle>
      <Typography variant="body2">{message}</Typography>
    </Alert>
  );
}

export type AlertNotificationProps = {
  variant: Variants;
  title: string;
  message: string;
};

export function AlertNotification({
  variant,
  title,
  message,
}: AlertNotificationProps) {
  return (
    <Alert mb={4} severity={variant}>
      <AlertTitle>{title}</AlertTitle>
      <Typography variant="body2">{message}</Typography>
    </Alert>
  );
}
