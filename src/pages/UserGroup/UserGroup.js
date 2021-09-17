import React, { useState, useEffect } from 'react';
import HeaderContent from '../../layouts/HeaderContent';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { filter } from '../../features/userGroup/userGroupSlice';
const PAGE_SIZE = 20;

const UserGroup = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const params = {
      filter: JSON.stringify({}),
      range: JSON.stringify([0, PAGE_SIZE - 1]),
      sort: JSON.stringify(['userGroupName', 'ASC']),
      attributes: [],
    };
    dispatch({
      type: 'userGroup/filter',
      payload: params,
    });
    dispatch({
      type: 'userGroup/info',
      payload: {
        id: '124077026088',
      },
      callback: (data) => {
        console.log(data);
      },
    });
    dispatch({
      type: 'userGroup/fetch',
      payload: params,
      callback: (data) => {
        console.log(data);
      },
    });
  }, [dispatch]);
  return (
    <HeaderContent title={<FormattedMessage id="app.userGroup.list.header" />}>
      <h1>Nhóm người dùng</h1>
    </HeaderContent>
  );
};

export default UserGroup;
