import React from 'react';
import { useFileManager } from '../FileManagerContext';
import '../../styles/Header.css';
import storageLogo from '../../pics/storage.png';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AppsIcon from '@mui/icons-material/Apps';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';

const Header = ({ userPhoto }) => {
  const { searchQuery, handleSearch } = useFileManager();

  const handleSearchChange = (e) => {
    handleSearch(e.target.value);
  };

  return (
    <div className="header">
      <div className="header__logo">
        <img src={storageLogo} alt=""/>
        <span>Drive</span>
      </div>
      <div className="header__searchContainer">            
        <div className="header__searchBar">
          <SearchIcon/>
          <input 
            type='text' 
            placeholder='Search in storage'
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <ExpandMoreIcon/>
        </div>
      </div>
      <div className="header__icons">
        <span>
          <HelpOutlineIcon/>
          <SettingsIcon/>
        </span>
        <AppsIcon/>
        <img src={userPhoto} alt="User Photo"/>
      </div>
    </div>
  );
};

export default Header;