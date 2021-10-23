import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import logo from '../assets/logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import RightContentHeader from '../components/RightContentHeader/RightContentHeader';
import { userGroupRole } from '../features/userGroupRole/userGroupRoleSlice';

const { Header } = Layout;
const { SubMenu } = Menu;

const HeaderPage = ({ localLanguage, setLocalLanguage }) => {
  const menusAll = useSelector(userGroupRole);
  const intl = useIntl();
  const dispatch = useDispatch();
  const [menus, setMenus] = useState(menusAll.dataAll.list || []);
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (menus.length === 0 || menusAll.dataAll.list !== menus) {
      dispatch({
        type: 'userGroupRole/authRole',
        payload: token,
        callback: (res) => {
          if (res && res.success) {
            const { list } = res.results;
            setMenus(list);
          } else {
          }
        },
      });
    }
  }, []);

  const changeLanguage = () => {
    const localLanguageToggle = localLanguage === 'en-US' ? 'vi-VI' : 'en-US';
    localStorage.setItem('lang', localLanguageToggle);
    setLocalLanguage(localLanguageToggle);
  };
  return (
    <Header id="components-layout-demo-top">
      <div>
        <Link to="/">
          <img width="40" height="40" className="logo" src={logo} alt="" />
        </Link>
        {/* defaultSelectedKeys={['1']} */}
        <Menu mode="horizontal">
          <Menu.Item
            key="1"
            icon={
              <i style={{ color: '#fff' }} className="fas fa-chart-line"></i>
            }
          >
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          {menus &&
            menus.length > 0 &&
            menus.map((menu) => (
              <React.Fragment key={menu.id}>
                {menu.children && menu.children.length > 0 ? (
                  <SubMenu
                    key={menu.id}
                    title={menu.menuName || ''}
                    icon={
                      <i style={{ color: '#fff' }} className={menu.icon}></i>
                    }
                  >
                    {menu.children.map((child) => (
                      <Menu.Item key={child.id}>
                        <Link to={`${child.url}/${child.id}`}>
                          {child.menuName || ''}
                        </Link>
                      </Menu.Item>
                    ))}
                  </SubMenu>
                ) : (
                  <Menu.Item
                    key={menu.id}
                    icon={
                      <i style={{ color: '#fff' }} className={menu.icon}></i>
                    }
                  >
                    <Link to={`${menu.url}/${menu.id}`}>
                      {menu.menuName || ''}
                    </Link>
                  </Menu.Item>
                )}
              </React.Fragment>
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
        <RightContentHeader
          localLanguage={localLanguage}
          changeLanguage={changeLanguage}
          intl={intl}
        />
      </div>
    </Header>
  );
};

export default HeaderPage;
