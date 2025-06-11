import React from "react";

// text/icon: you can either put text or icon
// disbaled: to disable the button
// className: to add custom style
// theme: to make the button follow the theme if you want
// fontStyle: the fontstyle following the app font style
// callback_func: function called when the button is clicked

const Button = ({text="",callback_func=null,disabled,fontStyle,theme="",className="",icon="", dataTarget=""})=>{

    const callFunc = ()=>{
        callback_func();
    }

    return(
      <>
          <button className={`btn mybtn mr-1 my-1 ${theme && (theme === 'light' ? 'btn-outline-dark' : 'btn-outline-light')} ${className} `} onClick={callFunc} style={{fontFamily:`${fontStyle}` }} disabled={disabled} data-target={dataTarget}>{(text && text) || (icon)}</button>
      </>
    );
}

export default Button;