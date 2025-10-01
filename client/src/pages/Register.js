import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  let history = useHistory();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [rules, setRules] = useState({
    startAlphabet: false,
    containsDigit: false,
    containsSpecialChars: false,
    isLengthPerfect: false,
  });
  const [load, setLoad] = useState(false);
  const { isLoggedIn } = useContext(UserContext);
  const { Theme, fontStyle } = useContext(ThemeContext);

  useEffect(() => {
    if (isLoggedIn) {
      history.push("/upload");
    }
  }, [isLoggedIn, history]);

  const verifyPassword = () => {
    let startAlphabet = false;
    let containsDigit = false;
    let containsSpecialChars = false;
    let isLengthPerfect = false;
    let { password } = data;
    //verify if the passowrd starts with an alphabet
    if (password.length >= 1 && /[a-zA-z]/.test(password[0]))
      startAlphabet = true;

    //verify if the password contains digit
    if (password.length >= 1 && /\d/.test(password)) containsDigit = true;

    //verify if the password contains special characters
    if (password.length >= 1 && /[#@$]/.test(password) && (!/[!%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)))
      containsSpecialChars = true;

    // verify if the length of the password is greater tha 8 and less than 16
    if (password.trim().length >= 8 && password.trim().length < 16)
      isLengthPerfect = true;

    setRules({
      startAlphabet,
      containsDigit,
      containsSpecialChars,
      isLengthPerfect,
    });

    return;
  };

  useEffect(() => {
    verifyPassword();
  }, [data.password]);

  const collectDetails = (event) => {
    const { name, value } = event.target;
    setData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const verifyData = () => {
    if (data.password.trim() != data.confirmPassword.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match...",
      });
      return false;
    }

    if (data.email.trim() === "" || data.username.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid email or username...",
      });
      return false;
    }

    if (
      !rules.containsDigit ||
      !rules.containsSpecialChars ||
      !rules.isLengthPerfect ||
      !rules.startAlphabet
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password is improper....",
      });
      return false;
    }

    return true;
  };

  const register = async () => {
    try {
      if (!verifyData()) {
        return;
      }

      setLoad(true);
      let response = await axios.post("/api/user/register", {
        email: data.email,
        username: data.username,
        password: data.password,
      });
      console.log("response : ", response);
      if (response.data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Yayy...",
          text: response.data.msg,
        });
        history.push("/user/login");
      }
      setLoad(false);
      setRules({
        startAlphabet: false,
        isLengthPerfect: false,
        containsDigit: false,
        containsSpecialChars: false,
      });
    } catch (err) {
      setLoad(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.error,
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
            REGISTER YOURSELF....
          </h2>

            <input
              type="email"
              className="form-control my-2 p-4 bg-deepblack outline-none border-none text-white focus:bg-deepblack focus:outline-none focus:ring-1 focus:ring-limegreen"
              id="Email"
              aria-describedby="emailHelp"
              name="email"
              onChange={collectDetails}
              value={data.email}
              placeholder="Your Email"
              required
            />
            <input
              type="text"
              className="form-control my-2 p-4 bg-deepblack outline-none border-none text-white focus:bg-deepblack focus:outline-none focus:ring-1 focus:ring-limegreen"
              id="Username"
              aria-describedby="emailHelp"
              name="username"
              onChange={collectDetails}
              value={data.username}
              placeholder="Your Username"
              required
            />
            <input
              type="password"
              className="form-control my-2 p-4 bg-deepblack outline-none border-none text-white focus:bg-deepblack focus:outline-none focus:ring-1 focus:ring-limegreen"
              id="Password"
              name="password"
              onChange={collectDetails}
              value={data.password}
              required
              placeholder="Your Password"
            />
            <input
              type="password"
              className="form-control my-2 p-4 bg-deepblack outline-none border-none text-white focus:bg-deepblack focus:outline-none focus:ring-1 focus:ring-limegreen"
              id="ConfirmPassword"
              name="confirmPassword"
              onChange={collectDetails}
              value={data.confirmPassword}
              required
              placeholder="Repeat Your Password"
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
                text={"Register"}
                callback_func={register}
                disabled={false}
                fontStyle={fontStyle}
                className={"mt-3 border-limegreen text-limegreen hover:bg-limegreen hover:text-black"}
              />
            )}
              <div className="my-3">
            <div
            className="text-gray-200"
              style={{
                fontFamily: `${fontStyle}`,
              }}
            >
              For Password: 
            </div>
            {rules.startAlphabet ? (
              <div
                className="text-gray-200"
                style={{
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faCheck} size="lg" className="mr-2"/>
                </span>
                Begins with an alphatbet.
              </div>
            ) : (
              <div
              className="text-red-500"
                style={{
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faXmark} size="lg" className="mr-2"/>
                </span>
                           Begins with an alphatbet.
              </div>
            )}
            {rules.isLengthPerfect ? (
              <div
                   className="text-gray-200"
                style={{
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faCheck} size="lg"  className="mr-2"/>
                </span>
                Min. 8 characters and Max. 15
                characters.
              </div>
            ) : (
              <div
                          className="text-red-500"
                style={{
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faXmark} size="lg" className="mr-2" />
                </span>
                    Min. 8 characters and Max. 15
                characters.
              </div>
            )}
            {rules.containsDigit ? (
              <div
                   className="text-gray-200"
                style={{
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faCheck} size="lg" className="mr-2" />
                </span>
                A digit between 0-9.
              </div>
            ) : (
              <div
                          className="text-red-500"
                style={{
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faXmark} size="lg" className="mr-2" />
                </span>
                 A digit between 0-9.
              </div>
            )}
            {rules.containsSpecialChars ? (
              <div
                   className="text-gray-200"
                style={{
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faCheck} size="lg" className="mr-2" />
                </span>
                 Atleast 1 special character (@
                # or $).
              </div>
            ) : (
              <div
                          className="text-red-500"
                style={{
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faXmark} size="lg" className="mr-2"/>
                </span>
                   Atleast 1 special character (@
                # or $).
              </div>
            )}
              <p
            className="mt-3 font-bold text-gray-200"
            style={{fontFamily: `${fontStyle}` }}
          >
            Already have an account? <NavLink className="text-blue-400" to={"/user/login"}>Login</NavLink>
          </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
