import React from "react";

const HeaderContent = ({ title, children }) => {
  return (
    <>
      <div className="header-content">
        <h1>{title}</h1>
      </div>
      <div className="site-layout-content">{children}</div>
    </>
  );
};

export default HeaderContent;
