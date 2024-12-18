import React, { useState } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Button, 
  IconButton,
  LinearProgress,
  styled,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../styles/SidebarItem.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from '../../firebase';

const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  padding: '24px',
  maxHeight: '80vh',
  overflowY: 'auto'
}));

const UploadButton = styled(Button)({
  marginTop: '20px',
  width: '100%'
});

const FileInput = styled('input')({
  display: 'none'
});

const DropZone = styled(Box)(({ isDragActive, hasFiles }) => ({
  border: '2px dashed #ccc',
  borderRadius: '8px',
  padding: '40px 20px',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: isDragActive ? '#f0f7ff' : hasFiles ? '#e8f5e9' : '#fafafa',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#f0f7ff',
    borderColor: '#2196f3'
  }
}));

const NewFile = () => {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFiles([]);
    setUploadProgress({});
    setError('');
    setUploading(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setError('');
  };

  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    try {
      setUploading(true);
      
      // Upload files sequentially to maintain consistent progress
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadProgress(prev => ({ ...prev, [i]: 25 }));

        // Convert file to base64
        const base64File = await convertToBase64(file);
        setUploadProgress(prev => ({ ...prev, [i]: 50 }));

        // Create file metadata
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64File,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          uploadDate: new Date().toISOString(),
        };

        setUploadProgress(prev => ({ ...prev, [i]: 75 }));

        // Save to Firestore
        await db.collection('myFiles').add(fileData);
        setUploadProgress(prev => ({ ...prev, [i]: 100 }));
      }

      setTimeout(handleClose, 500);

    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload files. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="newFile">
      <div className="newFile__container" onClick={handleOpen}>
        <AddIcon fontSize="large" />
        <p>New</p>
      </div>

      <Modal open={open} onClose={handleClose}>
        <ModalBox>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Upload Files</Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <FileInput
            type="file"
            id="file-upload"
            onChange={handleChange}
            multiple
          />

          <label htmlFor="file-upload">
            <DropZone
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              isDragActive={dragActive}
              hasFiles={selectedFiles.length > 0}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                Drag and drop your files here
              </Typography>
              <Typography variant="body2" color="textSecondary">
                or click to select files
              </Typography>
            </DropZone>
          </label>

          {selectedFiles.length > 0 && (
            <List sx={{ mt: 2 }}>
              {selectedFiles.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    !uploading && (
                      <IconButton edge="end" onClick={() => removeFile(index)}>
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemText
                    primary={file.name}
                    secondary={formatFileSize(file.size)}
                  />
                  {uploading && (
                    <Box sx={{ width: 60, textAlign: 'right' }}>
                      {uploadProgress[index] !== undefined ? (
                        `${uploadProgress[index]}%`
                      ) : (
                        <CircularProgress size={20} />
                      )}
                    </Box>
                  )}
                </ListItem>
              ))}
            </List>
          )}

          <UploadButton
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!selectedFiles.length || uploading}
            startIcon={<CloudUploadIcon />}
          >
            {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length !== 1 ? 's' : ''}`}
          </UploadButton>
        </ModalBox>
      </Modal>
    </div>
  );
};

export default NewFile;