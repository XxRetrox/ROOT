import React, { useState, useRef } from "react";
import EditIcon from "@mui/icons-material/Edit";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";

function FullNote(props) {
  const [isEditable, setEditable] = useState(false);
  const [isUpdated, setUpdated] = useState("");
  const pRef = useRef(null);
  const hRef = useRef(null);

  function closeNote() {
    props.chNote(false);
    setEditable(false);
  }

  function edit() {
    setEditable(true);
  }

  async function postEdit() {
    const title = hRef.current.textContent;
    const content = pRef.current.textContent;

    props.sC((prevValue) => {
      return prevValue.map((note, index) => {
        if (index === props.vId) {
          // Assuming you have an ID to match
          return { ...note, title: title, content: content };
        }
        return note;
      });
    });

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/update-note/${props.vNID}`,
        {
          title: title,
          content: content,
        },
        { withCredentials: true }
      );
      setUpdated(response.data.message);
      setTimeout(() => {
        setUpdated("");
      }, 3000);
    } catch (error) {
      console.log("Frontend error Update failed", error);
    }

    setEditable(false);
  }

  return (
    <div className="view">
      <div className="view-p">
        <h2
          ref={hRef}
          contentEditable={isEditable ? "true" : "false"}
          className="view-h2"
        >
          {props.head1}
        </h2>
        <p
          ref={pRef}
          contentEditable={isEditable ? "true" : "false"}
          className="vie"
        >
          {props.body1}
        </p>
      </div>
      <div className="bnts">
        <button onClick={closeNote} className="view-close" type="button">
          close
        </button>
        <div className="center">
          <p className="up_msg">{isUpdated}</p>
        </div>
        {isEditable ? (
          <button onClick={postEdit} className="edit" type="button">
            <PostAddIcon></PostAddIcon>
          </button>
        ) : (
          <button onClick={edit} className="edit" type="button">
            <EditIcon></EditIcon>
          </button>
        )}
      </div>
    </div>
  );
}

export default FullNote;
