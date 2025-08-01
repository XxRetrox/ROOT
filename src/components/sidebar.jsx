import React, { useState, useEffect } from "react";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";

function SideBar(props) {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    const headerBtn = document.getElementById("header-bnt");
    const overlay = document.getElementById("overlay");

    if (headerBtn && overlay) {
      // Always check if the element exists
      headerBtn.addEventListener("click", toggleOpen);
      overlay.addEventListener("click", toggleClose);
      return () => {
        headerBtn.removeEventListener("click", toggleOpen);
        overlay.removeEventListener("click", toggleClose);
      };
    }
  }, []);

  async function logOut() {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/log-out`,
        {},
        {
          withCredentials: true,
        }
      );
      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (error) {
      console.log("Error logging out:", error);
    }
  }

  function toggleClose() {
    setToggle(false);
  }
  function toggleOpen() {
    setToggle(true);
  }

  const sidebarClass = `side-bar ${toggle ? "side-bar-open" : ""}`;

  useEffect(() => {
    props.v(`overlay ${toggle ? "visible" : ""}`);
  }, [toggle]);

  return (
    <div className={sidebarClass}>
      <div className="side-bar-header">
        <AutoStoriesIcon fontSize="medium"></AutoStoriesIcon>
        <h2 className="side-bar-h2">Notæble</h2>
        <button className="bnt-side-bar" onClick={toggleClose} type="button">
          <CancelIcon fontSize="medium"></CancelIcon>
        </button>
      </div>
      <div className="side-bar-body">
        <button className="log-out" onClick={logOut} type="button">
          Log Out
        </button>
      </div>
      <span className="version">Version 1.1.0</span>
    </div>
  );
}

export default SideBar;
