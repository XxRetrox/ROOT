import React, { useState, useEffect, useCallback } from "react";
import Note from "./note";
import InputField from "./input";
import axios from "axios";
import FullNote from "./fullNote";
import { useSpring, animated } from "@react-spring/web";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import SideBar from "./sidebar";

function Body(props) {
  var [inputText, setInputText] = useState({
    user_id: props.uId,
    title: "",
    content: "",
  });
  var [errorText, setError] = useState("");
  var [noteContents, setContents] = useState([]);
  const [isView, setView] = useState(false);
  var [viewNote, setViewNote] = useState({
    title: "",
    content: "",
    view_id: "",
    view_note_id: "",
  });
  const navigate = useNavigate();

  const springProps = useSpring({
    from: { opacity: 0, transform: "scale(0)" }, // Start fully zoomed out and invisible
    to: {
      opacity: isView ? 1 : 0,
      transform: isView ? "scale(1)" : "scale(0)",
    }, // Target state based on `isVisible`
    config: { mass: 1, tension: 350, friction: 19 }, // Customize spring physics
  });

  function handle(event) {
    const { name, value } = event.target;
    setInputText((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  const loadNotes = useCallback(async () => {
    if (!props.uId) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/keeper/${props.uId}`,
        { withCredentials: true }
      );
      const noteData = response.data.notes;
      console.log(noteData);
      setContents(() => {
        return [...noteData];
      });
    } catch (error) {
      console.error("Unable to get user notes:", error);
    }
  }, [props.uId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/check-auth`,
          { withCredentials: true }
        );
        if (response.data.is_logged) {
          props.setLog(true);
          props.suId(response.data.userId); // Set uId from the check-auth response
          console.log("Frontend: User is already logged in.");
        } else {
          props.setLog(false);
          props.suId(null);
          console.log("Frontend: User is not logged in.");
          navigate("/");
        }
      } catch (error) {
        console.error("Frontend: Error checking auth status:", error);
        props.setLog(false); // Assume not logged in on error
        props.suId(null);
        navigate("/"); // Force to login page on initial auth check failure
      }
    };

    checkAuthStatus();
  }, []);

  async function post() {
    console.log(props.uId, inputText.content);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/postnote`,
        {
          user_id: props.uId,
          title: inputText.title,
          content: inputText.content,
        }
      );
      const resData = response.data;
      setContents((prevValue) => {
        return [
          {
            title: resData.title,
            content: resData.content,
            created_at: resData.created_at,
            note_id: resData.note_id,
          },
          ...prevValue,
        ];
      });
      setInputText((prevValue) => {
        return {
          ...prevValue,
          title: "",
          content: "",
        };
      });
    } catch (error) {
      if (error.response.status === 404) {
        setError(`${error.response.data.message}`);
        setTimeout(() => {
          setError("");
        }, 3000);
      }
      console.error("The post was unsuccessful:", error);
    }
  }

  async function deleteNote(id, noteId) {
    setContents((prevValue) => {
      return prevValue.filter((note, index) => {
        return index !== id;
      });
    });

    try {
      console.log(noteId);
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/keeper/${noteId}`
      );
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  function showNote(id) {
    setView(true);
    setViewNote(() => {
      return {
        title: noteContents[id].title,
        content: noteContents[id].content,
        view_id: id,
        view_note_id: noteContents[id].note_id,
      };
    });
    console.log(id);
  }

  return (
    <>
      {props.log ? (
        <>
          <SideBar v={props.vis}></SideBar>
          <div className="body">
            <animated.div
              style={{
                ...springProps,
                zIndex: 9999,
                position: "fixed",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FullNote
                head1={viewNote.title}
                body1={viewNote.content}
                vId={viewNote.view_id}
                chNote={setView}
                sC={setContents}
                nC={noteContents}
                isV={isView}
                vNID={viewNote.view_note_id}
              ></FullNote>
            </animated.div>

            <div className={isView ? "vis" : ""}>
              <InputField
                tValue={inputText.title}
                teValue={inputText.content}
                onPost={post}
                onInput={handle}
              ></InputField>
              <span>{errorText}</span>
              <div className="arr-notes">
                {noteContents.map((not, index) => {
                  return (
                    <Note
                      sN={showNote}
                      key={not.note_id}
                      id={index}
                      noteId={not.note_id}
                      title={not.title}
                      contents={not.content}
                      created_at={not.created_at}
                      onDelete={deleteNote}
                    ></Note>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default Body;
