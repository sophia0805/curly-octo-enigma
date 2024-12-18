import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Typography,
  ButtonGroup,
  Button,
  Tooltip
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  GridView as GridViewIcon,
  List as ListIcon,
  Description as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { db } from '../../firebase';

const FileDisplay = () => {
  const [files, setFiles] = useState([]);
  const [view, setView] = useState('list');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const unsubscribe = db.collection('myFiles')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setFiles(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          }))
        );
      });

    return () => unsubscribe();
  }, []);

  const handleMenuClick = (event, file) => {
    setAnchorEl(event.currentTarget);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.data.data;
    link.download = file.data.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleMenuClose();
  };

  const handleDelete = async (file) => {
    try {
      await db.collection('myFiles').doc(file.id).delete();
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <ImageIcon />;
    if (fileType.includes('pdf')) return <PdfIcon />;
    return <FileIcon />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const ListView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Modified</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id} hover>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  {getFileIcon(file.data.type)}
                  {file.data.name}
                </Box>
              </TableCell>
              <TableCell>{file.data.type}</TableCell>
              <TableCell>{formatFileSize(file.data.size)}</TableCell>
              <TableCell>{formatDate(file.data.uploadDate)}</TableCell>
              <TableCell align="right">
                <IconButton onClick={(e) => handleMenuClick(e, file)}>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const GridView = () => (
    <Grid container spacing={2}>
      {files.map((file) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
          <Card variant="outlined">
            <CardContent>
              <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="flex-start"
              >
                <Box display="flex" alignItems="center" gap={1}>
                  {getFileIcon(file.data.type)}
                  <Typography variant="subtitle1" noWrap sx={{ maxWidth: 150 }}>
                    {file.data.name}
                  </Typography>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={(e) => handleMenuClick(e, file)}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="textSecondary">
                {formatFileSize(file.data.size)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Modified: {formatDate(file.data.uploadDate)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5">My Files</Typography>
        <ButtonGroup variant="outlined">
          <Tooltip title="List view">
            <Button 
              onClick={() => setView('list')}
              variant={view === 'list' ? 'contained' : 'outlined'}
            >
              <ListIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Grid view">
            <Button 
              onClick={() => setView('grid')}
              variant={view === 'grid' ? 'contained' : 'outlined'}
            >
              <GridViewIcon />
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Box>

      {view === 'list' ? <ListView /> : <GridView />}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleDownload(selectedFile)}>
          <DownloadIcon sx={{ mr: 1 }} /> Download
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedFile)}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FileDisplay;