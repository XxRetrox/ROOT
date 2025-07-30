import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

function Form(props) {
  const navigate = useNavigate();
  var [userEmail, setEmail] = useState("");
  var [succText, setSucc] = useState("");
  var [userPassword, setPassword] = useState("");
  const [isVisible, setVisibility] = useState(false);

  function loginVal(event) {
    const { type, value } = event.target;
    if (type === "password" || type === "text") {
      if (value.length < 8) {
        props.s("must be 8 charaters or more");
      } else {
        props.s("");
      }
      setPassword(value);
    }

    if (type === "email") {
      setEmail(value);
    }
  }

  async function log() {
    var login = document.getElementById("login");
    var bounce = document.getElementById("bounce");
    var inp1 = document.getElementById("inp1").value;
    var inp2 = document.getElementById("inp2").value;

    if (
      inp1.endsWith("@gmail.com") ||
      inp1.endsWith("@outlook.com") ||
      inp1.endsWith("@yahoo.com") ||
      inp1.endsWith("@icloud.com") ||
      inp1.endsWith("@proton.me") ||
      inp1.endsWith("@aol.com") ||
      inp1.endsWith("@zoho.com") ||
      inp1.endsWith("@gmx.com") ||
      inp1.endsWith("@gmx.us") ||
      inp1.endsWith("@yandex.com")
    ) {
      props.s1("");
    } else {
      props.s1("enter a valid email");

      return false;
    }

    if (inp2.length < 8) {
      props.s("must be 8 charaters or more");
      return false;
    } else {
      props.s("");
    }

    try {
      props.sT("Logging in...");
      login.classList.add("vis1");
      bounce.classList.add("bounce");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/login`,
        {
          email_1: userEmail,
          password: userPassword,
        },
        { withCredentials: true }
      );
      const resData = response.data;
      const user_id = resData.user;
      setTimeout(() => {
        setSucc(`${resData.message}`);
        props.sU(user_id);
      }, 1500);
      setTimeout(() => {
        props.sT("Login");
        login.classList.remove("vis1");
        bounce.classList.remove("bounce");
        props.sLog(true);
        navigate("/keeper");
      }, 3000);
    } catch (error) {
      if (error.response.status === 404) {
        setTimeout(() => {
          props.sT("Login");
          login.classList.remove("vis1");
          bounce.classList.remove("bounce");
          props.s1(`${error.response.data.message}`);
        }, 3000);
      } else if (error.response.status === 401) {
        setTimeout(() => {
          props.sT("Login");
          login.classList.remove("vis1");
          bounce.classList.remove("bounce");
          props.s(`${error.response.data.message}`);
        }, 3000);
      }
      console.error("login failed: ", error);
    }
  }

  function show() {
    setVisibility(!isVisible);
  }

  return (
    <div className="login2">
      <div>
        <i>
          <b>{succText}</b>
        </i>
      </div>
      <form action="" method="get">
        <div>
          <div className="label">
            <span className="icons">
              <AttachEmailIcon></AttachEmailIcon>
            </span>
            <label>
              <p>Email</p>
              <div className="alr">{props.eA}</div>
              <input
                onChange={loginVal}
                className="i"
                type="email"
                name=""
                placeholder="Enter your email"
                id="inp1"
              />
            </label>
          </div>
          <div className="label">
            <span onClick={show} className="icons">
              {isVisible ? (
                <LockOpenIcon></LockOpenIcon>
              ) : (
                <LockIcon></LockIcon>
              )}
            </span>
            <label>
              <p>Password</p>
              <div className="alr">{props.pA}</div>
              <input
                onChange={loginVal}
                className="i"
                type={isVisible ? "text" : "password"}
                name=""
                placeholder="Enter your password"
                id="inp2"
              />
            </label>
          </div>
        </div>
        <button id="bnt1" onClick={log} className="login-bnt" type="button">
          <span id="bounce">{props.t}</span>
        </button>
      </form>
      <p className="link">
        Don't have an account with us ? Register{" "}
        <Link to="/register">Here</Link>
      </p>
    </div>
  );
}

export default Form;
