import React, { useState, useEffect } from 'react';
import { Row, Col, Tabs, Spin, notification } from 'antd';
import HeaderContent from '../../layouts/HeaderContent';
import { useDispatch } from 'react-redux';
import AccountInfo from './AccountInfo';
import ChangePassword from './ChangePassword';
import '../Config/config.scss';
import './account.scss';

const { TabPane } = Tabs;

const Account = ({ isMobile, intl, headerPage }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const [tabs, setTabs] = useState('1');
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(false);

  const getCurrentUser = () => {
    setLoading(true);
    dispatch({
      type: 'user/current',
      payload: token,
      callback: (res) => {
        setLoading(false);
        if (res && res.success) {
          const { list } = res.results;
          setCurrentUser(list);
        } else {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };
  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };
  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <>
      {headerPage}
      <HeaderContent
        title={intl.formatMessage({ id: 'app.account.list.header' })}
      >
        <Spin spinning={loading}>
          <div
            className="config"
            style={{
              background: '#fff',
              width: `${isMobile ? '100%' : '85%'}`,
              minHeight: `${isMobile ? '100%' : '80vh'}`,
              margin: '0 auto',
              boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0px 5px',
            }}
          >
            <Row
              gutter={[
                { xs: 0, sm: 0, md: 0, lg: 20, xl: 20 },
                { xs: 10, sm: 10, md: 10, lg: 20, xl: 20 },
              ]}
              style={{ marginTop: '10px', padding: '0px 10px' }}
            >
              <Col
                lg={5}
                md={24}
                xs={24}
                style={{
                  overFlow: 'hidden auto',
                  minHeight: `${isMobile ? '100%' : '80vh'}`,
                  background: '#fff',
                  boxShadow: `${
                    isMobile ? '' : 'rgba(0, 0, 0, 0.16) 0px 0px 5px'
                  }`,
                }}
              >
                <Tabs
                  onChange={(key) => setTabs(key)}
                  tabPosition={isMobile ? 'top' : 'left'}
                >
                  <TabPane
                    tab={intl.formatMessage({ id: 'app.account.info.header' })}
                    key="1"
                  ></TabPane>
                  <TabPane
                    tab={intl.formatMessage({
                      id: 'app.account.changePassword.header',
                    })}
                    key="2"
                  ></TabPane>
                </Tabs>
              </Col>
              <Col
                lg={19}
                md={24}
                xs={24}
                style={{
                  paddingRight: isMobile ? '20px' : '50px',
                  paddingLeft: isMobile ? '20px' : '50px',
                  paddingTop: '30px',
                  paddingBottom: '30px',
                }}
              >
                {tabs === '1' ? (
                  <AccountInfo
                    isMobile={isMobile}
                    intl={intl}
                    currentUser={currentUser}
                    getCurrentUser={getCurrentUser}
                  />
                ) : (
                  <ChangePassword
                    isMobile={isMobile}
                    intl={intl}
                    currentUser={currentUser}
                    token={token}
                  />
                )}
              </Col>
            </Row>
          </div>
        </Spin>
      </HeaderContent>
    </>
  );
};

export default Account;
