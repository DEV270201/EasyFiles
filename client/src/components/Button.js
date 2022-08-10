import React from "react";

const Button = ({text,callback_func,disbaled,fontStyle,theme,className=""})=>{

    const callFunc = ()=>{
        callback_func();
    }

    return(
      <>
          <button className={`btn mybtn ${theme === 'light' ? 'btn-outline-dark' : 'btn-outline-light'} ${className} `} onClick={callFunc} style={{fontFamily:`${fontStyle}` }} disabled={disbaled}>{text}</button>
      </>
    );
}

export default Button;