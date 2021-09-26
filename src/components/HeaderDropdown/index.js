import React from 'react';
import { Dropdown } from 'antd';
import classNames from 'classnames';
import './index.scss';

const HeaderDropdown = (props) => {
  const overlayClassName = props.overlayClassName;
  return (
    <Dropdown
      overlayClassName={classNames('container', overlayClassName)}
      {...props}
    />
  );
};

export default HeaderDropdown;
