const Loader = ({ height = "15px", width = "15px", color }) => {
  return (
    <>
      <div
        className="spin_div rounded-circle"
        style={{
          borderTop: `2px solid ${color}`,
          height: height ,
          width: width ,
        }}
      ></div>
    </>
  );
};

export default Loader;
