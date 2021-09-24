import React, { useState, useEffect } from 'react';
import HeaderContent from '../../layouts/HeaderContent';
import { useParams } from 'react-router-dom';
import { Button, Tooltip, notification } from 'antd';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
  userGroupRole,
  filter,
} from '../../features/userGroupRole/userGroupRoleSlice';
import CheckBox from '../../components/CheckBox';
import _ from 'lodash';
import Table from '../../components/Table';

const PAGE_SIZE = 50;

const UserGroupRole = ({ isMobile, intl }) => {
  const dispatch = useDispatch();
  let { id } = useParams();
  let history = useHistory();
  const dataAll = useSelector(userGroupRole);
  const { data } = dataAll;

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [getRoleTemplate, setGetRoleTemplate] = useState(false);
  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    setLoading(true);
    const { query } = dataAll;
    const queryFilter = dataAll.filter;
    let params = {
      filter: JSON.stringify({}),
      range: JSON.stringify([0, PAGE_SIZE]),
      sort: JSON.stringify(['createdAt', 'DESC']),
      attributes:
        'id,menuName,menuParentId,userGroupId,menuId,isView,isAdd,isUpdate,isDelete,isBlock,isApprove',
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
      type: 'userGroupRole/fetch',
      payload: {
        id: id,
        params: params,
      },
      callback: (res) => {
        setLoading(false);
        if (res.success) {
          const { list } = res.results;
          setRoles(list);
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

  const updateRole = (e) => {
    e.preventDefault();
    const params = roles;

    dispatch({
      type: 'userGroupRole/bulkUpdate',
      payload: {
        id: id,
        params: params,
      },
      callback: (res) => {
        if (res.success) {
          openNotification(
            'success',
            intl.formatMessage({ id: 'app.common.permissions.success' }),
            '#f6ffed'
          );
          getList();
        } else {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };
  const roleChange = (e, name, cell, row) => {
    let newRoles = [];
    const findRole = roles.filter((item) => item.id === row.id).length > 0;
    if (findRole) {
      newRoles = roles.map((item) => {
        if (item.id === row.id) {
          return {
            ...item,
            [name]: e.target.checked,
          };
        }
        return item;
      });
    } else {
      newRoles = [
        ...roles,
        {
          ...row,
          [name]: e.target.checked,
        },
      ];
    }
    // check nếu role là cha
    if (row.menuParentId === null) {
      const findChild = data.list.filter((x) => x.menuParentId === row.menuId);
      if (findChild && findChild.length > 0) {
        // eslint-disable-next-line array-callback-return
        findChild.map((item) => {
          const tItem = newRoles.find((x) => x.id === item.id)
            ? newRoles.find((x) => x.id === item.id)
            : data.list.find((x) => x.id === item.id);
          const tNewRoles = newRoles.filter((x) => x.id !== item.id);
          newRoles = [
            ...tNewRoles,
            {
              ...tItem,
              [name]: e.target.checked,
            },
          ];
        });
      }
    }
    // check nếu là con
    else {
      // chỉ xét thêm quyền, không xét bỏ quyền
      // eslint-disable-next-line no-lonely-if
      if (e.target.checked) {
        const tnewRoles = newRoles.filter((x) => x.menuId !== row.menuParentId);
        let itemParent = data.list.filter((x) => x.menuId === row.menuParentId);
        itemParent = itemParent && itemParent[0];
        const tItemParent = newRoles.find((x) => x.id === itemParent.id)
          ? newRoles.find((x) => x.id === itemParent.id)
          : data.list.find((x) => x.id === itemParent.id);
        newRoles = [
          ...tnewRoles,
          {
            ...tItemParent,
            [name]: e.target.checked,
          },
        ];
      }
    }
    setRoles(newRoles);
    setGetRoleTemplate(false);
  };

  const addAllRoles = (e, type) => {
    if (data && data.list) {
      const isChecked = e.target.checked;
      const tempRoles =
        (data &&
          data.list.map((i) => Object.assign(i, { [type]: isChecked }))) ||
        [];
      const key = roles.map((item) => item.id);
      const dataArr = [];
      // eslint-disable-next-line no-unused-vars
      const dataRoles = key
        .map((items) => tempRoles.filter((item) => items === item.id))
        .map((item) => dataArr.push(item[0]));

      const tempExistedRoles = roles.map((i) =>
        Object.assign(i, { [type]: isChecked })
      );
      const difference = _.difference(tempRoles, dataArr)
        .concat(tempExistedRoles)
        .sort((a, b) => a.menuId - b.menuId);
      setRoles(difference);
      setGetRoleTemplate(false);
    }
  };
  const unflatten = (array, parent, tree) => {
    // eslint-disable-next-line no-param-reassign
    tree = typeof tree !== 'undefined' ? tree : [];
    // eslint-disable-next-line no-param-reassign
    parent = typeof parent !== 'undefined' ? parent : { menuId: null };

    let children = _.filter(
      array,
      (child) => child.menuParentId === parent.menuId
    );
    if (!_.isEmpty(children)) {
      if (parent.menuId === null) {
        children = children.map((item, index) => ({
          ...item,
          tIndex: Number(index + 1),
        }));
        // eslint-disable-next-line no-param-reassign
        tree = children;
      } else {
        // eslint-disable-next-line dot-notation
        children = children.map((item, index) => ({
          ...item,
          tIndex: `${parent.tIndex}-${Number(index + 1)}`,
        }));
        // eslint-disable-next-line no-param-reassign
        parent.children = children;
      }

      _.each(children, (child) => {
        unflatten(array, child);
      });
    }
    return tree;
  };
  let difference = [];
  if (!getRoleTemplate) {
    const key = roles.map((item) => item.id);
    const dataArr = [];
    // eslint-disable-next-line no-unused-vars
    const dataRoles = key
      .map(
        (items) =>
          data && data.list && data.list.filter((item) => items === item.id)
      )
      .map((item) => dataArr.push(item[0]));
    difference = _.difference(data && data.list, dataArr)
      .concat(roles)
      .sort((a, b) => a.id - b.id);
  } else {
    const dataArr = [];
    difference = _.difference(data && data.list, dataArr).sort(
      (a, b) => a.id - b.id
    );
  }
  difference = unflatten(difference);

  const stylesColumn = {
    fontWeight: 'bold',
    color: 'black',
    fontSize: '16px',
  };
  const columns = [
    {
      dataIndex: null,
      title: '#',
      width: '7%',
      key: 'STT',
      align: 'center',
      fixed: isMobile,
      render: (text, record) => {
        // log('record', record)
        if (record.menuParentId === null)
          return <span style={stylesColumn}>{record.tIndex}</span>;
        return record.tIndex;
      },

      // (text, record, index) => record.tIndex
    },
    {
      dataIndex: 'menuName',
      title: intl.formatMessage({ id: 'app.menu.list.col0' }),
      width: '18%',
      key: 'menuName',
      // align: 'center',
      render: (text, record) => {
        if (record.menuParentId === null)
          return <span style={stylesColumn}>{text}</span>;
        return text;
      },
    },
    {
      dataIndex: 'isView',
      title: (
        <div style={{ marginLeft: '32px' }}>
          <CheckBox disabled onChange={(e) => addAllRoles(e, 'isView')} />
          &nbsp;{intl.formatMessage({ id: 'app.userGroupRole.list.isView' })}
        </div>
      ),
      align: 'center',
      key: 'isView',
      width: '12%',
      render: (cell, row) => (
        <React.Fragment>
          <CheckBox
            value={cell}
            cell={cell}
            row={row}
            name="isView"
            onChange={roleChange}
          />
        </React.Fragment>
      ),
    },
    {
      dataIndex: 'isAdd',
      title: (
        <div style={{ marginLeft: '42px' }}>
          <CheckBox disabled onChange={(e) => addAllRoles(e, 'isAdd')} />
          &nbsp;{intl.formatMessage({ id: 'app.userGroupRole.list.isAdd' })}
        </div>
      ),
      align: 'center',
      key: 'isAdd',
      width: '12%',
      render: (cell, row) => (
        <React.Fragment>
          <CheckBox
            value={cell}
            cell={cell}
            row={row}
            name="isAdd"
            onChange={roleChange}
          />
        </React.Fragment>
      ),
    },
    {
      dataIndex: 'isUpdate',
      title: (
        <div style={{ marginLeft: '30px' }}>
          <CheckBox disabled onChange={(e) => addAllRoles(e, 'isUpdate')} />
          &nbsp;{intl.formatMessage({ id: 'app.userGroupRole.list.isUpdate' })}
        </div>
      ),
      align: 'center',
      key: 'isUpdate',
      width: '12%',
      render: (cell, row) => (
        <React.Fragment>
          <CheckBox
            value={cell}
            cell={cell}
            row={row}
            name="isUpdate"
            onChange={roleChange}
          />
        </React.Fragment>
      ),
    },
    {
      dataIndex: 'isDelete',
      title: (
        <div style={{ marginLeft: '28px' }}>
          <CheckBox disabled onChange={(e) => addAllRoles(e, 'isDelete')} />
          &nbsp;{intl.formatMessage({ id: 'app.userGroupRole.list.isDelete' })}
        </div>
      ),
      align: 'center',
      key: 'isDelete',
      width: '12%',
      render: (cell, row) => (
        <React.Fragment>
          <CheckBox
            value={cell}
            cell={cell}
            row={row}
            name="isDelete"
            onChange={roleChange}
          />
        </React.Fragment>
      ),
    },
    {
      dataIndex: 'isBlock',
      title: (
        <div style={{ marginLeft: '28px' }}>
          <CheckBox disabled onChange={(e) => addAllRoles(e, 'isBlock')} />
          &nbsp;{intl.formatMessage({ id: 'app.userGroupRole.list.isBlock' })}
        </div>
      ),
      align: 'center',
      key: 'isBlock',
      width: '12%',
      render: (cell, row) => (
        <React.Fragment>
          <CheckBox
            value={cell}
            cell={cell}
            row={row}
            name="isBlock"
            onChange={roleChange}
          />
        </React.Fragment>
      ),
    },
    {
      dataIndex: 'isApprove',
      title: (
        <div style={{ marginLeft: '28px' }}>
          <CheckBox onChange={(e) => addAllRoles(e, 'isApprove')} />
          &nbsp;{intl.formatMessage({ id: 'app.userGroupRole.list.isApprove' })}
        </div>
      ),
      align: 'center',
      key: 'isApprove',
      width: '12%',
      render: (cell, row) => (
        <React.Fragment>
          <CheckBox
            value={cell}
            cell={cell}
            row={row}
            name="isApprove"
            onChange={roleChange}
          />
        </React.Fragment>
      ),
    },
  ];
  return (
    <HeaderContent
      title={<FormattedMessage id="app.userGroupRole.list.header" />}
      action={
        <React.Fragment>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip
              title={
                !isMobile && intl.formatMessage({ id: 'app.common.crudBtns.0' })
              }
            >
              <Button
                icon={
                  <i
                    className="far fa-arrow-alt-circle-left"
                    style={{ marginRight: '5px' }}
                  />
                }
                onClick={() => history.goBack()}
              >
                {intl.formatMessage({ id: 'app.common.crudBtns.0' })}
              </Button>
            </Tooltip>
            <Tooltip
              title={
                !isMobile && intl.formatMessage({ id: 'app.user.permissions' })
              }
            >
              <Button
                type="primary"
                icon={
                  <i className="fa fa-save" style={{ marginRight: '5px' }} />
                }
                style={{ marginLeft: 10 }}
                onClick={updateRole}
              >
                {intl.formatMessage({ id: 'app.user.permissions' })}
              </Button>
            </Tooltip>
          </div>
        </React.Fragment>
      }
    >
      <Table
        loading={loading}
        defaultExpandAllRows
        expandedRowKeys={difference.map(
          (item) =>
            `${item.id}-${item.isView}-${item.isAdd}-${item.isUpdate}-${item.isDelete}-${item.isBlock}-${item.isApprove}`
        )}
        bordered
        rowKey={(record) =>
          `${record.id}-${record.isView}-${record.isAdd}-${record.isUpdate}-${record.isDelete}-${record.isBlock}-${record.isApprove}`
        }
        scroll={{ x: isMobile ? 1200 : '100vh', y: '70vhh' }}
        dataSource={difference || []}
        columns={columns}
        pagination="none"
        expandable={{
          expandIcon: () => null,
        }}
        onExpand={(expanded) => (expanded = true)}
      />
    </HeaderContent>
  );
};
export default UserGroupRole;
