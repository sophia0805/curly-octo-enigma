import React from 'react';
import { useFileManager } from '../../components/FileManagerContext.js';
import NewFile from './NewFile';
import SidebarItem from './SidebarItem';
import '../../styles/Sidebar.css';

import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StorageIcon from '@mui/icons-material/InsertDriveFile';

const index = () => {
  const { currentView, handleViewChange } = useFileManager();

  const sidebarItems = [
    { id: 'myDrive', icon: InsertDriveFileIcon, label: 'My Drive', arrow: true },
    { id: 'computers', icon: ImportantDevicesIcon, label: 'Computers', arrow: true },
    { id: 'shared', icon: PeopleAltIcon, label: 'Shared with me' },
    { id: 'recent', icon: QueryBuilderIcon, label: 'Recent' },
    { id: 'starred', icon: StarBorderIcon, label: 'Starred' },
    { id: 'bin', icon: DeleteOutlineIcon, label: 'Bin' },
    { id: 'storage', icon: StorageIcon, label: 'Storage' }
  ];

  return (
    <div className="sideBar">
      <NewFile />
      <div className="sidebar__itemsContainer">
        {sidebarItems.map((item) => (
          <div 
            key={item.id}
            onClick={() => handleViewChange(item.id)}
          >
            <SidebarItem
              arrow={item.arrow}
              icon={<item.icon />}
              label={item.label}
              active={currentView === item.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default index;