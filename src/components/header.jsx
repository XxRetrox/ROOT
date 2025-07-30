import React from "react";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

function Header(props) {
  return (
    <header>
      <button className="bnt-header" id="header-bnt" type="button">
        <AutoStoriesIcon fontSize="large"></AutoStoriesIcon>
      </button>
      <h1>Keeper</h1>
    </header>
  );
}

export default Header;
