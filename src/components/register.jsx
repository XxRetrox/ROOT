import react from "react";
import RegForm from "./registerForm";

function Register() {
  return (
    <div id="register" className="login">
      <div className="login1">
        <h1>
          Organise your notes/thoughts with us in a not so organised way through{" "}
          <span>Notæble</span>
        </h1>
        <RegForm></RegForm>
      </div>
    </div>
  );
}

export default Register;
