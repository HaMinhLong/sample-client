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
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import MenuTreeSelect from '../Common/MenuTreeSelect';
import { menu } from '../../features/menu/menuSlice';

const FormItem = Form.Item;
const { isFullNameNnumberUrl, isNumber } = regexHelper;

const MenuDrawer = ({
  intl,
  visible,
  dataEdit,
  titleDrawer,
  isMobile,
  getList,
  dataTree,
}) => {
  const dispatch = useDispatch();
  const list = useSelector(menu);

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
  }, [dataEdit]);

  const getOne = (id) => {
    if (id) {
      setLoading(true);
      dispatch({
        type: 'menu/getOne',
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
          menuName: values.menuName && values.menuName.trim(),
          menuNameOld: values.menuName && values.menuName.trim(),
          parentId: values.parentId || null,
        };
        console.log('addItem', addItem);
        if (data.id) {
          dispatch({
            type: 'menu/update',
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
            type: 'menu/add',
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
  const filterData = (data, id) => {
    let count = 0;
    data.forEach((item) => {
      if (item.children) count += filterData(item.children, id);
      if (item.parentId === id) count += 1;
    });
    return count;
  };
  return (
    <Drawer
      title={
        <h3 style={{ color: '#196CA6', marginBottom: '0px' }}>
          {data.id
            ? intl.formatMessage(
                { id: 'app.title.update' },
                { name: data.menuName }
              )
            : intl.formatMessage({ id: 'app.menu.create.header' })}
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
            menuName: data.menuName || '',
            parentId: data.parentId || '',
            orderBy: (data.orderBy && Number(data.orderBy)) || '',
            icon: data.icon || '',
            url: data.url || '',
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
                  id: 'app.menu.list.col0',
                })}
              </span>
            }
            name="menuName"
            rules={[
              {
                pattern: isFullNameNnumberUrl,
                message: intl.formatMessage({
                  id: 'app.common.crud.validate.nameUrl',
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
                id: 'app.menu.list.name',
              })}
            />
          </FormItem>
          <FormItem
            label={
              <span>
                {intl.formatMessage({
                  id: 'app.menu.list.col1',
                })}
              </span>
            }
            name="parentId"
          >
            <MenuTreeSelect
              dataTree={dataTree}
              mode="default"
              placeholder="Chọn cấp trên"
              allowClear
              onChange={(value) => {
                formRef.current.setFieldsValue({
                  orderBy: filterData(list.data.list, value || '0') + 1,
                });
              }}
            />
          </FormItem>
          <FormItem
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>&nbsp;
                {intl.formatMessage({
                  id: 'app.menu.list.col2',
                })}
              </span>
            }
            name="orderBy"
            rules={[
              {
                pattern: isNumber,
                message: intl.formatMessage({
                  id: 'app.common.crud.validate.number',
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
                id: 'app.menu.list.orderBy',
              })}
            />
          </FormItem>
          <FormItem
            label={
              <span>
                {intl.formatMessage({
                  id: 'app.menu.list.col3',
                })}
              </span>
            }
            name="icon"
          >
            <Input
              placeholder={intl.formatMessage({
                id: 'app.menu.list.icon',
              })}
            />
          </FormItem>
          <FormItem
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>&nbsp;
                {intl.formatMessage({
                  id: 'app.menu.list.col4',
                })}
              </span>
            }
            name="url"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'app.common.crud.validate.input',
                }),
              },
              {
                pattern: /^[a-zA-Z0-9/\-+*?@#$%^&_.=:]*?$/,
                message: intl.formatMessage({
                  id: 'app.common.crud.validate.url',
                }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({
                id: 'app.menu.list.url',
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

export default MenuDrawer;
