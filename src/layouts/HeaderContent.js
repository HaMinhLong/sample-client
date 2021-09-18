import React from 'react';

const HeaderContent = ({ title, action, children }) => {
  return (
    <>
      <div className="header-content">
        <h1>{title}</h1>
        {action}
      </div>
      <div className="site-layout-content">{children}</div>
    </>
  );
};

export default HeaderContent;
