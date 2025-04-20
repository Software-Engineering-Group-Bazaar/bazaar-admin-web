import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  IconButton,
} from '@mui/material';
import { CloudUpload, Cancel } from '@mui/icons-material';

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
          status: file.size > MAX_SIZE_MB * 1024 * 1024 ? 'error' : 'success',
        })),
      ]);

      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
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
          border: '2px dashed #ccc',
          borderRadius: 4,
          px: 4,
          py:1,
          textAlign: 'center',
          backgroundColor: isDragActive ? '#f0f0f0' : '#fafafa',
          cursor: 'pointer',
          mb: 2,
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 40, color: '#00BCD4' }} />
        <Typography variant='h6' mt={1}>
          Drag files to upload
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          or
        </Typography>
        <Button variant='outlined' sx={{ mt: 1 }}>
          Browse Files
        </Button>
        <Typography variant='caption' display='block' mt={1}>
          Max file size: 50MB — Supported types: JPG, PNG, GIF, SVG, WEBP
        </Typography>
      </Box>

      {/* File Preview List */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 1.5,
          py: 1,
          px: 0.5,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            height: 6,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#bbb',
            borderRadius: 20,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
        }}
      >
        {files.map((f, i) => (
          <Box
            key={i}
            sx={{
              minWidth: 180,
              maxWidth: 180,
              px: 1.5,
              py: 1,
              border: '1px solid #ddd',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              backgroundColor: '#fdfdfd',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              position: 'relative',
            }}
          >
            <IconButton
              size='small'
              onClick={() => removeFile(f.name)}
              sx={{ position: 'absolute', top: 4, right: 4 }}
            >
              <Cancel fontSize='small' />
            </IconButton>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor:
                    f.status === 'success' ? '#4caf50' : '#f44336',
                }}
              />
              <Typography fontSize={12} noWrap>
                {f.name}
              </Typography>
            </Box>

            <Typography fontSize={11} color='text.secondary'>
              {formatSize(f.size)}
            </Typography>

            <LinearProgress
              variant='determinate'
              value={100}
              color={f.status === 'success' ? 'primary' : 'error'}
              sx={{ height: 5, borderRadius: 3 }}
            />

            {f.status === 'error' && (
              <Typography
                variant='caption'
                color='error'
                fontSize={11}
                sx={{ mt: 0.5 }}
              >
                File too large
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ImageUploader;
