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
  DialogActions,
} from "@mui/material";
import { PriorityLevel, TaskCategory } from "enums/enums";
import { Form, Formik, FormikValues } from "formik";
import * as Yup from "yup";
import { TransitionAlert } from "../ui/CustomAlerts";
import styled from "@emotion/styled";
import { spacing, SpacingProps } from "@mui/system";
import { useEffect, useState } from "react";
import { LinearLoading } from "../ui/Loaders";
import { LucideDollarSign } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchWorkers } from "@/redux/slices/workerSlice";
import { fetchProperties } from "@/redux/slices/propertiesSlice";
import { formattedAddress, Property } from "@/types/property";
import { MaintenanceWorker } from "@/types/worker";
import { Task } from "@/types/task";
import { RequestDto } from "@/types/requestResult";
import InfoPopover from "../ui/InfoPopover";
import { enqueueSnackbar } from "notistack";
const Card = styled(MuiCard)(spacing);
const Box = styled(MuiBox)(spacing);
interface ButtonProps extends SpacingProps {
  component?: string;
}
const Button = styled(MuiButton)<ButtonProps>(spacing);
const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

export type NewTaskDialogProps = {
  lessorId: string;
  priority: PriorityLevel;
  onSave: (task: Partial<Task> | Task) => Promise<RequestDto>;
  open: boolean;
  openHandler: (isOpen: boolean) => void;
  refreshState: (value: boolean) => void;
};

export default function NewTaskDialog({
  lessorId,
  priority,
  onSave,
  open,
  openHandler,
  refreshState,
}: NewTaskDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    workers,
    status: wStatus,
  }: { workers: MaintenanceWorker[]; status: any } = useSelector(
    (state: RootState) => state.worker
  );

  const {
    properties,
    status: pStatus,
  }: { properties: Property[]; status: any } = useSelector(
    (state: RootState) => state.property
  );

  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (wStatus === "idle" || wStatus === "failed") {
          const res = await dispatch(
            fetchWorkers({ alsrId: lessorId, page: 1, limit: 30 })
          ).unwrap();
          console.log(res);
        }

        if (pStatus === "idle" || pStatus === "failed") {
          const res = await dispatch(
            fetchProperties({ alsrId: lessorId, page: 1 })
          ).unwrap();
          console.log(res);
        }
      } catch (err: any) {
        setError(err?.message || "idunno");
      }
    };

    if (lessorId && properties.length === 0 && workers.length === 0) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessorId, properties.length, workers.length]);

  if (wStatus === "loading" || pStatus === "loading") {
    return <LinearLoading />;
  }

  const initValues = {
    name: "",
    workerId: "",
    priority: priority,
    category: TaskCategory.maintenance,
    takePrecedence: false,
    details: "",
    notes: "",
    propertyId: "",
    estimatedCost: 0.0,
    actualCost: 0.0,
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
    category: Yup.string()
      .oneOf(Object.values(TaskCategory), "invalid task category")
      .optional(),
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
    setSubmitting(true);
    const task: Partial<Task> = {
      lessorId: lessorId,
      name: values.name,
      workerId: values?.workerId,
      propertyId: values?.propertyId,
      category: values?.category,
      priority: values?.priority,
      takePrecedence: values.takePrecedence,
      details: values?.details,
      notes: values?.notes,
      estimatedCost: +values?.estimatedCost,
      actualCost: +values?.actualCost,
      scheduledAt: new Date().toISOString(),
    };

    console.log("creating task:: ", task);

    try {
      const { success, msg, data } = await onSave(task);

      if (!success) {
        refreshState(false);
        setError(msg ?? "something unexpected happened");
        enqueueSnackbar("could not create task", { variant: "error" });
        return;
      }

      refreshState(true);
      resetForm();
      openHandler(false);
      console.log(data);
    } catch (err: any) {
      setError(err);
    }
  };

  return (
    <Formik
      initialValues={initValues}
      validationSchema={schema}
      enableReinitialize
      validationOnMount
      onSubmit={handleSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        resetForm,
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
                  {isSubmitting ? (
                    <Box display="flex" justifyContent="center" my={6}>
                      <LinearLoading />
                    </Box>
                  ) : (
                    <>
                      <TransitionAlert
                        isOpen={error != null}
                        variant="error"
                        message={error ?? ""}
                        my={2}
                        closeHandler={() => setError(null)}
                      />
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
                                disabled
                              >
                                <InputLabel id="priority">Priority</InputLabel>
                                <Select
                                  disabled
                                  name="priority"
                                  fullWidth
                                  labelId="priority"
                                  label="Priority"
                                  native
                                  onBlur={handleBlur}
                                  value={values.priority}
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
                                {touched.priority &&
                                  Boolean(errors.priority) && (
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
                                  labelId="category"
                                  native
                                  onBlur={handleBlur}
                                  value={values.category}
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
                                {touched.category &&
                                  Boolean(errors.category) && (
                                    <FormHelperText error>
                                      {errors.category}
                                    </FormHelperText>
                                  )}
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            name="name"
                            label="Name"
                            value={values.name}
                            error={touched.name && Boolean(errors.name)}
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
                              <FormControl
                                variant="outlined"
                                sx={{ my: 2 }}
                                fullWidth
                              >
                                <InputLabel id="property">Property</InputLabel>
                                <Select
                                  name="propertyId"
                                  native
                                  fullWidth
                                  defaultValue="default-op"
                                  labelId="property"
                                  label="Property"
                                  onBlur={handleBlur}
                                  error={
                                    touched.propertyId &&
                                    Boolean(errors.propertyId)
                                  }
                                  onChange={(e: any) =>
                                    setFieldValue("propertyId", e.target.value)
                                  }
                                >
                                  <option value="default-op">
                                    Select Property
                                  </option>
                                  {properties.map((p: Property) => (
                                    <option
                                      key={p.pid}
                                      value={p.pid}
                                    >{`${formattedAddress(p)}`}</option>
                                  ))}
                                </Select>
                                {touched.propertyId &&
                                  Boolean(errors.propertyId) && (
                                    <FormHelperText error>
                                      {errors.propertyId}
                                    </FormHelperText>
                                  )}
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <FormControl
                                id="woker-id"
                                variant="outlined"
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
                                  onChange={(e: any) => {
                                    setFieldValue("workerId", e.target.value);
                                  }}
                                  variant="outlined"
                                >
                                  {workers.map((w) => (
                                    <option key={w.uid} value={w.uid}>
                                      {`${w?.user?.firstName} ${w?.user?.lastName}`}
                                    </option>
                                  ))}
                                </Select>
                                {touched.workerId &&
                                  Boolean(errors.workerId) && (
                                    <FormHelperText error>
                                      {errors.workerId}
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
                                label="Details"
                                value={values.details}
                                error={
                                  touched.details && Boolean(errors.details)
                                }
                                helperText={touched.details && errors.details}
                                fullWidth
                                multiline
                                minRows={5}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                my={2}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <TextField
                                name="notes"
                                label="Notes"
                                value={values.notes}
                                error={touched.notes && Boolean(errors.notes)}
                                helperText={touched.notes && errors.notes}
                                fullWidth
                                multiline
                                minRows={5}
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
                                error={
                                  touched.estimatedCost &&
                                  Boolean(errors.estimatedCost)
                                }
                                helperText={
                                  touched.estimatedCost && errors.estimatedCost
                                }
                                variant="outlined"
                                my={2}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <LucideDollarSign size={16} />
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
                                error={
                                  touched.actualCost &&
                                  Boolean(errors.actualCost)
                                }
                                helperText={
                                  touched.actualCost && errors.actualCost
                                }
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
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </CardContent>
              </Card>
            </DialogContent>
            <DialogActions sx={{ mb: 2, mr: 2 }}>
              <Button
                onClick={() => {
                  resetForm();
                  openHandler(false);
                }}
                color="secondary"
                variant="outlined"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Save
              </Button>
            </DialogActions>
          </Form>
        </Dialog>
      )}
    </Formik>
  );
}
