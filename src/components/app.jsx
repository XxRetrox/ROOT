import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import Login from "./login";
import Register from "./register";

function App() {
  var [passAlert, setAlert] = useState("");
  var [emailAlert, setAlert1] = useState("");
  const [islogged, setLogged] = useState(false);
  const [logText, setText] = useState("Login");
  const [userId, setUserId] = useState();
  const [visible, setVisible] = useState();

  // const MainAppLayout = () => {
  //   return (
  //     <>
  //       <div className={visible} id="overlay"></div>
  //       {islogged ? <Header></Header> : null}
  //       <Body
  //         vis={setVisible}
  //         setLog={setLogged}
  //         log={islogged}
  //         uId={userId}
  //         suId={setUserId}
  //       ></Body>
  //       {islogged ? <Footer></Footer> : null}
  //     </>
  //   );
  // };

  // const ProtectedRoute = ({ children }) => {
  //   console.log(islogged);
  //   const navigate = useNavigate();
  //   useEffect(() => {
  //     if (!islogged) {
  //       navigate("/", { replace: true });
  //     }
  //   });
  //   return islogged ? children : null;
  // };

  return (
    <Router>
      <div className="main">
        <Routes>
          <Route
            path="/"
            element={
              <Login
                sUserId={setUserId}
                paA={passAlert}
                sA={setAlert}
                emA={emailAlert}
                sA1={setAlert1}
                text={logText}
                sText={setText}
                setLog={setLogged}
              ></Login>
            }
          />

          <Route path="/register" element={<Register />} />

          <Route
            path="/keeper"
            element={
              <>
                <div className={visible} id="overlay"></div>
                {islogged ? <Header></Header> : null}
                <Body
                  vis={setVisible}
                  setLog={setLogged}
                  log={islogged}
                  uId={userId}
                  suId={setUserId}
                ></Body>
                {islogged ? <Footer></Footer> : null}
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
