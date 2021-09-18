import React from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import vietnam from '../assets/vietnam.svg';
import english from '../assets/english.svg';

const { Header } = Layout;
const { SubMenu } = Menu;

const HeaderPage = ({ localLanguage, setLocalLanguage }) => {
  const changeLanguage = () => {
    const localLanguageToggle = localLanguage === 'en-US' ? 'vi-VI' : 'en-US';
    localStorage.setItem('lang', localLanguageToggle);
    setLocalLanguage(localLanguageToggle);
  };
  return (
    <Header id="components-layout-demo-top">
      <div>
        <Link to="/">
          <img className="logo" src={logo} alt="" />
        </Link>
        <Menu mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <SubMenu key="he-thong" title="Hệ thống">
            <Menu.Item key="2">
              <Link to="/config/2">Cấu hình hệ thống</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/menu/3">Thanh công cụ</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="tai-khoan" title="Tài khoản - Phân quyền">
            <Menu.Item key="4">
              <Link to="/user-group/4">Nhóm tài khoản</Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/user/5">Tài khoản</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
      <div className="header-box">
        <Tooltip placement="bottomRight" title={'Chuyển đổi ngôn ngữ'}>
          <img
            src={localLanguage === 'en-US' ? english : vietnam}
            alt=""
            className="language-icon"
            onClick={() => changeLanguage()}
          />
        </Tooltip>
      </div>
    </Header>
  );
};

export default HeaderPage;
