import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Form,
  Input,
  Button,
  Checkbox,
  notification,
  Spin,
  Typography,
} from 'antd';
import './login.scss';
import ForgetPassword from '../../components/ModalPage/ForgetPassword';
import ChangePassword from '../../components/ModalPage/ChangePassword';
const { Title, Text, Link } = Typography;

const Login = ({ isMobile, intl }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [visibleForget, setVisibleForget] = useState(false);
  const [visibleChangePassword, setVisibleChangePassword] = useState(false);
  const onFinish = (values) => {
    setLoading(true);
    dispatch({
      type: 'auth/signIn',
      payload: values,
      callback: (res) => {
        if (res && res.success) {
          const { list } = res.results;
          openNotification(
            'success',
            intl.formatMessage({ id: 'app.common.login.success' }),
            '#f6ffed'
          );
          localStorage.setItem('token', list.accessToken);
          localStorage.setItem('id', list.id);
          localStorage.setItem('userGroupId', list.userGroupId);
          localStorage.setItem('username', list.username);
          window.location = '/';
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
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
    },
    colon: false,
    labelAlign: 'left',
    style: { marginBottom: 20 },
  };
  return (
    <>
      <section className="login__page">
        <Spin spinning={loading}>
          <div className="form__container">
            <Title level={2}>
              {intl.formatMessage({ id: 'app.login.list.title.header' })}
            </Title>
            <Text style={{ marginBottom: 50 }}>
              {intl.formatMessage({ id: 'app.login.list.title.col0' })}
            </Text>
            <Form
              hideRequiredMark
              name="basic"
              initialValues={{ username: '', password: '', remember: true }}
              onFinish={onFinish}
              layout="vertical"
              className="form__login"
            >
              <Form.Item
                {...formItemLayout}
                label={
                  <span>
                    <span style={{ color: 'red' }}>*</span>&nbsp;
                    {intl.formatMessage({ id: 'app.login.list.title.col1' })}
                  </span>
                }
                name="username"
                rules={[
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
                    id: 'app.login.list.title.username',
                  })}
                />
              </Form.Item>

              <Form.Item
                {...formItemLayout}
                label={
                  <span>
                    <span style={{ color: 'red' }}>*</span>&nbsp;
                    {intl.formatMessage({ id: 'app.login.list.title.col2' })}
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
                    id: 'app.login.list.title.password',
                  })}
                />
              </Form.Item>

              <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{ span: 24 }}
              >
                <Checkbox>
                  {' '}
                  {intl.formatMessage({ id: 'app.login.list.title.col3' })}
                </Checkbox>
              </Form.Item>

              <Form.Item
                wrapperCol={{ span: 24 }}
                style={{ position: 'relative' }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  {intl.formatMessage({ id: 'app.login.list.title.col4' })}
                  <i
                    style={{ marginLeft: 10 }}
                    className="fas fa-sign-in-alt"
                  ></i>
                </Button>
              </Form.Item>
            </Form>
            <Link
              style={{ marginBottom: 10 }}
              onClick={() => setVisibleChangePassword(!visibleChangePassword)}
            >
              {intl.formatMessage({ id: 'app.change.list.title.title' })}?
            </Link>
            <Link
              style={{ marginBottom: 50 }}
              onClick={() => setVisibleForget(!visibleForget)}
            >
              {intl.formatMessage({ id: 'app.forgot.list.title.title0' })}?
            </Link>
          </div>
        </Spin>
      </section>
      <ForgetPassword isMobile={isMobile} intl={intl} visible={visibleForget} />
      <ChangePassword
        isMobile={isMobile}
        intl={intl}
        visible={visibleChangePassword}
      />
    </>
  );
};

export default Login;
