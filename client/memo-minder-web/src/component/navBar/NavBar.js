import { Link } from "react-router-dom";
import "./NavBar.css";
import React, { useState } from "react";
import { getAuthInfo } from '../../utils/auth'

function Navbar({ coin, showTaskArea, showShop, showChallenge, showMilestones, handleTaskClick, handleShopClick, handleChallengeClick, handleMilestonesClick }) {
  const [open, setOpen] = useState(false);
  const [username, setUserName] = useState(getAuthInfo()?.username);

  const handleShopLinkClick = () => {
    setOpen(false); 
    handleShopClick(); 
    scrollToBottom(); // scroll to the end of the page
  };
  const handleChallengeLinkClick = () => {
    setOpen(false); 
    handleChallengeClick(); 
    scrollToBottom(); // scroll to the end of the page
  };

  const handleMilestonesLinkClick = () => {
    setOpen(false);
    handleMilestonesClick();
    scrollToBottom(); // scroll to the end of the page
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 200); // excute after 200
  };

  return (
    <nav>
      <div className="nav-left">
        <Link className="logo" to="/">
          MEMO MINDER
        </Link>
        <Link to="/" onClick={handleTaskClick} className={showTaskArea ? "active" : ""}>
          <span>Tasks</span>
        </Link>
        <Link to="/" onClick={handleShopLinkClick} className={showShop ? "active" : ""}>
          <span>Shops</span>
        </Link>
        <Link to="/" onClick={handleChallengeLinkClick} className={showChallenge ? "active" : ""}>
          <span>Challenges</span>
        </Link>
        <Link to="/" onClick={handleMilestonesLinkClick} className={showMilestones ? "active" : ""}>
          <span>Milestones</span>
        </Link>
      </div>
      <div className="nav-middle"></div>
      <div className="nav-right">
        <div className="coin">
          <img className="coin-icon" src="/coin.png" alt=""/>
          <div className="coin-number">{coin}</div>
        </div>
        
        <div className="user">
          <img
            className="user-pic"
            src="/user-pic.png"
            alt=""
            onClick={() => {
              setOpen(!open);
            }}
          />
          <span className="user-name">{username}</span>
        </div>
      </div>
      {/* User dropdown menu */}
      <div className={`user-menu ${open ? "active" : "inactive"}`}>
        <ul>
          <UserMenu text={"Log Out"} />
        </ul>
      </div>
    </nav>
  );
}

function UserMenu(props) {
  return (
    <li className="user-menu-item">
      {/* just for eslint scan */}
      <a href="/login" className="logout-link">
        {" "}
        {props.text}{" "}
      </a>
    </li>
  );
}

export default Navbar;
