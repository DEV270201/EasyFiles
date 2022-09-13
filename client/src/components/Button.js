import React from "react";

const Button = ({text,callback_func=null,disabled,fontStyle,theme="",className=""})=>{

    const callFunc = ()=>{
        callback_func();
    }

    return(
      <>
          <button className={`btn mybtn mr-1 my-1 ${theme && (theme === 'light' ? 'btn-outline-dark' : 'btn-outline-light')} ${className} `} onClick={callFunc} style={{fontFamily:`${fontStyle}` }} disabled={disabled}>{text}</button>
      </>
    );
}

export default Button;