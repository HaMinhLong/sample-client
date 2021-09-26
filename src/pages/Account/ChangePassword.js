import React, { useState } from 'react';
import { Button, Spin, Form, notification, Row, Col, Input } from 'antd';
import { useDispatch } from 'react-redux';
import regexHelper from '../../utils/regexHelper';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const { isPassword } = regexHelper;

const ChangePassword = ({ intl, token }) => {
  const formRef = React.createRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        setLoading(true);
        dispatch({
          type: 'user/changePasswordLogin',
          payload: {
            token: token,
            params: values,
          },
          callback: (res) => {
            if (res && res.success) {
              openNotification(
                'success',
                intl.formatMessage({
                  id: 'app.change.list.title.changeSuccessfully',
                }),
                '#f6ffed'
              );
            } else {
              openNotification('error', res && res.message, '#fff1f0');
            }
            setLoading(false);
          },
        });
      })
      .catch(({ errorFields }) => {
        formRef.current.scrollToField(errorFields[0].name);
      });
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
      <h2>{intl.formatMessage({ id: 'app.account.changePassword.header' })}</h2>
      <Row>
        <Col xs={24} md={24} lg={12}>
          <Spin spinning={loading}>
            <Form
              hideRequiredMark
              style={{ marginTop: 8 }}
              initialValues={{
                newPassword: '',
              }}
              ref={formRef}
              layout="vertical"
            >
              <FormItem
                hasFeedback
                label={
                  <span>
                    <span style={{ color: 'red' }}>*</span>&nbsp;
                    {intl.formatMessage({
                      id: 'app.change.list.title.col0',
                    })}
                  </span>
                }
                name="newPassword"
                rules={[
                  {
                    pattern: isPassword,
                    message: intl.formatMessage({
                      id: 'app.common.crud.validate.password',
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
                <Input.Password
                  placeholder={intl.formatMessage({
                    id: 'app.login.list.title.newPassword',
                  })}
                />
              </FormItem>
              <FormItem
                name="confirm"
                label={
                  <span>
                    <span style={{ color: 'red' }}>*</span>&nbsp;
                    {intl.formatMessage({
                      id: 'app.change.list.title.col1',
                    })}
                  </span>
                }
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'app.change.list.title.noti0',
                    }),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          intl.formatMessage({
                            id: 'app.change.list.title.noti1',
                          })
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder={intl.formatMessage({
                    id: 'app.login.list.title.confirmNewPassword',
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
            </Form>
          </Spin>
        </Col>
      </Row>
    </>
  );
};

export default ChangePassword;
