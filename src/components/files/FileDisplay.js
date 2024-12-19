import React, { useState } from 'react';
import { useFileManager } from '../FileManagerContext';
import { db } from '../../firebase';
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
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';

const FileDisplay = () => {
  const { 
    files, 
    searchQuery,
    currentView,  // Make sure this is properly destructured
    starredFiles,
    toggleStarred,
    moveToTrash,
    restoreFromTrash,
    permanentlyDelete
  } = useFileManager();
  
  const [view, setView] = useState('list');
  const [menuState, setMenuState] = useState({
    anchorEl: null,
    selectedFile: null
  });

  const handleMenuClick = (event, file) => {
    event.stopPropagation();
    setMenuState({
      anchorEl: event.currentTarget,
      selectedFile: file
    });
  };

  const handleMenuClose = () => {
    setMenuState({
      anchorEl: null,
      selectedFile: null
    });
  };

  const handleFileAction = (action) => {
    const { selectedFile } = menuState;
    if (!selectedFile) return;

    switch (action) {
      case 'download':
        const link = document.createElement('a');
        link.href = selectedFile.data.data;
        link.download = selectedFile.data.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      case 'trash':
        moveToTrash(selectedFile);
        break;
      case 'restore':
        restoreFromTrash(selectedFile.id);
        break;
      case 'delete':
        permanentlyDelete(selectedFile.id);
        break;
      default:
        break;
    }
    handleMenuClose();
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
                  <IconButton 
                    size="small" 
                    onClick={() => toggleStarred(file.id)}
                  >
                    {starredFiles.has(file.id) ? <StarIcon color="warning" /> : <StarBorderIcon />}
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>{file.data.type}</TableCell>
              <TableCell>{formatFileSize(file.data.size)}</TableCell>
              <TableCell>{formatDate(file.data.uploadDate)}</TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={(e) => handleMenuClick(e, file)}
                  aria-label="more options"
                >
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
                  <IconButton 
                    size="small" 
                    onClick={() => toggleStarred(file.id)}
                  >
                    {starredFiles.has(file.id) ? <StarIcon color="warning" /> : <StarBorderIcon />}
                  </IconButton>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuClick(e, file)}
                  aria-label="more options"
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
        <Typography variant="h5">
          {currentView === 'myDrive' && 'My Drive'}
          {currentView === 'starred' && 'Starred'}
          {currentView === 'recent' && 'Recent'}
          {currentView === 'bin' && 'Bin'}
          {searchQuery && ` - Search results for "${searchQuery}"`}
        </Typography>
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

      {files.length === 0 && (
        <Typography variant="body1" color="textSecondary" align="center" py={4}>
          {searchQuery 
            ? `No files found matching "${searchQuery}"`
            : currentView === 'starred'
            ? 'No starred files'
            : currentView === 'bin'
            ? 'Bin is empty'
            : 'No files'}
        </Typography>
      )}

      {files.length > 0 && (view === 'list' ? <ListView /> : <GridView />)}

      <Menu
        anchorEl={menuState.anchorEl}
        open={Boolean(menuState.anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleFileAction('download')}>
          <DownloadIcon sx={{ mr: 1 }} /> Download
        </MenuItem>
        {currentView === 'bin' ? (
          <>
            <MenuItem onClick={() => handleFileAction('restore')}>
              <FileIcon sx={{ mr: 1 }} /> Restore
            </MenuItem>
            <MenuItem onClick={() => handleFileAction('delete')}>
              <DeleteIcon sx={{ mr: 1 }} /> Delete Forever
            </MenuItem>
          </>
        ) : (
          <MenuItem onClick={() => handleFileAction('trash')}>
            <DeleteIcon sx={{ mr: 1 }} /> Move to Bin
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default FileDisplay;