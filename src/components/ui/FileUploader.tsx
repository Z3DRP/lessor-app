import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box } from "@mui/material";
import { Icon } from "@iconify/react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function Dropzone(props: { required?: boolean; name: string }) {
  const { required, name } = props;
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    onDrop: (incomingFiles) => {
      if (incomingFiles.length === 0) return;

      const file = incomingFiles[0];
      setPreview(URL.createObjectURL(file));

      if (hiddenInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        hiddenInputRef.current.files = dataTransfer.files;
      }
    },
    accept: {
      "image/*": [],
    },
  });

  return (
    <div className="container">
      <div
        {...getRootProps({
          className: "dropzone",
        })}
        style={{
          position: "relative",
          width: "300px",
          height: "200px",
          border: "2px dashed #ccc",
          borderRadius: "8px",
          cursor: "pointer",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage: preview ? `url(${preview})` : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: preview ? "transparent" : "#666",
        }}
      >
        {/* Hidden file input for form submission */}
        <input
          type="file"
          name={name}
          required={required}
          style={{ opacity: 0, position: "absolute" }}
          ref={hiddenInputRef}
        />
        <input {...getInputProps()} />
        <p>
          {preview ? "" : "Drag 'n' drop an image here, or click to upload"}
        </p>
      </div>
    </div>
  );
}

export type InputFileUploaderProps = {
  imageUrl?: string;
  onUpload: (e: any) => Promise<void>;
};

export default function InputFileUploader({
  imageUrl,
  onUpload,
}: InputFileUploaderProps) {
  useEffect(() => {
    if (imageUrl) {
      setPreview(imageUrl);
    }
  }, [imageUrl]);

  const [preview, setPreview] = useState<string | null>(null);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setPreview(URL.createObjectURL(file));

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      await onUpload(dataTransfer.files);
    },
    accept: {
      "image/*": [],
    },
    noClick: true,
    noKeyboard: true,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        position: "relative",
        width: "100%",
        height: "250px",
        border: "2px dashed #ccc",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: preview ? `url(${preview})` : "none",
      }}
    >
      <input {...getInputProps()} />
      {!preview && <p>Drag & Drop an image here</p>}
      <Button
        component="label"
        role={undefined}
        variant="contained"
        onClick={open}
        tabIndex={-1}
        startIcon={<Icon icon="ic:baseline-cloud-upload" />}
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
      >
        Upload Image
      </Button>
    </Box>
  );
}
