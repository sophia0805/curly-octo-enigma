import React, { useState, useEffect } from 'react';
import {
  List,
  Paper,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import FileItem from './FileItem';
import { db } from '../../firebase';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = db.collection('myFiles')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setFiles(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
        );
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (files.length === 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
      >
        <Typography color="textSecondary">
          No files uploaded yet
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={0} sx={{ mt: 2 }}>
      <List>
        {files.map((file) => (
          <FileItem key={file.id} file={file} />
        ))}
      </List>
    </Paper>
  );
};

export default FileList;