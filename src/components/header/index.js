import React from 'react'
import '../../styles/Header.css'

import storageLogo from '../../pics/storage.png'
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AppsIcon from '@material-ui/icons/Apps';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import SettingsIcon from '@material-ui/icons/Settings';

const index = ( {userPhoto}) => {
  return (
    <div className="header">
        <div className="header__logo">
            <img src={storageLogo} alt=""/>
            <span>Drive</span>
        </div>
        <div className="header__searchContainer">            
            <div className="header__searchBar">
                <SearchIcon/>
                <input type='text' placeholder='Search in storage'/>
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
  )
}

export default index