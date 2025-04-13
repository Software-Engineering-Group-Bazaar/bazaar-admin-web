import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { CloudUpload, Cancel } from "@mui/icons-material";

const MAX_SIZE_MB = 50;

const ImageUploader = ({ onFilesSelected }) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles((prev) => [
  ...prev,
  ...acceptedFiles.map((file) => ({
    name: file.name,
    size: file.size,
    status: file.size > MAX_SIZE_MB * 1024 * 1024 ? "error" : "success",
  })),
]);

onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
    maxSize: MAX_SIZE_MB * 1024 * 1024,
  });

  const formatSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  const removeFile = (name) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  return (
    <Box>
      {/* Dropzone */}
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #ccc",
          borderRadius: 4,
          p: 4,
          textAlign: "center",
          backgroundColor: isDragActive ? "#f0f0f0" : "#fafafa",
          cursor: "pointer",
          mb: 2,
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 40, color: "#00BCD4" }} />
        <Typography variant="h6" mt={1}>
          Drag files to upload
        </Typography>
        <Typography variant="body2" color="textSecondary">
          or
        </Typography>
        <Button variant="outlined" sx={{ mt: 1 }}>
          Browse Files
        </Button>
        <Typography variant="caption" display="block" mt={1}>
          Max file size: 50MB — Supported types: JPG, PNG, GIF, SVG, WEBP
        </Typography>
      </Box>

      {/* File Preview List */}
      {files.map((f, i) => (
        <Box
          key={i}
          sx={{
            mb: 1,
            px: 2,
            py: 1,
            border: "1px solid #ddd",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: f.status === "success" ? "#3f51b5" : "#f44336",
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography fontSize={14}>
              {f.name} &nbsp; {formatSize(f.size)}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={100}
              color={f.status === "success" ? "primary" : "error"}
              sx={{ mt: 0.5, height: 6, borderRadius: 5 }}
            />
            {f.status === "error" && (
              <Typography variant="caption" color="error">
                File size exceeds the limit
              </Typography>
            )}
          </Box>
          <IconButton onClick={() => removeFile(f.name)}>
            <Cancel fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default ImageUploader;
