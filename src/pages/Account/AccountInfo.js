import React, { useState } from 'react';
import { Button, Spin, Form, notification, Row, Col, Input } from 'antd';
import { useDispatch } from 'react-redux';
import regexHelper from '../../utils/regexHelper';
import { FormattedMessage } from 'react-intl';
import user from '../../static/web/images/user.svg';
const FormItem = Form.Item;
const { isEmail, isPhone, isFullName, isFullNameNnumber } = regexHelper;

const AccountInfo = ({ isMobile, intl, currentUser, getCurrentUser }) => {
  const formRef = React.createRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(Math.random());

  const handleSubmit = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        setLoading(true);
        const params = {
          ...values,
          password: currentUser.password,
          usernameOld: currentUser.username,
          userGroupId: currentUser.userGroupId,
        };
        if (currentUser.id) {
          dispatch({
            type: 'user/update',
            payload: {
              id: currentUser.id,
              params: params,
            },
            callback: (res) => {
              setLoading(false);
              if (res && res.success) {
                openNotification(
                  'success',
                  intl.formatMessage({ id: 'app.common.edit.success' }),
                  '#f6ffed'
                );
                getCurrentUser();
              } else {
                openNotification('error', res && res.message, '#fff1f0');
              }
            },
          });
        }
      })
      .catch(({ errorFields }) => {
        formRef.current.scrollToField(errorFields[0].name);
      });
    setKey(key + 1);
  };

  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };
  return (
    <>
      <h2>{intl.formatMessage({ id: 'app.account.info.header' })}</h2>
      <Spin spinning={loading}>
        <Row className="account-info">
          <Col xs={24} md={12} lg={12} className="image-box">
            <img src={user} alt="" />
          </Col>
          <Col xs={24} md={12} lg={12}>
            <Form
              hideRequiredMark
              style={{ marginTop: 8 }}
              initialValues={{
                username: currentUser.username || '',
                fullName: currentUser.fullName || '',
                email: currentUser.email || '',
                mobile: currentUser.mobile || '',
                status: currentUser.id ? currentUser.status : -2,
              }}
              ref={formRef}
              layout="vertical"
              key={`${currentUser.id}_${key}` || '0'}
            >
              <FormItem
                label={
                  <span>
                    <span style={{ color: 'red' }}>*</span>&nbsp;
                    {intl.formatMessage({
                      id: 'app.user.list.col0',
                    })}
                  </span>
                }
                name="username"
                rules={[
                  {
                    pattern: isFullNameNnumber,
                    message: intl.formatMessage({
                      id: 'app.common.crud.validate.fomat',
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
                  disabled
                  placeholder={intl.formatMessage({
                    id: 'app.user.list.username',
                  })}
                />
              </FormItem>

              <FormItem
                label={
                  <span>
                    <span style={{ color: 'red' }}>*</span>&nbsp;
                    {intl.formatMessage({
                      id: 'app.user.list.col1',
                    })}
                  </span>
                }
                name="fullName"
                rules={[
                  {
                    pattern: isFullName,
                    message: intl.formatMessage({
                      id: 'app.common.crud.validate.fomat',
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
                    id: 'app.user.list.fullName',
                  })}
                />
              </FormItem>
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
                    {intl.formatMessage({
                      id: 'app.user.list.col3',
                    })}
                  </span>
                }
                name="mobile"
                rules={[
                  {
                    pattern: isPhone,
                    message: intl.formatMessage({
                      id: 'app.common.crud.validate.phone_email',
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'app.user.list.phone',
                  })}
                />
              </FormItem>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                onClick={handleSubmit}
              >
                <i className="fa fa-save" />
                &nbsp;
                <FormattedMessage id="app.common.crudBtns.2" />
              </Button>
              <FormItem
                // {...formItemLayout}
                hidden
                name="status"
                // valuePropName="checked"
              >
                <Input />
              </FormItem>
            </Form>
          </Col>
        </Row>
      </Spin>
    </>
  );
};

export default AccountInfo;
