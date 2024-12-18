import React, { createContext, useContext, useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from '../firebase';

const FileManagerContext = createContext();

export const FileManagerProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('myDrive');
  const [starredFiles, setStarredFiles] = useState(new Set());
  const [deletedFiles, setDeletedFiles] = useState([]);

  // Fetch files from Firestore
  useEffect(() => {
    const unsubscribe = db.collection('myFiles')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const fetchedFiles = snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
          isDeleted: false
        }));
        setFiles(fetchedFiles);
        filterFiles(fetchedFiles, searchQuery, currentView);
      });

    return () => unsubscribe();
  }, []);

  // Filter files based on search query and current view
  const filterFiles = (allFiles, query, view) => {
    let filtered = allFiles;

    // Apply search filter
    if (query) {
      filtered = filtered.filter(file =>
        file.data.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply view filter
    switch (view) {
      case 'myDrive':
        filtered = filtered.filter(file => !file.isDeleted);
        break;
      case 'starred':
        filtered = filtered.filter(file => starredFiles.has(file.id));
        break;
      case 'recent':
        filtered = filtered
          .filter(file => !file.isDeleted)
          .sort((a, b) => new Date(b.data.uploadDate) - new Date(a.data.uploadDate))
          .slice(0, 20);
        break;
      case 'bin':
        filtered = deletedFiles;
        break;
      default:
        break;
    }

    setFilteredFiles(filtered);
  };

  // Update filters when dependencies change
  useEffect(() => {
    filterFiles(files, searchQuery, currentView);
  }, [files, searchQuery, currentView, starredFiles, deletedFiles]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const toggleStarred = async (fileId) => {
    const newStarredFiles = new Set(starredFiles);
    if (newStarredFiles.has(fileId)) {
      newStarredFiles.delete(fileId);
    } else {
      newStarredFiles.add(fileId);
    }
    setStarredFiles(newStarredFiles);
  };

  const moveToTrash = (file) => {
    setDeletedFiles(prev => [...prev, { ...file, isDeleted: true }]);
    setFiles(prev => prev.filter(f => f.id !== file.id));
  };

  const restoreFromTrash = (fileId) => {
    const fileToRestore = deletedFiles.find(f => f.id === fileId);
    if (fileToRestore) {
      setDeletedFiles(prev => prev.filter(f => f.id !== fileId));
      setFiles(prev => [...prev, { ...fileToRestore, isDeleted: false }]);
    }
  };

  const permanentlyDelete = async (fileId) => {
    try {
      await db.collection('myFiles').doc(fileId).delete();
      setDeletedFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const value = {
    files: filteredFiles,
    searchQuery,
    currentView,
    starredFiles,
    deletedFiles,
    handleSearch,
    handleViewChange,
    toggleStarred,
    moveToTrash,
    restoreFromTrash,
    permanentlyDelete
  };

  return (
    <FileManagerContext.Provider value={value}>
      {children}
    </FileManagerContext.Provider>
  );
};

export const useFileManager = () => {
  const context = useContext(FileManagerContext);
  if (!context) {
    throw new Error('useFileManager must be used within a FileManagerProvider');
  }
  return context;
};