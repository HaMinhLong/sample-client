import React, { useState, useEffect } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Tooltip,
  Col,
  Row,
  Input,
  Select,
  Modal,
  Form,
  Spin,
  Tree,
  Pagination,
  notification,
  Popconfirm,
  Checkbox,
  Tag,
  DatePicker,
} from 'antd';
import HeaderContent from '../../layouts/HeaderContent';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import '../../utils/css/styleList.scss';
import { useDispatch, useSelector } from 'react-redux';
import { menu, filter } from '../../features/menu/menuSlice';
import filterIcon from '../../static/web/images/filter.svg';
import MenuDrawer from '../../components/DrawerPage/MenuDrawer';
import { useParams } from 'react-router-dom';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const PAGE_SIZE = process.env.REACT_APP_PAGE_SIZE;

const Menu = ({ isMobile, intl }) => {
  let { id } = useParams();
  const userGroupId = localStorage.getItem('userGroupId');
  const dispatch = useDispatch();
  const list = useSelector(menu);
  const [loading, setLoading] = useState(false);
  const [sorts, setSorts] = useState(['orderBy', 'ASC']);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [gData, setGData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(['0-0', '0-0-0', '0-0-0-0']);
  const [current, setCurrent] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [total, setTotal] = useState(0);
  const [dataTree, setDataTree] = useState({});
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
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
          getList(list);
          setPermissions(list);
        } else {
          openNotification('error', res && res.message, '#fff1f0');
          getList(list);
        }
      },
    });
  };
  const getList = (permission) => {
    const { query } = list;
    const queryFilter = list.filter;
    setLoading(true);
    let params = {
      filter: JSON.stringify({}),
      range: JSON.stringify([0, PAGE_SIZE]),
      sort: JSON.stringify(['orderBy', 'ASC']),
      attributes: 'id,menuName,parentId,orderBy,url,icon,status,createdAt',
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
      type: 'menu/fetch',
      payload: params,
      callback: (res) => {
        setLoading(false);
        if (res.success && res.success === true) {
          const checkData = (data, count) => {
            let arr = (data && data.length > 0 && [...data]) || [];
            arr =
              arr.map((item, index) => {
                const arr1 = {
                  ...item,
                  title: (
                    <Row
                      key={item.id}
                      onDoubleClick={() => {
                        if (permission.isUpdate) {
                          changeVisibleDrawer(item);
                        }
                      }}
                      style={{
                        lineHeight: '30px',
                        marginBottom: '1px',
                        paddingTop: '1px',
                      }}
                      className="row_custom"
                    >
                      <Col sm={10} className="row_10">
                        {permission.isBlock && (
                          <Tooltip
                            title={item.status === 1 ? 'Kích hoạt' : 'Ẩn'}
                          >
                            <Popconfirm
                              title={
                                <>
                                  {item.status === 1 && (
                                    <FormattedMessage id="app.menu.list.change1" />
                                  )}
                                  <div>
                                    <FormattedMessage id="app.menu.list.change2" />
                                  </div>
                                </>
                              }
                              placement="topLeft"
                              onConfirm={() =>
                                handleStatus(item.status !== 1 ? 1 : 0, item)
                              }
                              okText="Ok"
                              cancelText={intl.formatMessage({
                                id: 'app.common.deleteBtn.cancelText',
                              })}
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: 'red' }}
                                />
                              }
                            >
                              <Checkbox
                                // disabled={!isBlocked}
                                checked={item.status === 1}
                                size="small"
                              />
                            </Popconfirm>
                          </Tooltip>
                        )}
                        &nbsp;&nbsp;
                        <span style={{ fontSize: '1rem' }}>
                          {item.menuName}
                        </span>
                      </Col>
                      <Col sm={3} className="row_3">
                        {moment(item.createdAt).format('HH:mm DD/MM/YYYY')}
                      </Col>
                      <Col sm={3} className="row_3">
                        {moment(item.updatedAt).format('HH:mm DD/MM/YYYY')}
                      </Col>
                      <Col sm={3} className="row_3">
                        {item.status === 0 && <Tag color="gold">Ẩn</Tag>}
                        {item.status === 1 && (
                          <Tag color="green">Kích hoạt</Tag>
                        )}
                        {item.status === -1 && <Tag color="red">Chờ xóa</Tag>}
                      </Col>
                      <Col sm={5} className="row_5">
                        {permission.isDelete && (
                          <Tooltip
                            title={
                              !isMobile && (
                                <FormattedMessage id="app.tooltip.remove" />
                              )
                            }
                          >
                            <Popconfirm
                              title={
                                <FormattedMessage id="app.menu.list.change1" />
                              }
                              placement="topLeft"
                              // onConfirm={() => handleStatus(-1, item)}
                              onConfirm={() => handleDelete(item.id)}
                              okText="Ok"
                              cancelText={intl.formatMessage({
                                id: 'app.common.deleteBtn.cancelText',
                              })}
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: 'red' }}
                                />
                              }
                            >
                              <Button
                                style={{ float: 'right' }}
                                icon={
                                  <i
                                    className="fas fa-trash"
                                    style={{ marginRight: '5px' }}
                                  />
                                }
                                className="btn_edit"
                                type="ghost"
                                shape="circle"
                              >
                                <FormattedMessage id="app.tooltip.remove" />
                              </Button>
                            </Popconfirm>
                          </Tooltip>
                        )}
                        {permission.isUpdate && (
                          <Tooltip
                            title={
                              !isMobile && (
                                <FormattedMessage id="app.tooltip.edit" />
                              )
                            }
                          >
                            <Button
                              onClick={() => changeVisibleDrawer(item)}
                              icon={
                                <i
                                  className="fas fa-pen"
                                  style={{ marginRight: '5px' }}
                                />
                              }
                              className="btn_edit"
                              style={{ marginRight: 10, float: 'right' }}
                              type="ghost"
                              shape="circle"
                            >
                              <FormattedMessage id="app.tooltip.edit" />
                            </Button>
                          </Tooltip>
                        )}
                      </Col>
                    </Row>
                  ),
                  key: `${count}-${index}`,
                };
                const count1 = `${count}-${index}`;
                if (arr1.children) {
                  const arr2 = checkData(arr1.children, count1);
                  return { ...arr1, children: arr2 };
                }
                return { ...arr1 };
              }) || [];
            return arr;
          };
          const arr = checkData(res.results && res.results.list, '0') || [];
          setGData(arr);
          setCurrent(res.results && res.results.pagination.current);
          setPageSize(res.results && res.results.pagination.pageSize);
          setTotal(res.results && res.results.pagination.total);
        } else {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  const handleDelete = (id) => {
    dispatch({
      type: 'menu/delete',
      payload: {
        id: id,
      },
      callback: (res) => {
        if (res && res.success) {
          openNotification(
            'success',
            intl.formatMessage({ id: 'app.common.delete.success' }),
            '#f6ffed'
          );
          getList();
        } else {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  const changeVisibleDrawer = (item) => {
    dispatch({
      type: 'menu/detailTree',
      payload: { id: item.id },
      callback: (res) => {
        setDataEdit(item);
        setVisibleDrawer(true);
        setDataTree(res.results.list[0]);
      },
    });
  };

  const setSort = (values) => {
    let sorts = ['orderBy', 'ASC'];
    if (values) {
      const { columnKey, order } = values;
      sorts = [columnKey || 'orderby', order === 'ascend' ? 'asc' : 'desc'];
    }
    setSorts(sorts);
    return sorts;
  };

  const setFilter = (values) => {
    const queryName = {
      menuName: (values && values.menuName && values.menuName.trim()) || '',
      status: values && values.status,
    };
    if (values.dateCreated && values.dateCreated.length > 0) {
      const dateStart = values.dateCreated[0].format('YYYY-MM-DD 00:00:00');
      const dateEnd = values.dateCreated[1].format('YYYY-MM-DD 23:59:59');
      delete queryName.dateCreated;
      queryName.FromDate = dateStart;
      queryName.ToDate = dateEnd;
    } else if (!values.dateCreated) {
      delete queryName.dateCreated;
    }
    if (!values.status) {
      delete queryName.status;
    }
    // xử lý ftype dạng "chlChannelTypeId":"1", "chlId":"1,2" từ đối tượng fType
    if (queryName.menuName === '') {
      delete queryName.menuName;
    }
    return queryName;
  };

  const handleChange = (current) => {
    const queryFilter = list.filter;
    const queries = setFilter(queryFilter);
    const sort = ['orderBy', 'ASC'];
    const query = {
      filter: JSON.stringify(queries),
      range: JSON.stringify([
        current * PAGE_SIZE - PAGE_SIZE,
        current * PAGE_SIZE,
      ]),
      sort: JSON.stringify(sort),
    };
    setLoading(true);
    dispatch({
      type: 'menu/fetch',
      payload: query,
      callback: (res) => {
        setLoading(false);
        if (res.success && res.success === true) {
          const checkData = (data, count) => {
            let arr = (data && data.length > 0 && [...data]) || [];
            arr =
              arr.map((item, index) => {
                const arr1 = {
                  ...item,
                  title: (
                    <Row
                      key={item.id}
                      onDoubleClick={() => {
                        if (permissions.isUpdate) {
                          changeVisibleDrawer(item);
                        }
                      }}
                      style={{
                        lineHeight: '30px',
                        marginBottom: '1px',
                        paddingTop: '1px',
                      }}
                      className="row_custom"
                    >
                      <Col sm={10} className="row_10">
                        {permissions.isBlock && (
                          <Tooltip
                            title={item.status === 1 ? 'Kích hoạt' : 'Ẩn'}
                          >
                            <Popconfirm
                              title={
                                <>
                                  {item.status === 1 && (
                                    <FormattedMessage id="app.menu.list.change1" />
                                  )}
                                  <div>
                                    <FormattedMessage id="app.menu.list.change2" />
                                  </div>
                                </>
                              }
                              placement="topLeft"
                              onConfirm={() =>
                                handleStatus(item.status !== 1 ? 1 : 0, item)
                              }
                              okText="Ok"
                              cancelText={intl.formatMessage({
                                id: 'app.common.deleteBtn.cancelText',
                              })}
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: 'red' }}
                                />
                              }
                            >
                              <Checkbox
                                // disabled={!isBlocked}
                                checked={item.status === 1}
                                size="small"
                              />
                            </Popconfirm>
                          </Tooltip>
                        )}
                        &nbsp;&nbsp;
                        <span style={{ fontSize: '1rem' }}>
                          {item.menuName}
                        </span>
                      </Col>
                      <Col sm={3} className="row_3">
                        {moment(item.createdAt).format('HH:mm DD/MM/YYYY')}
                      </Col>
                      <Col sm={3} className="row_3">
                        {moment(item.updatedAt).format('HH:mm DD/MM/YYYY')}
                      </Col>
                      <Col sm={3} className="row_3">
                        {item.status === 0 && <Tag color="gold">Ẩn</Tag>}
                        {item.status === 1 && (
                          <Tag color="green">Kích hoạt</Tag>
                        )}
                        {item.status === -1 && <Tag color="red">Chờ xóa</Tag>}
                      </Col>
                      <Col sm={5} className="row_5">
                        {permissions.isDelete && (
                          <Tooltip
                            title={
                              !isMobile && (
                                <FormattedMessage id="app.tooltip.remove" />
                              )
                            }
                          >
                            <Popconfirm
                              title={
                                <FormattedMessage id="app.menu.list.change1" />
                              }
                              placement="topLeft"
                              // onConfirm={() => handleStatus(-1, item)}
                              onConfirm={() => handleDelete(item.id)}
                              okText="Ok"
                              cancelText={intl.formatMessage({
                                id: 'app.common.deleteBtn.cancelText',
                              })}
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: 'red' }}
                                />
                              }
                            >
                              <Button
                                style={{ float: 'right' }}
                                icon={
                                  <i
                                    className="fas fa-trash"
                                    style={{ marginRight: '5px' }}
                                  />
                                }
                                className="btn_edit"
                                type="ghost"
                                shape="circle"
                              >
                                <FormattedMessage id="app.tooltip.remove" />
                              </Button>
                            </Popconfirm>
                          </Tooltip>
                        )}
                        {permissions.isUpdate && (
                          <Tooltip
                            title={
                              !isMobile && (
                                <FormattedMessage id="app.tooltip.edit" />
                              )
                            }
                          >
                            <Button
                              onClick={() => changeVisibleDrawer(item)}
                              icon={
                                <i
                                  className="fas fa-pen"
                                  style={{ marginRight: '5px' }}
                                />
                              }
                              className="btn_edit"
                              style={{ marginRight: 10, float: 'right' }}
                              type="ghost"
                              shape="circle"
                            >
                              <FormattedMessage id="app.tooltip.edit" />
                            </Button>
                          </Tooltip>
                        )}
                      </Col>
                    </Row>
                  ),
                  key: `${count}-${index}`,
                };
                const count1 = `${count}-${index}`;
                if (arr1.children) {
                  const arr2 = checkData(arr1.children, count1);
                  return { ...arr1, children: arr2 };
                }
                return { ...arr1 };
              }) || [];
            return arr;
          };
          const arr = checkData(res.results && res.results.list, '0') || [];
          setGData(arr);
          setCurrent(res.results && res.results.pagination.current);
          setPageSize(res.results && res.results.pagination.pageSize);
          setTotal(res.results && res.results.pagination.total);
        } else {
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
  const handleSearch = (values) => {
    const queries = setFilter(values);
    const query = {
      filter: JSON.stringify(queries),
      range: JSON.stringify([0, PAGE_SIZE - 1]),
      sort: JSON.stringify(sorts),
    };
    setLoading(true);
    dispatch(filter(values));
    dispatch({
      type: 'menu/fetch',
      payload: query,
      callback: (res) => {
        setLoading(false);
        setVisibleFilter(false);
        if (res.success && res.success === true) {
          const checkData = (data, count) => {
            let arr = (data && data.length > 0 && [...data]) || [];
            arr =
              arr.map((item, index) => {
                const arr1 = {
                  ...item,
                  title: (
                    <Row
                      key={item.id}
                      onDoubleClick={() => {
                        if (permissions.isUpdate) {
                          changeVisibleDrawer(item);
                        }
                      }}
                      style={{
                        lineHeight: '30px',
                        marginBottom: '1px',
                        paddingTop: '1px',
                      }}
                      className="row_custom"
                    >
                      <Col sm={10} className="row_10">
                        {permissions.isBlock && (
                          <Tooltip
                            title={
                              item.status === 1
                                ? 'Kích hoạt'
                                : item.status === 0
                                ? 'Ẩn'
                                : 'Chờ xóa'
                            }
                          >
                            <Popconfirm
                              title={
                                <>
                                  {item.status === 1 && (
                                    <FormattedMessage id="app.menu.list.change1" />
                                  )}
                                  <div>
                                    <FormattedMessage id="app.menu.list.change2" />
                                  </div>
                                </>
                              }
                              placement="topLeft"
                              onConfirm={() =>
                                handleStatus(item.status !== 1 ? 1 : 0, item)
                              }
                              okText="Ok"
                              cancelText={intl.formatMessage({
                                id: 'app.common.deleteBtn.cancelText',
                              })}
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: 'red' }}
                                />
                              }
                            >
                              <Checkbox
                                // disabled={!isBlocked}
                                checked={item.status === 1}
                                size="small"
                              />
                            </Popconfirm>
                          </Tooltip>
                        )}
                        &nbsp;&nbsp;
                        <span style={{ fontSize: '1rem' }}>
                          {item.menuName}
                        </span>
                      </Col>
                      <Col sm={3} className="row_3">
                        {moment(item.createdAt).format('HH:mm DD/MM/YYYY')}
                      </Col>
                      <Col sm={3} className="row_3">
                        {moment(item.updatedAt).format('HH:mm DD/MM/YYYY')}
                      </Col>
                      <Col sm={3} className="row_3">
                        {item.status === 0 && <Tag color="gold">Ẩn</Tag>}
                        {item.status === 1 && (
                          <Tag color="green">Kích hoạt</Tag>
                        )}
                        {item.status === -1 && <Tag color="red">Chờ xóa</Tag>}
                      </Col>
                      <Col sm={5} className="row_5">
                        {permissions.isDelete && (
                          <Tooltip
                            title={
                              !isMobile && (
                                <FormattedMessage id="app.tooltip.remove" />
                              )
                            }
                          >
                            <Popconfirm
                              title={
                                <FormattedMessage id="app.menu.list.change1" />
                              }
                              placement="topLeft"
                              // onConfirm={() => handleStatus(-1, item)}
                              onConfirm={() => handleDelete(item.id)}
                              okText="Ok"
                              cancelText={intl.formatMessage({
                                id: 'app.common.deleteBtn.cancelText',
                              })}
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: 'red' }}
                                />
                              }
                            >
                              <Button
                                style={{ float: 'right' }}
                                icon={
                                  <i
                                    className="fas fa-trash"
                                    style={{ marginRight: '5px' }}
                                  />
                                }
                                className="btn_edit"
                                type="ghost"
                                shape="circle"
                              >
                                <FormattedMessage id="app.tooltip.remove" />
                              </Button>
                            </Popconfirm>
                          </Tooltip>
                        )}
                        {permissions.isUpdate && (
                          <Tooltip
                            title={
                              !isMobile && (
                                <FormattedMessage id="app.tooltip.edit" />
                              )
                            }
                          >
                            <Button
                              onClick={() => changeVisibleDrawer(item)}
                              icon={
                                <i
                                  className="fas fa-pen"
                                  style={{ marginRight: '5px' }}
                                />
                              }
                              className="btn_edit"
                              style={{ marginRight: 10, float: 'right' }}
                              type="ghost"
                              shape="circle"
                            >
                              <FormattedMessage id="app.tooltip.edit" />
                            </Button>
                          </Tooltip>
                        )}
                      </Col>
                    </Row>
                  ),
                  key: `${count}-${index}`,
                };
                const count1 = `${count}-${index}`;
                if (arr1.children) {
                  const arr2 = checkData(arr1.children, count1);
                  return { ...arr1, children: arr2 };
                }
                return { ...arr1 };
              }) || [];
            return arr;
          };
          const arr = checkData(res.results && res.results.list, '0') || [];
          setGData(arr);
          setCurrent(res.results && res.results.pagination.current);
          setPageSize(res.results && res.results.pagination.pageSize);
          setTotal(res.results && res.results.pagination.total);
        } else {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  const handleStatus = (e, row) => {
    setLoading(true);
    const status = e;
    const addItem = {
      status,
    };
    dispatch({
      type: 'menu/updateStatusList',
      payload: {
        id: row.id,
        params: {
          ...addItem,
        },
      },
      callback: (result) => {
        setLoading(false);
        if (result && result.success === true) {
          openNotification(
            'success',
            intl.formatMessage({ id: 'app.common.edit.success' }),
            '#f6ffed'
          );
          getList();
        } else {
          openNotification('error', result && result.message, '#fff1f0');
        }
      },
    });
  };

  const onDrop = (info) => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...gData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert
        item.children.push(dragObj);
      });
      const addItem = {
        menuName: info.dragNode.menuName,
        menuNameOld: info.dragNode.menuName,
        menuParentId: info.node.id,
      };
      let err = 0;
      setLoading(true);
      if (info.dragNode.sitesId !== info.node.sitesId) {
        err = 1;
      }
      if (err) {
        setLoading(false);
      } else {
        dispatch({
          type: 'menu/update',
          payload: {
            id: info.dragNode.id,
            params: {
              ...addItem,
            },
          },
          callback: (result) => {
            if (result && result.success === true) {
              openNotification(
                'error',
                intl.formatMessage({ id: 'app.common.edit.success' }),
                '#f6ffed'
              );
              getList();
            } else if (result && result.success === false) {
              setLoading(false);
              openNotification('error', result && result.message, '#fff1f0');
            }
          },
        });
      }
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
      let dataAll = [];
      const dataAll1 = [];
      let err = 0;
      if (info.node.menuParentId === '' || info.node.menuParentId === null) {
        const updateData = (dataItem) => {
          let arr = (dataItem && dataItem.length > 0 && [...dataItem]) || [];
          arr =
            arr.map((item, index) => {
              const arr1 = {
                id: item.id,
                orderby: index + 1,
              };
              return { ...arr1 };
            }) || [];
          return arr;
        };
        dataAll = updateData(data) || [];
      } else {
        const updateData = (dataItem) => {
          const arr = (dataItem && dataItem.length > 0 && [...dataItem]) || [];
          let arrData = [];
          let arr1 = {};
          arrData =
            arr.map((item, index) => {
              if (
                item.menuParentId === info.node.menuParentId ||
                item.id === info.dragNode.id
              ) {
                arr1 = {
                  id: item.id,
                  orderby: index + 1,
                };
                dataAll1.push({
                  id: item.id,
                  orderby: index + 1,
                });
                if (item.sitesId !== info.dragNode.sitesId) {
                  err = 1;
                }
              } else if (item.children) {
                const arr2 = updateData(item.children);
                return { ...arr2 };
              }
              return { ...arr1 };
            }) || [];
          return arrData;
        };
        updateData(data);
        dataAll = [...dataAll1];
      }
      setLoading(true);
      const params = {
        orders: [...dataAll],
      };
      const addItem = {
        menuName: info.dragNode.menuName,
        menuNameOld: info.dragNode.menuName,

        menuParentId: info.node.menuParentId,
      };
      dispatch({
        type: 'menu/update',
        payload: {
          id: info.dragNode.id,
          params: {
            ...addItem,
          },
        },
      });
      if (err) {
        setLoading(false);
      } else {
        dispatch({
          type: 'menu/updateOrder',
          payload: params,
          callback: (result) => {
            if (result && result.success === false) {
              openNotification('error', result && result.message, '#fff1f0');
            } else if (result) {
              openNotification(
                'success',
                intl.formatMessage({ id: 'app.common.edit.success' }),
                '#f6ffed'
              );
              getList();
            }
            setLoading(false);
          },
        });
      }
    }
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
          menuName: filter.menuName || '',
          status: filter.status || undefined,
          dateCreated: filter.dateCreated || [],
        }}
      >
        <Row gutter={{ md: 0, lg: 8, xl: 16 }}>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="menuName"
              label={<FormattedMessage id="app.menu.list.col0" />}
              {...formItemLayout}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'app.menu.search.col0',
                })}
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
  return (
    <>
      <HeaderContent
        title={<FormattedMessage id="app.menu.list.header" />}
        action={
          <React.Fragment>
            {permissions.isAdd && (
              <Tooltip
                title={
                  !isMobile &&
                  intl.formatMessage({ id: 'app.menu.create.header' })
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
        <div className="renderTree">
          <Row className="dragtreeTitle">
            <Col sm={10} className="row_8" style={{ color: '#fff' }}>
              {intl.formatMessage({ id: 'app.menu.list.col0' })}
            </Col>
            <Col sm={3} className="row_3" style={{ color: '#fff' }}>
              {intl.formatMessage({ id: 'app.common.placeholder.dateCreated' })}
            </Col>
            <Col sm={3} className="row_3" style={{ color: '#fff' }}>
              {intl.formatMessage({ id: 'app.common.placeholder.dateUpdated' })}{' '}
            </Col>
            <Col sm={3} className="row_5" style={{ color: '#fff' }}>
              {intl.formatMessage({ id: 'app.search.status' })}
            </Col>
            <Col
              sm={5}
              className="row_5"
              style={{ textAlign: 'right', color: '#fff' }}
            >
              {intl.formatMessage({ id: 'app.table.column.no' })}
            </Col>
          </Row>
          <Spin spinning={loading}>
            {gData.length > 0 ? (
              <>
                <Tree
                  className="dragtree"
                  defaultExpandedKeys={expandedKeys}
                  draggable
                  blockNode
                  onDrop={onDrop}
                  treeData={gData}
                />
                <Pagination
                  size="small"
                  key={current}
                  style={{
                    background: '#FAFAFA',
                    width: '100%',
                    textAlign: 'right',
                    padding: '10px 0',
                  }}
                  total={total}
                  pageSize={pageSize}
                  showSizeChanger={false}
                  onChange={handleChange}
                />
              </>
            ) : (
              <div className="noData">Không có dữ liệu</div>
            )}
          </Spin>
        </div>
      </HeaderContent>
      <MenuDrawer
        intl={intl}
        isMobile={isMobile}
        visible={visibleDrawer}
        titleDrawer={intl.formatMessage({ id: 'app.user.list.title' })}
        dataEdit={dataEdit}
        dataTree={dataTree}
        resetVisible={() => setVisibleDrawer(false)}
        getList={getList}
      />
    </>
  );
};

export default Menu;
