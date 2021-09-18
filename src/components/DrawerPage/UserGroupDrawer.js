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

const FormItem = Form.Item;
const { isfullNameNnumber } = regexHelper;

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
        type: 'userGroup/getOne',
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
          userGroupName: values.userGroupName && values.userGroupName.trim(),
          userGroupNameOld: data.userGroupName,
        };
        if (data.id) {
          dispatch({
            type: 'userGroup/update',
            payload: {
              id: data.id,
              params: {
                ...addItem,
              },
            },
            callback: (res) => {
              setLoading(false);
              if (res && res.success === true) {
                openNotification(
                  'success',
                  intl.formatMessage({ id: 'app.common.edit.success' }),
                  '#f6ffed'
                );
                getList();
                changeDrawer('close');
              } else if (res && res.success === false) {
                openNotification('error', res && res.message, '#fff1f0');
              }
            },
          });
        } else {
          dispatch({
            type: 'userGroup/add',
            payload: addItem,
            callback: (res) => {
              setLoading(false);
              if (res && res.success === true) {
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
              } else if (res && res.success === false) {
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
                { name: data.userGroupName }
              )
            : intl.formatMessage(
                { id: 'app.title.create' },
                { name: titleDrawer }
              )}
        </h3>
      }
      placement="right"
      width={isMobile ? '100%' : 420}
      onClose={() => changeDrawer('close')}
      visible={visibleDrawer}
      style={{ zIndex: 10000000 }}
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
            userGroupName: data.userGroupName || '',
            userGroupDescriptions: data.userGroupDescriptions || '',
            status: data.id ? data.status : 1,
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
                  id: 'app.userGroup.list.col0',
                })}
              </span>
            }
            name="userGroupName"
            rules={[
              {
                pattern: isfullNameNnumber,
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
                id: 'app.userGroup.list.name',
              })}
            />
          </FormItem>
          <FormItem
            label={
              <span>
                {intl.formatMessage({
                  id: 'app.userGroup.list.col1',
                })}
              </span>
            }
            name="userGroupDescriptions"
            rules={[
              {
                max: 300,
                message: intl.formatMessage(
                  {
                    id: 'app.common.validate.max',
                  },
                  {
                    max: '300',
                  }
                ),
              },
            ]}
          >
            <Input.TextArea
              // maxLength={200}
              // autoSize={{ minRows: 3 }}
              rows={3}
              placeholder={intl.formatMessage({
                id: 'app.userGroup.list.description',
              })}
            />
          </FormItem>
          <FormItem
            // {...formItemLayout}
            hidden
            name="status"
            valuePropName="checked"
          >
            <Input />
          </FormItem>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default UserGroupDrawer;
