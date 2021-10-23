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
  Result,
} from 'antd';
import { Link } from 'react-router-dom';
import HeaderContent from '../../layouts/HeaderContent';
import Table from '../../components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { user, filter } from '../../features/user/userSlice';
import '../../utils/css/styleList.scss';
import moment from 'moment';
import filterIcon from '../../static/web/images/filter.svg';
import dropdownWhite from '../../static/web/images/dropDown_white.svg';
import dropdownBlack from '../../static/web/images/dropDown_black.svg';
import { formatNumber } from '../../utils/utils';
import UserDrawer from '../../components/DrawerPage/UserDrawer';
import UserGroupSelect from '../../components/Common/UserGroupSelect';
import { useParams } from 'react-router-dom';
import UploadMultipleUser from '../../components/ModalPage/UploadMultipleUser';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const PAGE_SIZE = process.env.REACT_APP_PAGE_SIZE;
const User = ({ isMobile, intl, headerPage }) => {
  let { id } = useParams();
  const userGroupId = localStorage.getItem('userGroupId');
  const dispatch = useDispatch();
  const list = useSelector(user);
  const [loading, setLoading] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [permissions, setPermissions] = useState({});
  const [fileList, setFileList] = useState([]);
  const [visibleUpload, setVisibleUpload] = useState(false);

  useEffect(() => {
    getList();
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
  const getList = () => {
    const { query } = list;
    const queryFilter = list.filter;
    setLoading(true);
    let params = {
      filter: JSON.stringify({}),
      range: JSON.stringify([0, PAGE_SIZE]),
      sort: JSON.stringify(['createdAt', 'DESC']),
      attributes:
        'id,username,fullName,email,mobile,userGroupId,status,createdAt',
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
      type: 'user/fetch',
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
    const item = {
      status,
    };
    dispatch({
      type: 'user/updateStatus',
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

  const onChangeFile = (newFileList) => {
    console.log('fileList', newFileList.fileList);
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
      username: queryFilter.username && queryFilter.username.trim(),
      fullName: queryFilter.fullName && queryFilter.fullName.trim(),
      email: queryFilter.email && queryFilter.email.trim(),
      userGroupId: queryFilter && queryFilter.userGroupId,
      status: queryFilter && queryFilter.status,
      fromDate: fromDate,
      toDate: toDate,
    };
    if (!(queryFilter.username && queryFilter.username.trim())) {
      delete queryName.username;
    }
    if (!(queryFilter.fullName && queryFilter.fullName.trim())) {
      delete queryName.fullName;
    }
    if (!(queryFilter.email && queryFilter.email.trim())) {
      delete queryName.email;
    }
    if (!queryFilter.userGroupId) {
      delete queryName.userGroupId;
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
      attributes:
        'id,username,fullName,email,mobile,userGroupId,status,createdAt',
    };
    dispatch(filter(queryFilter));
    dispatch({
      type: 'user/fetch',
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
      username: values.username && values.username.trim(),
      fullName: values.fullName && values.fullName.trim(),
      email: values.email && values.email.trim(),
      userGroupId: values && values.userGroupId,
      status: values && values.status,
      fromDate: fromDate,
      toDate: toDate,
    };
    if (!(values.username && values.username.trim())) {
      delete queryName.username;
    }
    if (!(values.fullName && values.fullName.trim())) {
      delete queryName.fullName;
    }
    if (!(values.email && values.email.trim())) {
      delete queryName.email;
    }
    if (!values.userGroupId) {
      delete queryName.userGroupId;
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
      attributes:
        'id,username,fullName,email,mobile,userGroupId,status,createdAt',
    };
    dispatch(filter(values));
    dispatch({
      type: 'user/fetch',
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
          username: filter.username || '',
          fullName: filter.fullName || '',
          email: filter.email || '',
          userGroupId: filter.userGroupId || '',
          status: filter.status || undefined,
          dateCreated: filter.dateCreated || [],
        }}
      >
        <Row gutter={{ md: 0, lg: 8, xl: 16 }}>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="username"
              label={<FormattedMessage id="app.user.list.col0" />}
              {...formItemLayout}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'app.user.search.col0',
                })}
                size="small"
              />
            </FormItem>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="fullName"
              label={<FormattedMessage id="app.user.list.col1" />}
              {...formItemLayout}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'app.user.search.col2',
                })}
                size="small"
              />
            </FormItem>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="email"
              label={<FormattedMessage id="app.user.list.col2" />}
              {...formItemLayout}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'app.user.search.col3',
                })}
                size="small"
              />
            </FormItem>
          </Col>

          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="userGroupId"
              label={<FormattedMessage id="app.user.list.col4" />}
              {...formItemLayout}
            >
              <UserGroupSelect
                placeholder={intl.formatMessage({
                  id: 'app.user.search.col1',
                })}
                allowClear
                size="small"
              />
            </FormItem>
          </Col>

          <Col xl={8} md={12} xs={24}>
            <FormItem
              name="status"
              label={<FormattedMessage id="app.search.status" />}
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
                <Select.Option key={-2}>
                  {intl.formatMessage({ id: 'app.common.statusTag.-2' })}
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
      type: 'user/delete',
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
      {
        status: -2,
        name: intl.formatMessage({ id: 'app.common.statusTag.-2' }),
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
            if (item.status === -2)
              return (
                permissions.isApprove && (
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
    } else if (cell === -2) {
      btn = (
        <Button className="btn_statusAn notActivated">
          {intl.formatMessage({ id: 'app.common.statusTag.-2' })}
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
      dataIndex: 'username',
      name: 'username',
      width: isMobile ? 100 : '10%',
      title: <FormattedMessage id="app.user.list.col0" />,
      align: 'left',
      sorter: () => {},
      fixed: isMobile,
    },
    {
      dataIndex: 'fullName',
      name: 'fullName',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.user.list.col1" />,
      align: 'center',
      sorter: () => {},
    },
    {
      dataIndex: 'email',
      name: 'email',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.user.list.col2" />,
      align: 'center',
      sorter: () => {},
    },
    {
      dataIndex: 'mobile',
      name: 'mobile',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.user.list.col3" />,
      align: 'center',
      sorter: () => {},
    },
    {
      dataIndex: 'userGroup',
      name: 'userGroup',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.user.list.col4" />,
      align: 'center',
      sorter: () => {},
      render: (cell) => <span>{cell.userGroupName}</span>,
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
      title: <FormattedMessage id="app.user.list.col5" />,
      align: 'center',
      width: !isMobile ? '12%' : 170,
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
          </div>
        </React.Fragment>
      ),
    },
  ];

  return (
    <>
      {permissions ? (
        <>
          {headerPage}
          <HeaderContent
            title={<FormattedMessage id="app.user.list.header" />}
            action={
              <React.Fragment>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Tooltip
                    title={
                      !isMobile &&
                      intl.formatMessage({ id: 'app.user.upload.download' })
                    }
                  >
                    <Button
                      icon={<i className="fas fa-download" />}
                      type="primary"
                      // onClick={this.showModalUpload}
                    >
                      <a
                        style={{ color: '#fff' }}
                        href="https://cdn.fbsbx.com/v/t59.2708-21/246014793_1362519427517699_1060309620781615200_n.xlsx/userImport.xlsx?_nc_cat=102&amp;ccb=1-5&amp;_nc_sid=0cab14&amp;_nc_ohc=Q1Q8VmwfrysAX8nCGZt&amp;_nc_ht=cdn.fbsbx.com&amp;oh=42bbe1c356af3e278b5c1216ae268bd7&amp;oe=6175F093&amp;dl=1"
                        target="blank"
                      >
                        &nbsp;{' '}
                        {intl.formatMessage({ id: 'app.user.upload.download' })}
                      </a>
                    </Button>
                  </Tooltip>
                  <Tooltip
                    title={
                      !isMobile &&
                      intl.formatMessage({ id: 'app.user.upload.import' })
                    }
                  >
                    <Button
                      style={{ marginLeft: 10 }}
                      icon={
                        <i
                          style={{ marginRight: 10 }}
                          className="fas fa-file-import"
                        ></i>
                      }
                      type="primary"
                      onClick={() => setVisibleUpload(!visibleUpload)}
                    >
                      {intl.formatMessage({ id: 'app.user.upload.import' })}
                    </Button>
                  </Tooltip>
                  {permissions.isAdd && (
                    <Tooltip
                      title={
                        !isMobile &&
                        intl.formatMessage({ id: 'app.user.create.header' })
                      }
                    >
                      <Button
                        style={{ marginLeft: 10 }}
                        icon={
                          <i
                            className="fas fa-plus"
                            style={{ marginRight: '5px' }}
                          />
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
                </div>
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
        </>
      ) : (
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button type="primary">
              <Link to="/">Back Home</Link>
            </Button>
          }
        />
      )}
      <UserDrawer
        intl={intl}
        isMobile={isMobile}
        visible={visibleDrawer}
        titleDrawer={intl.formatMessage({ id: 'app.user.list.title' })}
        dataEdit={dataEdit}
        getList={getList}
      />
      <UploadMultipleUser
        intl={intl}
        isMobile={isMobile}
        visible={visibleUpload}
        getList={getList}
      />
    </>
  );
};

export default User;
