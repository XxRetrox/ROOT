import React, { useState } from "react";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Zoom from "@mui/material/Zoom";

function InputField(props) {
  const [isActive, setActive] = useState(false);

  function exp() {
    setActive(true);
  }

  function exp1() {
    setActive(!isActive);
  }

  return (
    <div className="content">
      <input
        value={props.tValue}
        onChange={props.onInput}
        placeholder="Title"
        className="title"
        type="text"
        name="title"
        id=""
      />
      <textarea
        value={props.teValue}
        onChange={props.onInput}
        className="textarea"
        name="content"
        id=""
        cols="30"
        rows={isActive ? "10" : "1"}
        placeholder="Enter text here"
        onClick={exp}
      ></textarea>
      <Zoom in={isActive}>
        <button onClick={props.onPost} className="bnt" type="button">
          <PostAddIcon></PostAddIcon>
        </button>
      </Zoom>
      <Zoom in={isActive}>
        <button onClick={exp1} className="bnt1" type="button">
          close
        </button>
      </Zoom>
    </div>
  );
}

export default InputField;
