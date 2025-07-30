import React, { useState } from "react";
import { BrowserRouter, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LockIcon from "@mui/icons-material/Lock";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import LockOpenIcon from "@mui/icons-material/LockOpen";

function RegForm(props) {
  var [passAlert, setAlert] = useState("");
  var [emailAlert, setAlert1] = useState("");
  var [userEmail, setEmail] = useState("");
  var [succText, setSucc] = useState("");
  var [userPassword, setPassword] = useState("");
  const [regText, setText] = useState("Register");
  const [isVisible, setVisibility] = useState(false);
  const navigate = useNavigate();

  function loginVal(event) {
    const { type, value } = event.target;
    if (type === "password" || type === "text") {
      if (value.length < 8) {
        setAlert("must be 8 charaters or more");
      } else {
        setAlert("");
      }
      setPassword(value);
    }
    if (type === "email") {
      setEmail(value);
    }
  }

  async function reg() {
    var register = document.getElementById("register");
    var bounce1 = document.getElementById("bounce1");
    var inp3 = document.getElementById("inp3").value.trim();
    var inp4 = document.getElementById("inp4").value.trim();

    if (
      inp3.endsWith("@gmail.com") ||
      inp3.endsWith("@outlook.com") ||
      inp3.endsWith("@yahoo.com") ||
      inp3.endsWith("@icloud.com") ||
      inp3.endsWith("@proton.me") ||
      inp3.endsWith("@aol.com") ||
      inp3.endsWith("@zoho.com") ||
      inp3.endsWith("@gmx.com") ||
      inp3.endsWith("@gmx.us") ||
      inp3.endsWith("@yandex.com")
    ) {
      setAlert1("");
    } else {
      setAlert1("enter a valid email");
      return false;
    }

    if (inp4.length < 8) {
      setAlert("must be 8 charaters or more");
      return false;
    } else {
      setAlert("");
    }

    try {
      setText("Processing...");
      register.classList.add("vis1");
      bounce1.classList.add("bounce1");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/register`,
        {
          email_1: userEmail,
          password: userPassword,
        }
      );
      setTimeout(() => {
        setSucc(response.data.message);
      }, 1500);
      setTimeout(() => {
        setText("Register");
        register.classList.remove("vis1");
        bounce1.classList.remove("bounce1");
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Registration failed:", error);
      if (error.response.status === 409) {
        setTimeout(() => {
          setText("Register");
          register.classList.remove("vis1");
          bounce1.classList.remove("bounce1");
          setAlert1(`${error.response.data.errMessage}`);
        }, 3000);
        return false;
      }
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
              <div className="alr">{emailAlert}</div>
              <input
                onChange={loginVal}
                className="i"
                type="email"
                name=""
                placeholder="Enter an email"
                id="inp3"
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
              <div className="alr">{passAlert}</div>
              <input
                onChange={loginVal}
                className="i"
                type={isVisible ? "text" : "password"}
                name=""
                placeholder="Enter a password"
                id="inp4"
              />
            </label>
          </div>
        </div>
        <button onClick={reg} className="login-bnt" type="button">
          <span id="bounce1">{regText}</span>
        </button>
      </form>
      <p className="link">
        Already have an account with us ? Login <Link to="/">Here</Link>
      </p>
    </div>
  );
}

export default RegForm;
