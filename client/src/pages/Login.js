import { useRef, useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { useHistory, NavLink } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import Button from "../components/Button";

//Here I am going to use uncontrolled components because I don't feel the of need controlled components.
//You can change based on your needs and requirements.

const Login = () => {
  console.log("login page...");
  const uref = useRef(null);
  const pref = useRef(null);
  const history = useHistory();
  const [load, setLoad] = useState(false);
  const { isLoggedIn, setLoginStatus } = useContext(UserContext);
  const { Theme, fontStyle } = useContext(ThemeContext);

  useEffect(() => {
    if (isLoggedIn) {
      history.push("/upload");
    }
  }, [isLoggedIn, history]);

  const login = async () => {
    try {
      setLoad(true);
      let response = await axios.post("/api/user/login", {
        username: uref.current.value,
        password: pref.current.value,
      });
      console.log("login : ", response);
      if (response.data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Yayy...",
          text: response.data.msg,
        });
        history.push("/upload");
        setLoginStatus(true);
      }
    } catch (err) {
      console.log("Login err : ", err);
      setLoad(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.error ? err.response.data.error : "Sorry, something went wrong!",
      });
      return;
    }
  };

  return (
    <>
     <div className="w-full bg-deepblack flex justify-center items-start py-6">
        <div className="bg-darkaccent w-[90%] sm:w-[50%] xl:w-[25%] px-3 py-3 flex flex-col rounded my-5">
            <h2
            className="text-center text-gray-200 mt-1 mb-2 text-xl font-bold"
            style={{ fontFamily: `${fontStyle}` }}
          >
            LOGIN YOURSELF....
          </h2>

          <input
              type="text"
              className="form-control my-2 p-4 bg-deepblack outline-none border-none text-white focus:bg-deepblack focus:outline-none focus:ring-1 focus:ring-limegreen"
              id="Username"
              aria-describedby="emailHelp"
              name="username"
              ref={uref}
              required
              placeholder="Your Email / Username"
            />

            <input
              type="password"
              className="form-control my-2 p-4 bg-deepblack outline-none border-none text-white focus:bg-deepblack focus:outline-none focus:ring-1 focus:ring-limegreen"
              id="Password"
              name="password"
              ref={pref}
              required
              placeholder="Your Password"
            />

            {load ? (
              <Button
                text={"Loading..."}
                disabled={true}
                fontStyle={fontStyle}
                 className={"mt-3 border-limegreen text-limegreen hover:bg-limegreen hover:text-black"}
              />
            ) : (
              <Button
                text={"Login"}
                callback_func={login}
                disabled={false}
                fontStyle={fontStyle}
                className={"mt-3 border-limegreen text-limegreen hover:bg-limegreen hover:text-black"}
              />
            )}
                  <p
            className="mt-3 font-bold text-gray-200"
            style={{fontFamily: `${fontStyle}` }}
          >
            Don't have an account? <NavLink className="text-blue-400" to={"/"}>Register</NavLink>
          </p>
        </div>
      </div>
    </>
  );
};
export default Login;
