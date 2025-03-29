import { Task } from "@/types/task";
import {
  Box as MuiBox,
  Button as MuiButton,
  Card as MuiCard,
  TextField as MuiTextField,
  CardContent,
  Dialog,
  DialogContent,
  Grid2 as Grid,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  FormControlLabel,
  Switch,
  InputAdornment,
  DialogActions,
} from "@mui/material";
import { spacing, SpacingProps } from "@mui/system";
import styled from "@emotion/styled";
import { Field, Formik, Form, FormikValues } from "formik";
import { useState } from "react";
import { TransitionAlert } from "../ui/CustomAlerts";
import { LinearLoading } from "../ui/Loaders";
import * as Yup from "yup";
import { PriorityLevel, TaskCategory } from "enums/enums";
import { formattedAddress, Property } from "@/types/property";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { LucideDollarSign } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import InfoPopover from "../ui/InfoPopover";
import { MaintenanceWorker } from "@/types/worker";

const Card = styled(MuiCard)(spacing);
const Box = styled(MuiBox)(spacing);
interface ButtonProps extends SpacingProps {
  component?: string;
}
const Button = styled(MuiButton)<ButtonProps>(spacing);
const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

export type EditTaskDialogProps = {
  task: Task | Partial<Task>;
  properties: Property[];
  workers: MaintenanceWorker[];
  open: boolean;
  openSetter: (isOpen: boolean) => void;
  handleEdit: (task: Partial<Task> | Task) => Promise<any>;
  refreshState: (value: boolean) => void;
};

export default function EditTaskDialog({
  task,
  properties,
  workers,
  open,
  openSetter,
  handleEdit,
  refreshState,
}: EditTaskDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const initValues = {
    name: task?.name || "",
    workerId: task?.workerId || "",
    priority: task?.priority || "low",
    category: task?.category || TaskCategory.maintenance,
    takePrecedence: task?.takePrecedence || false,
    details: task?.details || "",
    notes: task?.notes || "",
    propertyId: task?.propertyId || "",
    estimatedCost: task?.estimatedCost || 0.0,
    actualCost: task?.actualCost || 0.0,
  };

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(2, "name must be at least 2 characters")
      .max(255, "name must be less than 255 characters")
      .required("name is required"),
    workerId: Yup.string().optional(),
    priority: Yup.string()
      .oneOf(Object.values(PriorityLevel))
      .required("priority level is required"),
    category: Yup.string().oneOf(
      Object.values(TaskCategory),
      "invalid task category"
    ),
    takePrecedence: Yup.boolean().optional(),
    details: Yup.string()
      .min(2, "details must be at least 2 characters")
      .required("details are required"),
    notes: Yup.string()
      .min(2, "notes must be at least 2 characters")
      .optional(),
    propertyId: Yup.string().optional(),
    estimatedCost: Yup.number()
      .moreThan(-1, "estimated cost cannot be negative")
      .optional(),
    actualCost: Yup.number()
      .moreThan(-1, "actual cost cannot be negative")
      .optional(),
  });

  const handleSubmit = async (
    values: FormikValues,
    { resetForm, setSubmitting }: any
  ) => {
    const editedTask: Partial<Task> = {
      tid: task.tid,
      name: values.name,
      workerId: values.workerId,
      priority: values.priority,
      category: values.category,
      takePrecedence: values.takePrecedence,
      notes: values.notes,
      details: values.details,
      propertyId: values.propertyId,
      estimatedCost: values.estimatedCost,
      actualCost: values.actualCost,
    };

    try {
      const { msg, success } = await handleEdit(editedTask);

      if (success) {
        openSetter(false);
        enqueueSnackbar("changes saved", { variant: "success" });
        refreshState(true);
        resetForm();
        return;
      }

      setError(msg);
    } catch (err: any) {
      setError(`${err?.error || err?.message || "something went wrong"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initValues}
      enableReinitialize
      validationSchema={schema}
      validateOnMount
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
          onClose={() => openSetter(false)}
          aria-labelledBy="edit-task"
          fullWidth
          maxWidth="md"
        >
          <Form onSubmit={handleSubmit}>
            <DialogContent>
              <Card mb={6}>
                <CardContent>
                  <TransitionAlert
                    isOpen={error != null}
                    variant="error"
                    message={error || ""}
                    closeHandler={() => setError(null)}
                  />

                  {isSubmitting ? (
                    <Box display="flex" justifyContent="center" my={6}>
                      <LinearLoading />
                    </Box>
                  ) : (
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 12 }}>
                        <Grid container direction="row" spacing={2}>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Grid
                              container
                              direction="row"
                              alignItems="center"
                              spacing={0.5}
                            >
                              <Grid>
                                <FormControl
                                  variant="outlined"
                                  sx={{ my: 2 }}
                                  fullWidth
                                >
                                  <FormControlLabel
                                    label="Take Precedence"
                                    control={
                                      <Switch
                                        name="takePrecedence"
                                        checked={values.takePrecedence}
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
                                    Boolean(errors.takePrecedence) && (
                                      <FormHelperText error>
                                        {errors.takePrecedence}
                                      </FormHelperText>
                                    )}
                                </FormControl>
                              </Grid>
                              <Grid>
                                <InfoPopover
                                  title="Take Precedence"
                                  message="execute this task next before others in bucket"
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl
                              variant="outlined"
                              sx={{ my: 2 }}
                              fullWidth
                            >
                              <InputLabel id="priority">Priority</InputLabel>
                              <Select
                                name="priority"
                                fullWidth
                                native
                                labelId="priority"
                                label="Priority"
                                value={values.priority}
                                onBlur={handleBlur}
                                onChange={handleChange}
                              >
                                {Object.values(PriorityLevel).map((pl) => (
                                  <option key={pl} value={pl}>
                                    {pl}
                                  </option>
                                ))}
                              </Select>
                              {touched.priority && Boolean(errors.priority) && (
                                <FormHelperText error>
                                  {errors.priority}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl
                              variant="outlined"
                              sx={{ my: 2 }}
                              fullWidth
                            >
                              <InputLabel id="category">Category</InputLabel>
                              <Select
                                name="category"
                                fullWidth
                                native
                                labelId="category"
                                label="category"
                                value={values.category}
                                onBlur={handleBlur}
                                onChange={(e: any) =>
                                  setFieldValue("category", e.target.value)
                                }
                              >
                                {Object.values(TaskCategory).map((tc) => (
                                  <option key={tc} value={tc}>
                                    {tc}
                                  </option>
                                ))}
                              </Select>
                              {touched.category && Boolean(errors.category) && (
                                <FormHelperText error>
                                  {errors.category}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Field name="name">
                          {({ field, meta }: any) => (
                            <TextField
                              {...field}
                              label="Name"
                              fullWidth
                              error={meta.touched && meta.error}
                              helperText={meta.touched && meta.error}
                              variant="outlined"
                              my={2}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Grid container direction="row" spacing={1}>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl
                              id="property"
                              variant="outlined"
                              sx={{ my: 2 }}
                              fullWidth
                            >
                              <InputLabel id="property">Property</InputLabel>
                              <Select
                                name="propertyId"
                                native
                                fullWidth
                                value={values.propertyId}
                                onChange={handleChange}
                                labelId="property"
                                label="Property"
                                onBlur={handleBlur}
                                error={
                                  touched.propertyId &&
                                  Boolean(errors.propertyId)
                                }
                              >
                                {properties.map((p) => (
                                  <option key={p.pid} value={p.pid}>
                                    {formattedAddress(p)}
                                  </option>
                                ))}
                              </Select>
                              {touched.propertyId && errors.propertyId && (
                                <FormHelperText error>
                                  {errors.propertyId}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl
                              id="worker-id"
                              fullWidth
                              sx={{ my: 2 }}
                            >
                              <InputLabel id="worker-id">Worker</InputLabel>
                              <Select
                                name="workerId"
                                label="Worker"
                                value={values.workerId}
                                error={
                                  touched.workerId && Boolean(errors.workerId)
                                }
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                              >
                                {workers.map((w) => (
                                  <option
                                    key={w.uid}
                                    value={w.uid}
                                  >{`${w?.user?.firstName} ${w?.user?.lastName}`}</option>
                                ))}
                              </Select>
                              {touched.workerId && Boolean(errors.workerId) && (
                                <FormHelperText error>
                                  {errors?.workerId}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Grid container direction="row" spacing={2}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Field name="details">
                              {({ field, meta }: any) => (
                                <TextField
                                  {...field}
                                  label="details"
                                  fullWidth
                                  error={meta.touchd && meta.error}
                                  helperText={meta.touched && meta.error}
                                  variant="outlined"
                                  my={2}
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Field name="notes">
                              {({ field, meta }: any) => (
                                <TextField
                                  {...field}
                                  label="notes"
                                  fullWidth
                                  error={meta.touched && Boolean(meta.error)}
                                  helperText={meta.touched && meta.error}
                                  variant="outlined"
                                  my={2}
                                />
                              )}
                            </Field>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Grid container direction="row" spacing={2}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Field name="estimatedCost">
                              {({ field, meta }: any) => (
                                <TextField
                                  {...field}
                                  label="Estimated Cost"
                                  fullWidth
                                  error={meta.touched && Boolean(meta.error)}
                                  helperText={meta.touched && meta.error}
                                  variant="outlined"
                                  my={2}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LucideDollarSign size={18} />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Field name="actualCost">
                              {({ field, meta }: any) => (
                                <TextField
                                  {...field}
                                  label="Actual Cost"
                                  fullWidth
                                  error={meta.touched && Boolean(meta.error)}
                                  helperText={meta.touched && meta.error}
                                  variant="outlined"
                                  my={2}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LucideDollarSign size={18} />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              )}
                            </Field>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </DialogContent>
            <DialogActions sx={{ mb: 2, mr: 2 }}>
              <Button
                onClick={() => openSetter(false)}
                color="secondary"
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={isSubmitting}
              >
                Save
              </Button>
            </DialogActions>
          </Form>
        </Dialog>
      )}
    </Formik>
  );
}
