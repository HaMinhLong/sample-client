import React, { useState, useEffect } from 'react';
import { Layout, Menu, Tooltip, Popconfirm, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import logo from '../assets/logo.svg';
import vietnam from '../assets/vietnam.svg';
import english from '../assets/english.svg';
import { UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

const { Header } = Layout;
const { SubMenu } = Menu;

const HeaderPage = ({ localLanguage, setLocalLanguage }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [permissions, setPermissions] = useState([]);
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  useEffect(() => {
    dispatch({
      type: 'userGroupRole/authRole',
      payload: token,
      callback: (res) => {
        if (res && res.success) {
          const { list } = res.results;
          setPermissions(list);
        } else {
        }
      },
    });
  }, []);
  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userGroupId');
    localStorage.removeItem('id');
    window.location = '/';
  };
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
          {permissions &&
            permissions.length > 0 &&
            permissions.map((permission) => (
              <>
                {permission.children && permission.children.length > 0 ? (
                  <SubMenu
                    key={permission.id}
                    title={permission.menuName || ''}
                  >
                    {permission.children.map((child) => (
                      <Menu.Item key={child.id}>
                        <Link to={`${child.url}/${child.id}`}>
                          {child.menuName || ''}
                        </Link>
                      </Menu.Item>
                    ))}
                  </SubMenu>
                ) : (
                  <Menu.Item key={permission.id}>
                    <Link to={`${permission.url}/${permission.id}`}>
                      {permission.menuName || ''}
                    </Link>
                  </Menu.Item>
                )}
              </>
            ))}
          {/* <SubMenu key="he-thong" title="Hệ thống">
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
          </SubMenu> */}
        </Menu>
      </div>
      <div className="header-box">
        <Tooltip
          placement="bottomRight"
          title={intl.formatMessage({ id: 'app.common.switch.lang' })}
        >
          <img
            src={localLanguage === 'en-US' ? english : vietnam}
            alt=""
            className="language-icon"
            onClick={() => changeLanguage()}
          />
        </Tooltip>
        <Tooltip placement="bottomRight" title={username || ''}>
          <Popconfirm
            title={intl.formatMessage({ id: 'app.login.list.title.logout' })}
            onConfirm={logOut}
            okText={
              <>
                {intl.formatMessage({ id: 'app.login.list.title.yes' })}
                <i style={{ marginLeft: 5 }} className="fas fa-sign-in-alt"></i>
              </>
            }
            cancelText={intl.formatMessage({ id: 'app.login.list.title.no' })}
          >
            <Button
              style={{ marginLeft: 10 }}
              shape="circle"
              icon={<UserOutlined />}
            ></Button>
          </Popconfirm>
        </Tooltip>
      </div>
    </Header>
  );
};

export default HeaderPage;
