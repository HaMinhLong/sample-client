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
const { isEmail } = regexHelper;
const ForgetPassword = ({ intl, visible }) => {
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
      const payload = {
        ...values,
        subject: 'Tìm lại mật khẩu của bạn!',
      };
      dispatch({
        type: 'user/forgotPassword',
        payload: payload,
        callback: (res) => {
          setLoading(false);
          if (res && res.success) {
            openNotification(
              'success',
              intl.formatMessage({ id: 'app.forgot.list.title.sendEmail' }),
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
        title={intl.formatMessage({ id: 'app.forgot.list.title.title' })}
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
              <i className="fas fa-envelope" />
              &nbsp;
              <FormattedMessage id="app.common.forgotBtn" />
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
              emailTo: '',
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
                    id: 'app.user.list.col2',
                  })}
                </span>
              }
              name="emailTo"
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
                prefix={<i className="fas fa-envelope"></i>}
              />
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default ForgetPassword;
