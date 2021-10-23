import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Spin,
  Form,
  Popconfirm,
  notification,
  Input,
} from 'antd';
import { useDispatch } from 'react-redux';
import regexHelper from '../../utils/regexHelper';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const { isFullNameNnumber, isPassword } = regexHelper;
const ChangePassword = ({ intl, visible }) => {
  const formRef = React.createRef();
  const dispatch = useDispatch();
  const [checkFirst, setCheckFirst] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);
  const [key, setKey] = useState(Math.random());
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      changeModal('show');
    }
  }, [visible]);

  const handleReset = () => {
    formRef.current.resetFields();
  };
  const changeModal = (value) => {
    if (value === 'show') {
      setVisibleModal(!visibleModal);
      setKey(key + 1);
    } else if (value === 'close') {
      setVisibleModal(false);
    }
  };
  const handleSubmit = () => {
    formRef.current.validateFields().then((values) => {
      setLoading(true);
      dispatch({
        type: 'user/changePasswordNotLogin',
        payload: values,
        callback: (res) => {
          setLoading(false);
          if (res && res.success === true) {
            openNotification(
              'success',
              intl.formatMessage({
                id: 'app.change.list.title.changeSuccessfully',
              }),
              '#f6ffed'
            );
            changeModal('close');
          } else {
            openNotification('error', res && res.message, '#fff1f0');
          }
        },
      });
    });
  };
  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };
  const handleCancel = () => {
    changeModal('close');
  };
  return (
    <>
      <Modal
        title={intl.formatMessage({ id: 'app.change.list.title.title' })}
        visible={visibleModal}
        onCancel={handleCancel}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Popconfirm
              placement="bottom"
              title={<FormattedMessage id="app.confirm.reset" />}
              onConfirm={handleReset}
            >
              <Button type="primary" style={{ marginLeft: 8 }}>
                <i className="fa fa-ban" />
                &nbsp;
                <FormattedMessage id="app.common.crudBtns.1" />
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: 8 }}
              loading={loading}
              onClick={handleSubmit}
            >
              <i className="fa fa-save" />
              &nbsp;
              <FormattedMessage id="app.common.crudBtns.2" />
            </Button>
          </div>
        }
        cancelText={intl.formatMessage({
          id: 'app.common.deleteBtn.cancelText',
        })}
      >
        <Spin spinning={loading}>
          <Form
            hideRequiredMark
            style={{ marginTop: 8 }}
            initialValues={{
              username: '',
              oldPassword: '',
              newPassword: '',
            }}
            ref={formRef}
            layout="vertical"
            key={`${key}` || '0'}
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
                placeholder={intl.formatMessage({
                  id: 'app.user.list.username',
                })}
                prefix={<i className="fas fa-user"></i>}
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
              name="oldPassword"
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
                  id: 'app.user.list.password',
                })}
                prefix={<i className="fas fa-lock"></i>}
              />
            </FormItem>
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
                prefix={<i className="fas fa-lock"></i>}
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
                prefix={<i className="fas fa-lock"></i>}
              />
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default ChangePassword;
