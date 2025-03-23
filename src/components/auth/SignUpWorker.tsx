import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  Alert as MuiAlert,
  Button as MuiButton,
  TextField as MuiTextField,
  Typography,
  Link,
} from "@mui/material";
import { spacing } from "@mui/system";

import useAuth from "@/hooks/useAuth";
import { Profiles } from "enums/enums";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

const Centered = styled(Typography)`
  text-align: center;
`;

function SignUpWorker() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  // merca phone regex /^\d{3}-\d{3}-\d{4}$/
  // international phone regex /^\+?[1-9]\d{1,14}$/,
  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        startDate: "",
        title: "",
        payRate: 22.47,
        lessorId: "acf09642-3bb3-4ee9-9b19-d5d63012caa2", //default for now
        paymentMethod: "check", // default for now
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().max(255).required("First name is required"),
        lastName: Yup.string().max(255).required("Last name is required"),
        phone: Yup.string()
          .min(10)
          .max(10)
          .required("Phone number is required"),
        username: Yup.string().min(2).max(30).required("Username is required"),
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
        password: Yup.string()
          .min(2, "Must be at least 12 characters")
          .max(255)
          .required("Password is required"),
        confirmPassword: Yup.string().oneOf(
          // @ts-expect-error null not assignable
          [Yup.ref("password"), null],
          "Passwords must match"
        ),
        title: Yup.string()
          .min(2, "Title must be atleast 2 characters")
          .max(100, "Title must be 100 or less characters")
          .required("Title is required"),
        startDate: Yup.string()
          .matches(
            /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/,
            "Start date must be in MM/DD/YYYY format"
          )
          .test("format", "Invlaid date", function (value) {
            if (!value) return true;
            const [month, day, year] = value.split("/").map(Number);
            const date = new Date(year, month - 1, day);
            return (
              date.getFullYear() === year &&
              date.getMonth() === month - 1 &&
              date.getDate() === day
            );
          })
          .required("start date is required"),
        payRate: Yup.string()
          .matches(
            /^\d{1,2}\.\d{2}$/,
            "Invalid pay rate, must be in xxxx.xx format"
          )
          .required("Pay rate is required"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        console.log("signing up");
        try {
          signUp(
            values.firstName,
            values.lastName,
            values.phone,
            values.email,
            values.username,
            values.password,
            Profiles.Worker
          );
          navigate("/");
        } catch (error: any) {
          const message = error.message || "Something went wrong";

          setStatus({ success: false });
          setErrors({ submit: message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert mt={2} mb={1} severity="warning">
              {errors.submit}
            </Alert>
          )}
          <TextField
            type="text"
            name="firstName"
            label="First name"
            value={values.firstName}
            error={Boolean(touched.firstName && errors.firstName)}
            fullWidth
            helperText={touched.firstName && errors.firstName}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="text"
            name="lastName"
            label="Last name"
            value={values.lastName}
            error={Boolean(touched.lastName && errors.lastName)}
            fullWidth
            helperText={touched.lastName && errors.lastName}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="text"
            name="phone"
            label="Phone"
            value={values.phone}
            error={Boolean(touched.phone && errors.phone)}
            fullWidth
            helperText={touched.phone && errors.phone}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="email"
            name="email"
            label="Email address"
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="text"
            name="username"
            label="Username"
            value={values.username}
            error={Boolean(touched.username && errors.username)}
            fullWidth
            helperText={touched.username && errors.username}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />

          <TextField
            type="password"
            name="password"
            label="Password"
            value={values.password}
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="password"
            name="confirmPassword"
            label="Confirm password"
            value={values.confirmPassword}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            fullWidth
            helperText={touched.confirmPassword && errors.confirmPassword}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />

          <TextField
            name="startDate"
            label="Start Date"
            value={values.startDate}
            error={touched.startDate && Boolean(errors.startDate)}
            helperText={touched.startDate && errors?.startDate}
            onBlur={handleBlur}
            onChange={handleChange}
            fullWidth
            my={3}
          />

          <TextField
            name="title"
            label="Job Title"
            value={values.title}
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title && errors.title}
            onBlur={handleBlur}
            onChange={handleChange}
            fullWidth
            my={3}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            mb={3}
          >
            Sign up
          </Button>
          <Centered>
            Already have an account?{" "}
            <Link to="../sign-in" component={RouterLink}>
              Log in
            </Link>
          </Centered>
        </form>
      )}
    </Formik>
  );
}

export default SignUpWorker;
