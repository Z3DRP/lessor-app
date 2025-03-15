import {
  Box as MuiBox,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  Typography,
  TextField as MuiTextField,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  FormHelperText,
  Switch,
  InputAdornment,
} from "@mui/material";
import { PriorityLevel } from "enums/enums";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { TransitionAlert } from "../ui/CustomAlerts";
import styled from "@emotion/styled";
import { spacing, SpacingProps } from "@mui/system";
import { useState } from "react";
import { LinearLoading } from "../ui/Loaders";
import { LucideDollarSign } from "lucide-react";
const Card = styled(MuiCard)(spacing);
const Box = styled(MuiBox)(spacing);
interface ButtonProps extends SpacingProps {
  component?: string;
}
const Button = styled(MuiButton)<ButtonProps>(spacing);
const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

export type NewTaskDialogProps = {
  lessorId: string;
  open: boolean;
  openHandler: (isOpen: boolean) => void;
  refreshState: () => void;
};

export default function NewTaskDialog({
  lessorId,
  open,
  openHandler,
  refreshState,
}: NewTaskDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const initValues = {
    name: "",
    workerName: "",
    priority: "",
    takePrecedence: false,
    details: "",
    notes: "",
    propertyAddress: "",
    estimatedCost: 0.0,
    actualCost: 0.0,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "name must be at least 2 characters")
      .max(255, "name must be less than 255 characters")
      .required("name is required"),
    workerName: Yup.string().optional(),
    priority: Yup.string()
      .oneOf(Object.values(PriorityLevel))
      .required("priority level is required"),
    takePrecedence: Yup.boolean().optional(),
    details: Yup.string()
      .min(2, "details must be at least 2 characters")
      .required("details are required"),
    notes: Yup.string()
      .min(2, "notes must be at least 2 characters")
      .optional(),
    propertyAddress: Yup.string().required("property is required"),
    estimatedCost: Yup.number(),
    actualCost: Yup.number(),
  });

  const handleSubmit = async (
    values: any,
    { resetForm, setSubmitting }: any
  ) => {
    console.log(
      "values ",
      values,
      "setSub",
      setSubmitting,
      "reset form",
      resetForm
    );
  };

  return (
    <Formik
      initialValues={initValues}
      validationSchema={validationSchema}
      validationOnMount
      onSubmit={handleSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values,
      }) => (
        <Dialog
          open={open}
          onClose={() => openHandler(false)}
          aria-label="form-dialog-title"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="form-dialog-title">
            <Typography variant="h3">Create</Typography>
          </DialogTitle>
          <Form onSubmit={handleSubmit}>
            <DialogContent>
              <Card mb={6}>
                <CardContent>
                  <TransitionAlert
                    isOpen={error != null}
                    variant="error"
                    message={error ?? ""}
                    closeHandler={() => setError(null)}
                  />
                  {isSubmitting ? (
                    <Box display="flex" justifyContent="center" my={6}>
                      <LinearLoading />
                    </Box>
                  ) : (
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          name="name"
                          label="Name"
                          value={values.name}
                          error={Boolean(touched.name && errors.name)}
                          fullWidth
                          helperText={touched.name && errors.name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          variant="outlined"
                          my={2}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Grid container direction="row" spacing={2}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              name="propertyAddress"
                              label="Property Address"
                              value={values.propertyAddress}
                              error={Boolean(
                                touched.propertyAddress &&
                                  errors.propertyAddress
                              )}
                              helperText={
                                touched.propertyAddress &&
                                errors.propertyAddress
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                              my={2}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              name="workerName"
                              label="Worker Name"
                              value={values.workerName}
                              error={Boolean(
                                touched.workerName && errors.workerName
                              )}
                              helperText={
                                touched.workerName && errors.workerName
                              }
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                              my={2}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Grid container direction="row" spacing={2}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl
                              variant="outlined"
                              sx={{ my: 2 }}
                              fullWidth
                            >
                              <InputLabel id="priority">Priority</InputLabel>
                              <Select
                                name="priority"
                                fullWidth
                                labelId="priority"
                                defaultValue="low"
                                native
                                onBlur={handleBlur}
                                onChange={(e: any) => {
                                  setFieldValue("priority", e.target.value);
                                }}
                              >
                                {Object.values(PriorityLevel).map((pl) => (
                                  <option key={pl} value={pl}>
                                    {pl}
                                  </option>
                                ))}
                              </Select>
                              {touched.priority && errors.priority && (
                                <FormHelperText error>
                                  {errors.priority}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl
                              variant="outlined"
                              sx={{ my: 2 }}
                              fullWidth
                            >
                              <FormControlLabel
                                label="Take precedence"
                                control={
                                  <Switch
                                    name="takePrecedence"
                                    onChange={(e) =>
                                      setFieldValue(
                                        "takePrecedence",
                                        e.target.checked
                                      )
                                    }
                                  />
                                }
                              />
                              {touched.takePrecedence &&
                                errors.takePrecedence && (
                                  <FormHelperText error>
                                    {errors.takePrecedence}
                                  </FormHelperText>
                                )}
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Grid container direction="row" spacing={2}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              name="details"
                              label="details"
                              value={values.details}
                              error={Boolean(touched.details && errors.details)}
                              fullWidth
                              helperText={touched.details && errors.details}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                              my={2}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              name="notes"
                              label="notes"
                              value={values.notes}
                              error={Boolean(touched.notes && errors.notes)}
                              helperText={touched.notes && errors.notes}
                              fullWidth
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                              my={2}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Grid container direction="row" spacing={2}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              fullWidth
                              name="estimatedCost"
                              label="Estimated cost"
                              value={values.estimatedCost}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(
                                touched.estimatedCost && errors.estimatedCost
                              )}
                              helperText={
                                touched.estimatedCost && errors.estimatedCost
                              }
                              variant="outlined"
                              my={2}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LucideDollarSign fontSize="small" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              fullWidth
                              name="actualCost"
                              label="Actual cost"
                              value={values.actualCost}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(
                                touched.actualCost && errors.actualCost
                              )}
                              helperText={
                                touched.actualCost && errors.actualCost
                              }
                              variant="outlined"
                              my={2}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LucideDollarSign fontSize="small" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </DialogContent>
          </Form>
        </Dialog>
      )}
    </Formik>
  );
}
