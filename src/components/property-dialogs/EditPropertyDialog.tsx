import {
  Box as MuiBox,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2 as Grid,
  InputAdornment,
  InputLabel,
  Select,
  Switch,
  TextField as MuiTextField,
} from "@mui/material";
import { Typography } from "../ui/Typography";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Address, Property } from "@/types/property";
import { useSnackbar } from "notistack";
import { PropertyStatus } from "enums/enums";
import { useEffect, useState } from "react";
import { TransitionAlert } from "../ui/CustomAlerts";
import styled from "@emotion/styled";
import { spacing, SpacingProps } from "@mui/system";
import { countryData } from "../../data/countryData";
import { LinearLoading } from "../ui/Loaders";
import InputFileUploader from "../ui/FileUploader";
import { nanoid } from "nanoid";
import { Percent } from "@mui/icons-material";
import { LucideDollarSign, LucidePercent } from "lucide-react";

const Card = styled(MuiCard)(spacing);
const Box = styled(MuiBox)(spacing);
interface ButtonProps extends SpacingProps {
  component?: string;
}
const Button = styled(MuiButton)<ButtonProps>(spacing);
const TextField = styled(MuiTextField)<{ my?: number }>(spacing);
const supportedCountries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Mexico",
];

type countryOption = {
  countryName: string;
  regions:
    | {
        name: string;
        shortCode: string;
      }
    | { name: string; shortCode?: string | undefined }[];
  countryShortCode: string;
};

type regionOption = {
  countryName: string;
  regionName: string;
  code?: string | undefined;
};

type EditPropertyDialogProps = {
  property: Partial<Property>;
  open: boolean;
  openSetter: (isOpen: boolean) => void;
  handleEdit: (
    property: Partial<Property>,
    address: Address,
    file?: File
  ) => Promise<any>;
  refreshSetter: () => void;
};

export function EditPropertyDialog({
  property,
  open,
  openSetter,
  handleEdit,
  refreshSetter,
}: EditPropertyDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState<string | undefined>();
  const [countries, setCountries] = useState<countryOption[]>();
  const [regionsByCountry, setRegionsByCountry] =
    useState<Map<string, regionOption[]>>();
  const [regions, setRegions] = useState<regionOption[]>();
  const [selectedFile, setSelectedFile] = useState<any>();

  useEffect(() => {
    console.log("selected proeprty: ", property);
  });

  useEffect(() => {
    const cData = countryData
      .filter((c) => supportedCountries.includes(c.countryName))
      .map((c) => c);

    setCountries(cData);

    const rData: regionOption[] = cData.flatMap((c) =>
      c.regions.map((r) => ({
        countryName: c.countryName,
        regionName: r.name,
        code: r.shortCode,
      }))
    );

    const cRegions = new Map<string, regionOption[]>();
    rData.forEach((r) => {
      if (cRegions.has(r.countryName)) {
        cRegions.get(r.countryName)?.push(r);
        return;
      }

      cRegions.set(r.countryName, [r]);
    });
    setRegionsByCountry(cRegions);
    setRegions(cRegions.get(property?.address?.country ?? ""));
  }, [property?.address?.country]);

  const handleSubmit = async (
    values: any,
    { resetForm, setSubmitting }: any
  ) => {
    console.log("begin submit");
    setSubmitting(true);

    const address: Address = {
      street: values.street,
      city: values.city,
      state: values.state,
      country: values.country,
      zipcode: values.zipcode,
    };

    const uProperty = {
      pid: property.pid,
      alessorId: property.alessorId,
      bedrooms: Number(values?.bedrooms),
      baths: Number(values?.baths),
      ...(values?.squareFootage != undefined && {
        squareFootage: Number(values?.squareFootage),
      }),
      ...(values?.isAvailable != undefined && {
        isAvailable: values?.isAvailable,
      }),
      ...(values?.status != undefined && { status: values?.status }),
      ...(values?.notes != undefined && { notes: values?.notes }),
      ...(values?.taxAmountDue != undefined && {
        taxAmountDue: Number(values?.taxAmountDue),
      }),
      ...(values?.taxRate != undefined && { taxRate: Number(values?.taxRate) }),
      ...(values?.maxOccupancy != undefined && {
        maxOccupancy: Number(values?.maxOccupancy),
      }),
      ...(values?.image != undefined && { image: values?.image }),
    };

    try {
      const { msg, success } = await handleEdit(
        uProperty,
        address,
        selectedFile
      );
      if (success) {
        openSetter(false);
        enqueueSnackbar("changes successfully saved", { variant: "success" });
        refreshSetter();
        return;
      }

      setError(msg);
      enqueueSnackbar("something went wrong", { variant: "error" });
    } catch (err: any) {
      setError(`${err.error ?? err.message ?? "something went wrong"}`);
    } finally {
      setSubmitting(false);
      resetForm();
    }
  };

  const initValues = {
    street: property?.address?.street || "",
    city: property?.address?.city || "",
    state: property?.address?.state || "default-state",
    country: property?.address?.country || "default-country",
    zipcode: property?.address?.zipcode || "",
    bedrooms: property?.bedrooms || 0,
    baths: property?.baths || 0,
    squareFootage: property?.squareFootage || 0,
    isAvailable: property?.isAvailable || false,
    status: property?.status || "default-status",
    notes: property?.notes || "",
    taxRate: property?.taxRate || 0.01,
    taxAmountDue: property?.taxAmountDue || 0.0,
    maxOccupancy: property?.maxOccupancy || 1,
    image: property?.image || "",
  };

  const schema = Yup.object().shape({
    street: Yup.string()
      .min(2, "Street must be at least 2 characters")
      .max(150, "Street cannot be more than 150 characters")
      .required("Street is required"),
    city: Yup.string()
      .min(2, "City must be more than 2 characters")
      .max(150, "City cannot be more than 150 characters")
      .required("City is required"),
    state: Yup.string().min(2).max(75).required("State is required"),
    country: Yup.string().min(2).max(75).required("Country is required"),
    zipcode: Yup.string()
      .min(5, "Zipcode must be 5 characters")
      .max(5, "Zipcode must be 5 characters")
      .required("Zipcode is required"),
    bedrooms: Yup.number()
      .min(1, "There must be at least 1 bedrrom")
      .max(20, "There cannot be more than 20 bedrooms")
      .required("Number of rooms is required"),
    baths: Yup.number()
      .min(1, "There must be atleast one bathroom")
      .max(20, "There cannot be more than 20 bathrooms")
      .required("Number of baths is required"),
    squareFootage: Yup.number()
      .min(1, "square footage must be more than 1")
      .optional(),
    isAvailable: Yup.boolean().optional(),
    status: Yup.string()
      .oneOf(Object.values(PropertyStatus))
      .required("Status is required"),
    notes: Yup.string().optional(),
    taxRate: Yup.number()
      .min(0.01, "Tax rate must at least be 0.01%")
      .max(1, "Tax rate cannot be more than 100%")
      .optional(),
    taxAmountDue: Yup.number().min(0.0).optional(),
    maxOccupancy: Yup.number()
      .min(1, "There must be alteast one occupant")
      .optional(),
    image: Yup.string().optional(),
  });

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
          aria-labelledby="form-dialog-title"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="form-dialog-title">
            <Typography variant="h3">Edit</Typography>
          </DialogTitle>
          <Form onSubmit={handleSubmit}>
            <DialogContent>
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
                      <LinearLoading />
                    </Box>
                  ) : (
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth sx={{ my: 2 }}>
                          <FormControlLabel
                            label="Available"
                            control={
                              <Switch
                                name="isAvailable"
                                checked={values?.isAvailable}
                                onChange={(e) =>
                                  setFieldValue("isAvailable", e.target.checked)
                                }
                                onBlur={handleBlur}
                              />
                            }
                          />
                          {errors.isAvailable && (
                            <FormHelperText error>
                              {errors.isAvailable}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
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

                      <Grid size={{ xs: 12 }}>
                        <Grid
                          container
                          size={{ xs: 12 }}
                          spacing={2}
                          justifyContent="center"
                        >
                          <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl
                              variant="outlined"
                              sx={{ my: 2 }}
                              fullWidth
                            >
                              <InputLabel id="country-id">Country</InputLabel>
                              <Select
                                name="country"
                                fullWidth
                                labelId="country-id"
                                label="Country"
                                defaultValue={values?.country}
                                native
                                onBlur={handleBlur}
                                error={Boolean(
                                  touched.country && errors.country
                                )}
                                onChange={(e: any) => {
                                  const selectedRegion = regionsByCountry?.get(
                                    e.target.value
                                  );
                                  setRegions(selectedRegion ?? []);
                                  setFieldValue("country", e.target.value);
                                }}
                              >
                                <option value="default-country" disabled>
                                  Select Country
                                </option>
                                {countries?.map((c) => (
                                  <option
                                    key={c.countryShortCode}
                                    value={c.countryName}
                                  >
                                    {c.countryName}
                                  </option>
                                ))}
                              </Select>
                              {touched.country && errors.country && (
                                <FormHelperText error>
                                  {errors.country}
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
                              <InputLabel id="state-id">State</InputLabel>
                              <Select
                                name="state"
                                native
                                fullWidth
                                defaultValue={values?.state}
                                labelId="state-id"
                                id="state-id"
                                label="State"
                                onBlur={handleBlur}
                                error={Boolean(touched.state && errors.state)}
                                onChange={(e: any) =>
                                  setFieldValue("state", e.target.value)
                                }
                              >
                                <option value="default-state">
                                  Select State
                                </option>
                                {regions?.map((r) => (
                                  <option key={r.code} value={r.regionName}>
                                    {r.code}
                                  </option>
                                ))}
                              </Select>
                              {touched.state && errors.state && (
                                <FormHelperText error>
                                  {errors.state}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                              name="zipcode"
                              label="Zipcode"
                              fullWidth
                              value={values.zipcode}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(touched.zipcode && errors.zipcode)}
                              helperText={touched.zipcode && errors.zipcode}
                              variant="outlined"
                              my={2}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Grid
                          container
                          size={{ xs: 12 }}
                          justifyContent="center"
                          spacing={2}
                        >
                          <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                              fullWidth
                              name="bedrooms"
                              label="Bedrooms"
                              value={values.bedrooms}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(
                                touched.bedrooms && errors.bedrooms
                              )}
                              helperText={touched.bedrooms && errors.bedrooms}
                              variant="outlined"
                              my={2}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                              fullWidth
                              name="baths"
                              label="Baths"
                              value={values.baths}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(touched.baths && errors.baths)}
                              helperText={touched.baths && errors.baths}
                              variant="outlined"
                              my={2}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                              fullWidth
                              name="squareFootage"
                              label="Square Footage"
                              value={values.squareFootage}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(
                                touched.squareFootage && errors.squareFootage
                              )}
                              helperText={
                                touched.squareFootage && errors.squareFootage
                              }
                              variant="outlined"
                              my={2}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                              fullWidth
                              name="maxOccupancy"
                              label="Max Occupancy"
                              value={values.maxOccupancy}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(
                                touched.maxOccupancy && errors.maxOccupancy
                              )}
                              helperText={
                                touched.maxOccupancy && errors.maxOccupancy
                              }
                              variant="outlined"
                              my={2}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Grid
                          container
                          size={{ xs: 12 }}
                          spacing={2}
                          justifyContent="flex-start"
                          justifyItems="center"
                        >
                          <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                              fullWidth
                              name="taxRate"
                              label="Tax Rate"
                              value={values.taxRate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(touched.taxRate && errors.taxRate)}
                              helperText={touched.taxRate && errors.taxRate}
                              variant="outlined"
                              my={2}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <LucidePercent size={18} />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                              fullWidth
                              name="taxAmountDue"
                              label="Tax Due"
                              value={values.taxAmountDue}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(
                                touched.taxAmountDue && errors.taxAmountDue
                              )}
                              helperText={
                                touched.taxAmountDue && errors.taxAmountDue
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
                          <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl
                              variant="outlined"
                              fullWidth
                              sx={{ my: 2 }}
                            >
                              <InputLabel id="status-id">Status</InputLabel>
                              <Select
                                name="status"
                                labelId="status-id"
                                label="Status"
                                defaultValue={
                                  values?.status || "default-status"
                                }
                                native
                                onBlur={handleBlur}
                                error={Boolean(touched.status && errors.status)}
                                onChange={(e: any) =>
                                  setFieldValue("status", e.target.value)
                                }
                              >
                                <option value="default-status">
                                  Select Status
                                </option>
                                {Object.values(PropertyStatus).map((ps) => (
                                  <option key={ps} value={ps}>
                                    {ps}
                                  </option>
                                ))}
                              </Select>
                              {touched.status && errors.status && (
                                <FormHelperText error>
                                  {errors.status}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              multiline
                              rows={4}
                              name="notes"
                              label="Notes"
                              value={values.notes}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(touched.notes && errors.notes)}
                              helperText={touched.notes && errors.notes}
                              variant="outlined"
                              my={2}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth sx={{ my: 2 }}>
                          <InputFileUploader
                            imageUrl={property.imageUrl}
                            onUpload={async (files) => {
                              if (!files || files.length === 0) return;

                              const file = files[0];

                              setSelectedFile(file);
                              setFieldValue("fileKey", `${nanoid(9)}`);
                            }}
                          />
                        </FormControl>
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
              <Button type="submit" color="primary" variant="contained">
                Save
              </Button>
            </DialogActions>
          </Form>
        </Dialog>
      )}
    </Formik>
  );
}
