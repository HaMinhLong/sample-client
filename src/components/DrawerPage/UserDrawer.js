import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Spin,
  Popconfirm,
  Form,
  Drawer,
  notification,
} from 'antd';
import regexHelper from '../../utils/regexHelper';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import UserGroupSelect from '../Common/UserGroupSelect';

const FormItem = Form.Item;
const { isFullNameNnumber, isFullName, isPhone, isEmail, isPassword } =
  regexHelper;

const UserGroupDrawer = ({
  intl,
  visible,
  dataEdit,
  titleDrawer,
  isMobile,
  getList,
}) => {
  const dispatch = useDispatch();
  const formRef = React.createRef();
  const [checkFirst, setCheckFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [data, setData] = useState({});
  const [key, setKey] = useState(Math.random());
  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      changeDrawer('show');
      getOne(dataEdit && dataEdit.id);
    }
  }, [visible]);

  const getOne = (id) => {
    if (id) {
      setLoading(true);
      dispatch({
        type: 'user/getOne',
        payload: {
          id: id,
        },
        callback: (res) => {
          setLoading(false);
          if (res && res.success) {
            const { list } = res.results;
            setData(list);
          }
        },
      });
    } else {
      setData({});
    }
  };

  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };
  const handleSubmit = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        setLoading(true);
        const addItem = {
          ...values,
          username: values.username && values.username.trim(),
          usernameOld: data.username,
          fullName: values.fullName && values.fullName.trim(),
        };
        if (data.id) {
          dispatch({
            type: 'user/update',
            payload: {
              id: data.id,
              params: {
                ...addItem,
              },
            },
            callback: (res) => {
              setLoading(false);
              if (res && res.success) {
                openNotification(
                  'success',
                  intl.formatMessage({ id: 'app.common.edit.success' }),
                  '#f6ffed'
                );
                getList();
                changeDrawer('close');
              } else {
                openNotification('error', res && res.message, '#fff1f0');
              }
            },
          });
        } else {
          dispatch({
            type: 'user/add',
            payload: addItem,
            callback: (res) => {
              setLoading(false);
              if (res && res.success) {
                openNotification(
                  'success',
                  intl.formatMessage(
                    { id: 'app.common.create.success' },
                    { name: titleDrawer }
                  ),
                  '#f6ffed'
                );
                getList();
                changeDrawer('close');
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
  };

  const handleReset = () => {
    formRef.current.resetFields();
  };
  const changeDrawer = (value) => {
    if (value === 'show') {
      setVisibleDrawer(!visibleDrawer);
      setKey(key + 1);
    } else if (value === 'close') {
      setVisibleDrawer(false);
      setData({});
    }
  };
  return (
    <Drawer
      title={
        <h3 style={{ color: '#196CA6', marginBottom: '0px' }}>
          {data.id
            ? intl.formatMessage(
                { id: 'app.title.update' },
                { name: data.username }
              )
            : intl.formatMessage({ id: 'app.user.create.header' })}
        </h3>
      }
      placement="right"
      width={isMobile ? '100%' : 420}
      onClose={() => changeDrawer('close')}
      visible={visibleDrawer}
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
    >
      <Spin spinning={loading}>
        <Form
          hideRequiredMark
          style={{ marginTop: 8 }}
          initialValues={{
            username: data.username || '',
            password: data.password || '',
            fullName: data.fullName || '',
            email: data.email || '',
            mobile: data.mobile || '',
            userGroupId: data.userGroupId || '',
            status: data.id ? data.status : -2,
          }}
          ref={formRef}
          layout="vertical"
          key={`${data.id}_${key}` || '0'}
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
            />
          </FormItem>
          {!data.id && (
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
              />
            </FormItem>
          )}
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
          <FormItem
            name="userGroupId"
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>&nbsp;
                <FormattedMessage id="app.user.list.col4" />
              </span>
            }
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'app.common.crud.validate.select',
                }),
              },
            ]}
          >
            <UserGroupSelect
              placeholder={intl.formatMessage({
                id: 'app.user.list.userGroup',
              })}
              allowClear
            />
          </FormItem>
          <FormItem
            // {...formItemLayout}
            hidden
            name="status"
            // valuePropName="checked"
          >
            <Input />
          </FormItem>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default UserGroupDrawer;
