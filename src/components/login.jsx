import react from "react";
import Form from "./loginForm";

function Login(props) {
  return (
    <div id="login" className="login">
      <div className="login1">
        <h1>
          Login into your <span>Keeper</span> account
        </h1>
        <Form
          sU={props.sUserId}
          pA={props.paA}
          s={props.sA}
          eA={props.emA}
          sN={props.sNC}
          s1={props.sA1}
          sLog={props.setLog}
          t={props.text}
          sT={props.sText}
        ></Form>
      </div>
    </div>
  );
}

export default Login;
