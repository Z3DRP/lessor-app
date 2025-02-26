import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  SelectProps,
  TextField,
} from "@mui/material";
import { Typography } from "../ui/Typography";
import { Formik } from "formik";
import * as Yup from "yup";
import { Address, Property } from "@/types/property";
import { propertyApi } from "api/properties";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { PropertyStatus } from "enums/enums";
interface Option {
  label: string;
  value: string;
  key: string | number;
}

interface CustomRenderProps {
  options: Option[]
  customProps?: Partial<SelectProps>
}

const customRender: React.FC<CustomRenderProps & SelectProps> = ({ options, customProps, ...selectProps }) => (
  <Select {...selectProps} {...customProps}>
    {options.map(({ label, value, key }) => (
      <MenuItem value={value} key={key}>
        {label}
      </MenuItem>
    ))}
  </Select>
);

type NewPropertyDialogProps = {
  lessorId: string;
  open: boolean;
  openSetter: (isOpen: boolean) => void;
};
export function NewPropertyDialog({
  lessorId,
  open,
  openSetter,
}: NewPropertyDialogProps) {
  const { enqueueSnackbar } = useSnackbar()
  return (
    <Dialog
      open={open}
      onClose={() => openSetter(open)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Typography variant="h3">Create</Typography>
      </DialogTitle>
      <DialogContent>
        <Formik
         initialValues={{
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
          }} 
          validationSchema={Yup.object().shape({
            street: Yup.string().min(2).max(150).required("Street is required"),
            city: Yup.string().min(2).max(150).required("City is required"),
            state: Yup.string().min(2).max(75).required("State is required"),
            country: Yup.string().min(2).max(75).required("Country is required"),
            zipcode: Yup.string().min(5).max(5).required("Zipcode is required"),
            bedrooms: Yup.number().min(1).max(20).required("Number of rooms is required"),
            baths: Yup.number().min(1).max(20).required("Number of baths is required"),
            squareFootage: Yup.number().min(1).optional(),
            isAvailable: Yup.boolean().required("Must specifiy if property is available"),
            status: Yup.string().oneOf(Object.values(PropertyStatus)).required("Status is required"),
            notes: Yup.string().optional(),
            taxRate: Yup.number().min(0.01).max(1).optional(),
            taxAmountDue: Yup.number().min(0).optional(),
            maxOccupancy: Yup.number().min(1).optional(),
          })}
          onSubmit={async (values, {setErrors, setStatus, setSubmitting }) => {
            try {
              const address: Address = {
                street: values.street,
                city: values.city,
                state: values.state,
                country: values.country,
                zipcode: values.zipcode
              }

              propertyApi.createProperty(
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
              )

            } catch (err) {
              console.log(err)
              enqueueSnackbar(`${err}`, { variant: "error" })
            }
          }}
        ></Formik>
      </DialogContent>
      <DialogActions sx={{ m: 2 }}>
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
      </formi>
    </Dialog>
  );
}
