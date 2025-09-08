import { useState, createContext } from "react";

export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
  const darkTheme = {
    textColor: "#E6E6F2",
    backgroundColor: "#14141A",
    primaryColor: "#BB86FC",
    surfaceColor: "#2C2C2A",
    theme: "dark",
  };

  const lightTheme = {
    textColor: "#14141A",
    backgroundColor: "#E6E6F2",
    primaryColor: "#483248",
    surfaceColor: "#dbd7d2",
    theme: "light",
  };

  //fetching the theme of the user
  const getDarkThemeStatus = () => {
    let status = window.localStorage.getItem("isDark");
    if (status == null) {
      window.localStorage.setItem("isDark", false);
      return lightTheme;
    }
    status = JSON.parse(status);
    //if any user deliberately adds any random value in the localstorage
    if (typeof status != "boolean") {
      status = false;
      window.localStorage.setItem("isDark", false);
    }
    return status ? darkTheme : lightTheme;
  };

  //fetching the fontstyle for the application of the user
  const getfontStyle = () => {
    let fs = window.localStorage.getItem("fs");
    if (fs == null) {
      window.localStorage.setItem("fs", "'Comfortaa', cursive");
      return "'Comfortaa', cursive";
    }
    // fs = JSON.parse(fs);
    console.log("type : ", typeof fs);
    return String(fs);
  };

  const [Theme, setTheme] = useState(getDarkThemeStatus);
  const [fontStyle, setFontStyle] = useState(getfontStyle);

  //setting the theme
  const setDarkThemeStatus = (val) => {
    window.localStorage.setItem("isDark", val);
    val ? setTheme(darkTheme) : setTheme(lightTheme);
    return;
  };

  //setting the font style for the user
  const setTheFontStyle = (val) => {
    window.localStorage.setItem("fs", val);
    setFontStyle(val);
  };

  return (
    <>
      <ThemeContext.Provider
        value={{
          Theme,
          setDarkThemeStatus,
          fontStyle,
          setTheFontStyle,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </>
  );
};

export default ThemeContextProvider;
