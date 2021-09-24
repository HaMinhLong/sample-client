import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Modal,
  Dropdown,
  Menu,
  notification,
  Tooltip,
  Popconfirm,
} from 'antd';
import HeaderContent from '../../layouts/HeaderContent';
import Table from '../../components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { userGroup, filter } from '../../features/userGroup/userGroupSlice';
import '../../utils/css/styleList.scss';
import moment from 'moment';
import filterIcon from '../../static/web/images/filter.svg';
import dropdownWhite from '../../static/web/images/dropDown_white.svg';
import dropdownBlack from '../../static/web/images/dropDown_black.svg';
import { formatNumber } from '../../utils/utils';
import UserGroupDrawer from '../../components/DrawerPage/UserGroupDrawer';
import { Redirect } from 'react-router-dom';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const PAGE_SIZE = process.env.REACT_APP_PAGE_SIZE;
const UserGroup = ({ isMobile, intl }) => {
  let { id } = useParams();
  const userGroupId = localStorage.getItem('userGroupId');
  const dispatch = useDispatch();
  const list = useSelector(userGroup);
  const [loading, setLoading] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [redirect, setRedirect] = useState('');
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    getList();
    getPermission();
  }, []);

  if (redirect) {
    return <Redirect to={redirect} />;
  }
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
  const getList = () => {
    const { query } = list;
    const queryFilter = list.filter;
    setLoading(true);
    let params = {
      filter: JSON.stringify({}),
      range: JSON.stringify([0, PAGE_SIZE]),
      sort: JSON.stringify(['createdAt', 'DESC']),
      attributes: 'id,userGroupName,userGroupDescriptions,status,createdAt',
    };
    let values = {};
    if (query && query.filter && query.filter !== '{}') {
      params = {
        ...params,
        filter: query.filter,
      };
      values = queryFilter;
    }
    if (query && query.range && query.range !== '{}') {
      params = {
        ...params,
        range: query.range,
      };
      values = queryFilter;
    }
    if (query && query.sort && query.sort !== '{}') {
      params = {
        ...params,
        sort: query.sort,
      };
      values = queryFilter;
    }
    dispatch(filter(values));
    dispatch({
      type: 'userGroup/fetch',
      payload: params,
      callback: (res) => {
        setLoading(false);
        if (res.success === false) {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  const handleStatus = (value, row) => {
    const status = value;
    console.log('handleStatus', value);
    const item = {
      status,
    };
    dispatch({
      type: 'userGroup/updateStatus',
      payload: {
        id: row.id,
        params: item,
      },
      callback: (res) => {
        if (res && res.success === true) {
          openNotification(
            'success',
            intl.formatMessage({ id: 'app.common.edit.success' }),
            '#f6ffed'
          );
          getList();
        } else if (res && res.success === false) {
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

  const handleTableChange = (pagination, filters, sorter) => {
    const queryFilter = list.filter;
    const rangeValue = queryFilter.dateCreated || [];
    const fromDate =
      rangeValue.length > 0
        ? rangeValue[0].set({ hour: 0, minute: 0, second: 0 })
        : '';
    const toDate =
      rangeValue.length > 0
        ? rangeValue[1].set({ hour: 23, minute: 59, second: 59 })
        : '';
    const queryName = {
      userGroupName:
        queryFilter.userGroupName && queryFilter.userGroupName.trim(),
      status: queryFilter && queryFilter.status,
      fromDate: fromDate,
      toDate: toDate,
    };
    if (!(queryFilter.userGroupName && queryFilter.userGroupName.trim())) {
      delete queryName.userGroupName;
    }
    if (!queryFilter.status) {
      delete queryName.status;
    }
    if (rangeValue.length === 0) {
      delete queryName.fromDate;
      delete queryName.toDate;
    }
    const sort = [
      (sorter && sorter.column && sorter.column.name) || 'createdAt',
      sorter && sorter.order === 'descend' ? 'ASC' : 'DESC',
    ];
    const query = {
      filter: JSON.stringify(queryName),
      range: JSON.stringify([
        pagination.current * pagination.pageSize - pagination.pageSize,
        pagination.current * pagination.pageSize,
      ]),
      sort: JSON.stringify(sort),
      attributes: 'id,userGroupName,userGroupDescriptions,status,createdAt',
    };
    dispatch(filter(queryFilter));
    dispatch({
      type: 'userGroup/fetch',
      payload: query,
      callback: (res) => {
        setLoading(false);
      },
    });
  };

  const handleSearch = (values) => {
    setLoading(true);
    const rangeValue = values.dateCreated || [];
    const fromDate =
      rangeValue.length > 0
        ? rangeValue[0].set({ hour: 0, minute: 0, second: 0 })
        : '';
    const toDate =
      rangeValue.length > 0
        ? rangeValue[1].set({ hour: 23, minute: 59, second: 59 })
        : '';
    const queryName = {
      userGroupName: values.userGroupName && values.userGroupName.trim(),
      status: values && values.status,
      fromDate: fromDate,
      toDate: toDate,
    };
    if (!(values.userGroupName && values.userGroupName.trim())) {
      delete queryName.userGroupName;
    }
    if (!values.status) {
      delete queryName.status;
    }
    if (rangeValue.length === 0) {
      delete queryName.fromDate;
      delete queryName.toDate;
    }
    const query = {
      filter: JSON.stringify(queryName),
      range: JSON.stringify([0, PAGE_SIZE]),
      sort: JSON.stringify(['createdAt', 'DESC']),
      attributes: 'id,userGroupName,userGroupDescriptions,status,createdAt',
    };
    dispatch(filter(values));
    dispatch({
      type: 'userGroup/fetch',
      payload: query,
      callback: (res) => {
        setLoading(false);
      },
    });
  };

  const renderForm = () => {
    const queryFilter = list.filter;
    let filter = {};
    if (queryFilter && queryFilter !== '{}') {
      filter = queryFilter;
    }
    const formItemLayout = {
      labelCol: {
        ss: { span: 7 },
        sm: { span: 7 },
        md: { span: 7 },
        lg: { span: 7 },
        xl: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 17 },
        sm: { span: 17 },
        md: { span: 17 },
        lg: { span: 17 },
        xl: { span: 17 },
      },
      style: { marginBottom: 0 },
      labelAlign: 'left',
    };
    return (
      <Form
        onFinish={handleSearch}
        initialValues={{
          userGroupName: filter.userGroupName || '',
          status: filter.status || undefined,
          dateCreated: filter.dateCreated || [],
        }}
      >
        <Row gutter={{ md: 0, lg: 8, xl: 16 }}>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="userGroupName"
              label={<FormattedMessage id="app.userGroup.list.col0" />}
              {...formItemLayout}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'app.userGroup.search.col0',
                })}
                size="small"
              />
            </FormItem>
          </Col>
          <Col xl={8} md={12} xs={24}>
            <FormItem
              name="status"
              label={<FormattedMessage id="app.userGroup.list.col2" />}
              {...formItemLayout}
            >
              <Select
                allowClear
                placeholder={intl.formatMessage({
                  id: 'app.common.status.placeholder',
                })}
                size="small"
              >
                <Select.Option key={1}>
                  {intl.formatMessage({ id: 'app.common.statusTag.1' })}
                </Select.Option>
                <Select.Option key={0}>
                  {intl.formatMessage({ id: 'app.common.statusTag.0' })}
                </Select.Option>
                <Select.Option key={-1}>
                  {intl.formatMessage({ id: 'app.common.statusTag.-1' })}
                </Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col xl={6} md={12} xs={24}>
            <FormItem
              name="dateCreated"
              label={
                <FormattedMessage id="app.common.placeholder.dateCreated" />
              }
              {...formItemLayout}
            >
              <RangePicker
                style={{ width: '100%' }}
                placeholder={[
                  intl.formatMessage({
                    id: 'app.common.placeholder.rangepicker.0',
                  }),
                  intl.formatMessage({
                    id: 'app.common.placeholder.rangepicker.1',
                  }),
                ]}
                format={['DD/MM/YYYY', 'DD/MM/YYYY']}
                ranges={{
                  Today: [moment(), moment()],
                }}
                size="small"
              />
            </FormItem>
          </Col>
          <Col
            xl={2}
            md={24}
            xs={24}
            style={
              isMobile
                ? {
                    display: ' flex',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }
                : {
                    display: ' flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }
            }
          >
            <Button type="primary" htmlType="submit" className="buttonSubmit">
              <i className="fa fa-search" />
              &nbsp;
              <FormattedMessage id="app.search.button" />
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  const deleteRecord = (id) => {
    dispatch({
      type: 'userGroup/delete',
      payload: {
        id: id,
      },
      callback: (res) => {
        if (res && res.success === true) {
          openNotification(
            'success',
            intl.formatMessage({ id: 'app.common.delete.success' }),
            '#f6ffed'
          );
          getList();
        } else if (res && res.success === false) {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  const renderStatusButton = (cell, row) => {
    const menuStatus = [
      {
        status: 1,
        name: intl.formatMessage({ id: 'app.common.statusTag.1' }),
      },
      {
        status: 0,
        name: intl.formatMessage({ id: 'app.common.statusTag.0' }),
      },
      {
        status: -1,
        name: intl.formatMessage({ id: 'app.common.statusTag.-1' }),
      },
    ];

    const statusList = menuStatus.filter((x) => x.status !== cell);

    const menu = (
      <Menu className="menu_icon">
        {statusList &&
          statusList.length > 0 &&
          statusList.map((item) => {
            if (item.status === 1)
              return (
                <Menu.Item
                  key={item.status}
                  onClick={() => handleStatus(item.status, row)}
                >
                  <div>{item.name}</div>
                </Menu.Item>
              );

            if (item.status === 0)
              return (
                permissions.isBlock && (
                  <Menu.Item
                    key={item.status}
                    onClick={() => handleStatus(item.status, row)}
                  >
                    <div>{item.name}</div>
                  </Menu.Item>
                )
              );

            if (item.status === -1)
              return (
                permissions.isDelete && (
                  <Menu.Item
                    key={item.status}
                    onClick={() => handleStatus(item.status, row)}
                  >
                    <div>{item.name}</div>
                  </Menu.Item>
                )
              );

            return (
              <Menu.Item
                key={item.status}
                onClick={() => handleStatus(item.status, row)}
              >
                <div>{item.name}</div>
              </Menu.Item>
            );
          })}
      </Menu>
    );

    let btn = (
      <Button className="btn_status1">
        {intl.formatMessage({ id: 'app.common.statusTag.1' })}
        <img src={dropdownWhite} alt="icon drop down" />
      </Button>
    );
    if (cell === 0) {
      btn = (
        <Button className="btn_status0">
          {intl.formatMessage({ id: 'app.common.statusTag.0' })}
          <img src={dropdownBlack} alt="icon drop down" />
        </Button>
      );
    } else if (cell === -1) {
      btn = (
        <Button className="btn_statusAn">
          {intl.formatMessage({ id: 'app.common.statusTag.-1' })}
          <img src={dropdownBlack} alt="icon drop down" />
        </Button>
      );
    }

    return (
      <Dropdown
        overlay={menu}
        trigger={['click']}
        placement="bottomCenter"
        arrow
        className="dropDownCustom"
      >
        {btn}
      </Dropdown>
    );
  };
  const data = (list.data && list.data.list) || [];
  const pagination = (list.data && list.data.pagination) || [];
  const columns = [
    {
      dataIndex: null,
      title: intl.formatMessage({ id: 'app.table.column.no' }),
      align: 'center',
      width: isMobile ? 50 : '5%',
      render: (text, record, index) =>
        formatNumber(
          index + (pagination.current - 1) * pagination.pageSize + 1
        ),
      fixed: isMobile,
    },
    {
      dataIndex: 'userGroupName',
      name: 'userGroupName',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.userGroup.list.col0" />,
      align: 'left',
      sorter: () => {},
      fixed: isMobile,
    },
    {
      dataIndex: 'userGroupDescriptions',
      name: 'userGroupDescriptions',
      width: isMobile ? 250 : '25%',
      title: <FormattedMessage id="app.userGroup.list.col1" />,
      align: 'center',
      sorter: () => {},
    },
    {
      dataIndex: 'createdAt',
      title: intl.formatMessage({ id: 'app.common.placeholder.dateCreated' }),
      align: 'center',
      width: !isMobile && '9%',
      sorter: () => {},
      render: (cell) => (
        <React.Fragment>
          {moment(cell && cell).format('HH:mm DD/MM/YYYY')}
        </React.Fragment>
      ),
    },
    {
      dataIndex: 'status',
      name: 'status',
      title: <FormattedMessage id="app.userGroup.list.col2" />,
      align: 'center',
      width: !isMobile ? '9%' : 170,
      sorter: () => {},
      render: (cell, row) => (
        <React.Fragment>{renderStatusButton(cell, row)}</React.Fragment>
      ),
    },
    {
      dataIndex: null,
      title: intl.formatMessage({ id: 'app.common.action' }),
      align: 'center',
      width: !isMobile ? '15%' : 170,
      render: (cell, row) => (
        <React.Fragment>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {permissions.isUpdate && (
              <Tooltip
                title={
                  !isMobile && intl.formatMessage({ id: 'app.tooltip.edit' })
                }
              >
                <Button
                  onClick={() => {
                    setVisibleDrawer(!visibleDrawer);
                    setDataEdit(row);
                  }}
                  icon={
                    <i className="fas fa-pen" style={{ marginRight: '5px' }} />
                  }
                  className="btn_edit"
                  type="ghost"
                  shape="circle"
                >
                  <FormattedMessage id="app.tooltip.edit" />
                </Button>
              </Tooltip>
            )}
            {permissions.isDelete && (
              <Tooltip
                title={
                  !isMobile && intl.formatMessage({ id: 'app.tooltip.remove' })
                }
              >
                <Popconfirm
                  placement="bottom"
                  title={<FormattedMessage id="app.confirm.remove" />}
                  onConfirm={() => deleteRecord(row.id)}
                >
                  <Button
                    icon={
                      <i
                        className="fas fa-trash"
                        style={{ marginRight: '5px' }}
                      />
                    }
                    className="btn_edit"
                    type="ghost"
                    shape="circle"
                    style={{ marginLeft: '5px' }}
                  >
                    <FormattedMessage id="app.tooltip.remove" />
                  </Button>
                </Popconfirm>
              </Tooltip>
            )}
            {permissions.isApprove && (
              <Tooltip
                title={
                  !isMobile &&
                  intl.formatMessage({ id: 'app.user.permissions' })
                }
              >
                <Button
                  onClick={() => setRedirect(`/grant-permissions/${row.id}`)}
                  icon={
                    <i
                      className="fas fa-clipboard-list"
                      style={{ marginRight: '5px' }}
                    />
                  }
                  className="btn_edit"
                  type="ghost"
                  shape="circle"
                  style={{ marginLeft: '5px' }}
                >
                  {intl.formatMessage({ id: 'app.user.permissions' })}
                </Button>
              </Tooltip>
            )}
          </div>
        </React.Fragment>
      ),
    },
  ];
  return (
    <>
      <HeaderContent
        title={<FormattedMessage id="app.userGroup.list.header" />}
        action={
          <React.Fragment>
            {permissions.isAdd && (
              <Tooltip
                title={
                  !isMobile &&
                  intl.formatMessage({ id: 'app.userGroup.create.header' })
                }
              >
                <Button
                  icon={
                    <i className="fas fa-plus" style={{ marginRight: '5px' }} />
                  }
                  onClick={() => {
                    setVisibleDrawer(!visibleDrawer);
                    setDataEdit({});
                  }}
                >
                  {intl.formatMessage(
                    { id: 'app.title.create' },
                    { name: '(F2)' }
                  )}
                </Button>
              </Tooltip>
            )}
          </React.Fragment>
        }
      >
        <div className="tableListForm">{renderForm()}</div>
        <div
          className="buttonModalFilter"
          onClick={() => setVisibleFilter(true)}
        >
          {intl.formatMessage({ id: 'app.common.searchBtn' })}&nbsp;
          <img width="25" height="25" src={filterIcon} alt="tìm kiếm" />
        </div>
        <Modal
          title={intl.formatMessage({ id: 'app.common.searchBtn' })}
          width="100%"
          style={{ top: 0 }}
          maskStyle={{
            background: '#fff',
          }}
          visible={visibleFilter}
          className="modalFilter"
          onCancel={() => setVisibleFilter(false)}
          footer={[]}
        >
          {renderForm()}
        </Modal>
        <Table
          loading={loading}
          rowKey="id"
          dataSource={data}
          pagination={pagination}
          scroll={{ x: isMobile ? 1200 : '100vh', y: '60vh' }}
          columns={columns}
          onChange={handleTableChange}
        />
      </HeaderContent>
      <UserGroupDrawer
        intl={intl}
        isMobile={isMobile}
        visible={visibleDrawer}
        titleDrawer={intl.formatMessage({ id: 'app.userGroup.list.title' })}
        dataEdit={dataEdit}
        getList={getList}
      />
    </>
  );
};

export default UserGroup;
