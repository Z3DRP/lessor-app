import {
  Box as MuiBox,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  TextField as MuiTextField,
} from "@mui/material";
import { Typography } from "../ui/Typography";
import { Formik } from "formik";
import * as Yup from "yup";
import { Address, Property } from "@/types/property";
import { propertyApi } from "api/properties";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { PropertyStatus } from "enums/enums";
import { useState } from "react";
import { TransitionAlert } from "../ui/CustomAlerts";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";

const Card = styled(MuiCard)(spacing);
const Box = styled(MuiBox)(spacing);
const Button = styled(MuiButton)<ButtonProps>(spacing);
const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

type NewPropertyDialogProps = {
  lessorId: string;
  open: boolean;
  openSetter: (isOpen: boolean) => void;
  createPropertyHandler: (data: Partial<Property>) => Promise<any>;
};
export function NewPropertyDialog({
  lessorId,
  open,
  openSetter,
  createPropertyHandler,
}: NewPropertyDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState<string | undefined>();

  const newPropertyHandler = async (
    alsrId: string,
    addrs: Address,
    beds: number,
    baths: number,
    sqFt: number | undefined,
    available: boolean,
    status: PropertyStatus | undefined,
    notes: string | undefined,
    taxDue: number | undefined,
    txRate: number | undefined,
    occupancy: number | undefined
  ): Promise<boolean> => {
    const property = {
      alessorId: alsrId,
      address: addrs,
      bedrooms: beds,
      baths: baths,
      ...(sqFt != undefined && { squareFootage: sqFt }),
      ...(available != undefined && { isAvailable: available }),
      ...(status != undefined && { status }),
      ...(notes != undefined && { notes }),
      ...(taxDue != undefined && { taxAmountDue: taxDue }),
      ...(txRate != undefined && { taxRate: txRate }),
      ...(occupancy != undefined && { maxOccupancy: occupancy }),
    };

    try {
      const result = await createPropertyHandler(property);

      if (!result.successe) {
        enqueueSnackbar("an error occurred while saving property", {
          variant: "error",
        });
        setError(result.err);
        return false;
      }

      enqueueSnackbar("property saved successfully", { variant: "success" });
      return true;
    } catch (err) {
      enqueueSnackbar("an unexpected error occurred while saving property", {
        variant: "error",
      });
      setError(`${err}`);
      return false;
    }
  };

  const initValues = {
    street: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    bedrooms: 0,
    baths: 0,
    squareFootage: 0.0,
    isAvailable: false,
    status: PropertyStatus.Unknown,
    notes: "",
    taxRate: 0.0,
    taxAmountDue: 0.0,
    maxOccupancy: 1,
  };

  const validationSchema = Yup.object().shape({
    street: Yup.string().min(2).max(150).required("Street is required"),
    city: Yup.string().min(2).max(150).required("City is required"),
    state: Yup.string().min(2).max(75).required("State is required"),
    country: Yup.string().min(2).max(75).required("Country is required"),
    zipcode: Yup.string().min(5).max(5).required("Zipcode is required"),
    bedrooms: Yup.number()
      .min(1)
      .max(20)
      .required("Number of rooms is required"),
    baths: Yup.number().min(1).max(20).required("Number of baths is required"),
    squareFootage: Yup.number().min(1).optional(),
    isAvailable: Yup.boolean().required(
      "Must specifiy if property is available"
    ),
    status: Yup.string()
      .oneOf(Object.values(PropertyStatus))
      .required("Status is required"),
    notes: Yup.string().optional(),
    taxRate: Yup.number().min(0.01).max(1).optional(),
    taxAmountDue: Yup.number().min(0).optional(),
    maxOccupancy: Yup.number().min(1).optional(),
  });

  return (
    <Dialog
      open={open}
      onClose={() => openSetter(false)}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle id="form-dialog-title">
        <Typography variant="h3">Create</Typography>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);

            const address: Address = {
              street: values.street,
              city: values.city,
              state: values.state,
              country: values.country,
              zipcode: values.zipcode,
            };

            const success = await newPropertyHandler(
              lessorId,
              address,
              values.bedrooms,
              values.baths,
              values.squareFootage,
              values.isAvailable,
              values?.status,
              values?.notes,
              values?.taxRate,
              values?.taxAmountDue,
              values?.maxOccupancy
            );

            if (!success) {
              setSubmitting(false);
              resetForm();
              return;
            }

            setSubmitting(false);
            openSetter(false);
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            isSubmitting,
            touched,
            values,
          }) => (
            <Card mb={6}>
              <CardContent>
                <TransitionAlert
                  isOpen={error != undefined}
                  variant="error"
                  message={error ?? ""}
                  closeHandler={() => setError(undefined)}
                />

                {isSubmitting ? (
                  <Box display="flex" justifyContent="center" my={6}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12 }}>
                      <Grid container direction="row" spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            name="street"
                            label="Street Address"
                            value={values.street}
                            error={Boolean(touched.street && errors.street)}
                            fullWidth
                            helperText={touched.street && errors.street}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                            my={2}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            name="city"
                            label="City"
                            value={values.city}
                            error={Boolean(touched.city && errors.city)}
                            fullWidth
                            helperText={touched.city && errors.city}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                            my={2}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid>
                      <Grid container size={{ xs: 12 }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <FormControl fullWidth>
                            <InputLabel id="country-field">Country</InputLabel>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          )}
        </Formik>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => openSetter(false)} color="warning">
          Cancel
        </Button>
        <Button
          onClick={() => openSetter(false)}
          color="primary"
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
