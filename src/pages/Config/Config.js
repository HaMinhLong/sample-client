import React, { useState, useEffect } from 'react';
import HeaderContent from '../../layouts/HeaderContent';
import { Button, Row, Col, Form, notification, Spin, Menu, Input } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import setting from '../../static/web/images/setting-512.png';
import './config.scss';
import { useParams } from 'react-router-dom';
import regexHelper from '../../utils/regexHelper';
const { isEmail } = regexHelper;
const FormItem = Form.Item;

const PAGE_SIZE = 1;

const Config = ({ isMobile, intl }) => {
  let { id } = useParams();
  const userGroupId = localStorage.getItem('userGroupId');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const title = intl.formatMessage({ id: 'app.config.list.title.title' });
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    getConfig();
    getPermission();
  }, []);
  const getPermission = () => {
    const params = {
      filter: JSON.stringify({ userGroupId: userGroupId }),
    };
    dispatch({
      type: 'userGroupRole/getOne',
      payload: {
        id: id,
        params: params,
      },
      callback: (res) => {
        if (res && res.success) {
          const { list } = res.results;
          setPermissions(list);
        } else {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };
  const getConfig = () => {
    let params = {
      filter: JSON.stringify({}),
      range: JSON.stringify([0, PAGE_SIZE]),
      sort: JSON.stringify(['createdAt', 'DESC']),
      attributes: 'id,email,password',
    };
    setLoading(true);
    dispatch({
      type: 'config/fetch',
      payload: params,
      callback: (res) => {
        if (res.success === true) {
          const { list } = res.results;
          setList(list[0] ? list[0] : {});
        } else {
          openNotification('error', res && res.message, '#fff1f0');
        }
        setLoading(false);
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
  const handleUpdate = (values) => {
    setLoading(true);
    const addItem = {
      ...values,
      email: values.email && values.email.trim(),
      emailOld: list.email,
    };
    if (list.id) {
      dispatch({
        type: 'config/update',
        payload: {
          id: list.id,
          params: addItem,
        },
        callback: (res) => {
          if (res && res.success === true) {
            openNotification(
              'success',
              intl.formatMessage({ id: 'app.common.edit.success' }),
              '#f6ffed'
            );
            getConfig();
          } else {
            openNotification('error', res && res.message, '#fff1f0');
          }
          setLoading(false);
        },
      });
    } else {
      dispatch({
        type: 'config/add',
        payload: addItem,
        callback: (res) => {
          if (res && res.success === true) {
            openNotification(
              'success',
              intl.formatMessage(
                { id: 'app.common.create.success' },
                { name: title }
              ),
              '#f6ffed'
            );
            getConfig();
          } else {
            openNotification('error', res && res.message, '#fff1f0');
          }
          setLoading(false);
        },
      });
    }
  };

  return (
    <HeaderContent
      title={<FormattedMessage id="app.config.list.title.header" />}
    >
      <div
        className="config"
        style={{
          background: '#fff',
          width: `${isMobile ? '100%' : '85%'}`,
          height: `${isMobile ? '100%' : '80vh'}`,
          margin: '0 auto',
          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0px 5px',
        }}
      >
        <Spin spinning={loading}>
          <Row
            gutter={[
              { xs: 0, sm: 0, md: 0, lg: 20, xl: 20 },
              { xs: 10, sm: 10, md: 10, lg: 20, xl: 20 },
            ]}
            style={{ marginTop: '10px', padding: '0px 10px' }}
          >
            <Col
              lg={8}
              md={24}
              xs={24}
              style={{
                overFlow: 'hidden auto',
                height: `${isMobile ? '100%' : '80vh'}`,
                background: '#fff',
                borderRight: `${isMobile ? '' : '1px solid gray'}`,
                boxShadow: `${
                  isMobile ? '' : 'rgba(0, 0, 0, 0.16) 0px 0px 5px'
                }`,
              }}
            >
              <Row>
                <Col xs={12} sm={12} md={8} lg={12}>
                  <img
                    src={setting}
                    alt="setting"
                    style={{
                      padding: '10px',
                      width: '100%',
                    }}
                  />
                </Col>
                <Col xs={12} sm={12} md={16} lg={12}>
                  <h1
                    style={{
                      color: '#196CA6',
                      fontSize: '40px',
                      margin: '30px 20px',
                      fontWeight: '600',
                    }}
                  >
                    Cài đặt
                  </h1>
                </Col>
              </Row>
              <Menu
                mode="inline"
                selectedKeys="1"
                style={{ background: '#fff' }}
              >
                <Menu.Item key="1">
                  {intl.formatMessage({ id: 'app.config.list.title.header' })}
                </Menu.Item>
              </Menu>
            </Col>
            <Col
              xl={16}
              lg={16}
              md={24}
              xs={24}
              style={{
                paddingRight: '20px',
                paddingLeft: '20px',
                paddingTop: '30px',
                paddingBottom: '30px',
              }}
            >
              <h2
                style={{
                  color: '#196CA6',
                  borderBottom: '1px solid #F1F1F1',
                }}
              >
                {intl.formatMessage({ id: 'app.config.list.title.header' })}
              </h2>
              <Form
                hideRequiredMark
                onFinish={handleUpdate}
                initialValues={{
                  email: list.email || [],
                  password: list.password || [],
                }}
                key={`${list.id || ''}_${Math.random()}`}
                layout="vertical"
                style={{
                  height: '100%',
                  padding: '20px 40px 50px 0px',
                  position: 'relative',
                }}
              >
                <FormItem
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp;
                      {intl.formatMessage({
                        id: 'app.user.list.col2',
                      })}
                    </span>
                  }
                  name="email"
                  rules={[
                    {
                      pattern: isEmail,
                      message: intl.formatMessage({
                        id: 'app.common.crud.validate.phone_email',
                      }),
                    },
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'app.common.crud.validate.input',
                      }),
                    },
                  ]}
                >
                  <Input
                    placeholder={intl.formatMessage({
                      id: 'app.user.list.email',
                    })}
                  />
                </FormItem>
                <FormItem
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp;
                      {intl.formatMessage({
                        id: 'app.user.list.col6',
                      })}
                    </span>
                  }
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'app.common.crud.validate.input',
                      }),
                    },
                  ]}
                >
                  <Input.Password
                    placeholder={intl.formatMessage({
                      id: 'app.user.list.password',
                    })}
                  />
                </FormItem>
                {permissions.isUpdate && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: 20,
                    }}
                  >
                    <Button
                      type="primary"
                      icon={
                        <i
                          className="fa fa-save"
                          style={{ marginRight: '5px' }}
                        />
                      }
                      htmlType="submit"
                    >
                      {intl.formatMessage({ id: 'app.common.crudBtns.2' })}
                    </Button>
                  </div>
                )}
              </Form>
            </Col>
          </Row>
        </Spin>
      </div>
    </HeaderContent>
  );
};
export default Config;
