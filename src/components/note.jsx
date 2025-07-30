import React, { useState } from "react";
import { format } from "date-fns";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

function Note(props) {
  var dateObj = new Date(props.created_at);
  var forDateObj = format(dateObj, "MM/dd/yyyy HH:mm");

  return (
    <div className="note">
      <h2
        onClick={() => {
          props.sN(props.id);
        }}
      >
        {props.title}
      </h2>
      <p
        onClick={() => {
          props.sN(props.id);
        }}
        className="note-style"
      >
        {props.contents}
      </p>
      <p
        onClick={() => {
          props.sN(props.id);
        }}
        className="note-style1"
      >
        {forDateObj}
      </p>
      <button
        onClick={() => {
          props.onDelete(props.id, props.noteId);
        }}
        className="delete"
        type="button"
      >
        <DeleteForeverRoundedIcon></DeleteForeverRoundedIcon>
      </button>
    </div>
  );
}

export default Note;
