import { Dialog } from "@mui/material";
import { Formik } from "formik";

export default function NewTaskDialog() {
  const initValues = {};
  const validationSchema = {};
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
        <Dialog open={open}>
          <Form onSubmit={handleSubmit}></Form>
        </Dialog>
      )}
    </Formik>
  );
}
