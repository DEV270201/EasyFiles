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
      history.push("/");
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
      <div className="container p-3">
        <div className="outer" style={{ marginBottom: "35px" }}>
          <h4
            className="text-center font-weight-light mt-1 mb-2"
            style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}
          >
            Register Yourself...
          </h4>
          <div className="inputs">
            <div
              className="label"
              htmlFor="Email"
              style={{
                color: `${Theme.textColor}`,
                fontFamily: `${fontStyle}`,
              }}
            >
              Email address*
            </div>
            <input
              type="email"
              className="form-control myform"
              id="Email"
              aria-describedby="emailHelp"
              name="email"
              onChange={collectDetails}
              value={data.email}
              required
            />
            <div
              className="label"
              htmlFor="Username"
              style={{
                color: `${Theme.textColor}`,
                fontFamily: `${fontStyle}`,
              }}
            >
              Username*
            </div>
            <input
              type="text"
              className="form-control myform"
              id="Username"
              aria-describedby="emailHelp"
              name="username"
              onChange={collectDetails}
              value={data.username}
              required
            />
            <div
              className="label"
              htmlFor="Password"
              style={{
                color: `${Theme.textColor}`,
                fontFamily: `${fontStyle}`,
              }}
            >
              Password*
            </div>
            <input
              type="password"
              className="form-control myform"
              id="Password"
              name="password"
              onChange={collectDetails}
              value={data.password}
              required
            />
            <div
              className="label"
              htmlFor="ConfirmPassword"
              style={{
                color: `${Theme.textColor}`,
                fontFamily: `${fontStyle}`,
              }}
            >
              Confirm Password*
            </div>
            <input
              type="password"
              className="form-control myform"
              id="ConfirmPassword"
              name="confirmPassword"
              onChange={collectDetails}
              value={data.confirmPassword}
              required
            />
            {load ? (
              <Button
                text={"Loading..."}
                disabled={true}
                fontStyle={fontStyle}
                theme={Theme.theme}
                className={"mt-3"}
              />
            ) : (
              <Button
                text={"Register"}
                callback_func={register}
                disabled={false}
                fontStyle={fontStyle}
                theme={Theme.theme}
                className={"mt-3"}
              />
            )}
          </div>
          <div className="mt-3">
            <div
              style={{
                color: `${Theme.textColor}`,
                fontFamily: `${fontStyle}`,
              }}
            >
              NOTE :{" "}
            </div>
            {rules.startAlphabet ? (
              <div
                style={{
                  color: `${Theme.secondary}`,
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faCheck} size="lg" className="mr-2"/>
                </span>
                Password should begin with an alphatbet.
              </div>
            ) : (
              <div
                style={{
                  color: `${Theme.danger}`,
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faXmark} size="lg" className="mr-2"/>
                </span>
                Password should begin with an alphatbet.
              </div>
            )}
            {rules.isLengthPerfect ? (
              <div
                style={{
                  color: `${Theme.secondary}`,
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faCheck} size="lg"  className="mr-2"/>
                </span>
                Password should be minimum 8 characters and maximum 15
                characters long.
              </div>
            ) : (
              <div
                style={{
                  color: `${Theme.danger}`,
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faXmark} size="lg" className="mr-2" />
                </span>
                Password should be minimum 8 characters and maximum 15
                characters long.
              </div>
            )}
            {rules.containsDigit ? (
              <div
                style={{
                  color: `${Theme.secondary}`,
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faCheck} size="lg" className="mr-2" />
                </span>
                Password should contain a digit between 0-9.
              </div>
            ) : (
              <div
                style={{
                  color: `${Theme.danger}`,
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faXmark} size="lg" className="mr-2" />
                </span>
                Password should contain a digit between 0-9.
              </div>
            )}
            {rules.containsSpecialChars ? (
              <div
                style={{
                  color: `${Theme.secondary}`,
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faCheck} size="lg" className="mr-2" />
                </span>
                Password should contain atleast one special character like '@'
                '#' or '$' only.
              </div>
            ) : (
              <div
                style={{
                  color: `${Theme.danger}`,
                  fontFamily: `${fontStyle}`,
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faXmark} size="lg" className="mr-2"/>
                </span>
                Password should contain atleast one special character like '@'
                '#' or '$' only.
              </div>
            )}
          </div>
          <p
            className="my-1 font-weight-bold"
            style={{ color: `${Theme.textColor}`, fontFamily: `${fontStyle}` }}
          >
            Already have an account? <NavLink to={"/user/login"}>Login</NavLink>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
