import React from 'react'
import NewFile from './NewFile'
import SidebarItem from './SidebarItem'
import '../../styles/Sidebar.css'

import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StorageIcon from '@mui/icons-material/InsertDriveFile';

const index = () => {
  return (
    <div className="sideBar">
        <NewFile/>
        <div className="sidebar__itemsContainer">
            <SidebarItem arrow icon={(<InsertDriveFileIcon />)} label={'My Drive'} />
            <SidebarItem arrow icon={(<ImportantDevicesIcon />)} label={'Computers'} />
            <SidebarItem icon={(<PeopleAltIcon />)} label={'Shared with me'} />
            <SidebarItem icon={(<QueryBuilderIcon />)} label={'Recent'} />
            <SidebarItem icon={(<StarBorderIcon />)} label={'Starred'} />
            <SidebarItem icon={(<DeleteOutlineIcon />)} label={'Bin'} />
            <hr/>

            <SidebarItem icon={(<StorageIcon/>)} label={'Storage'} /> 
        </div>
    </div>
  )
}

export default index