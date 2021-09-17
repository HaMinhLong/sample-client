import React, { useState, useEffect } from 'react';
import HeaderContent from '../../layouts/HeaderContent';
import { FormattedMessage } from 'react-intl';

const PAGE_SIZE = 20;

const UserGroup = () => {
  useEffect(() => {
    const params = {
      filter: JSON.stringify({}),
      range: JSON.stringify([0, PAGE_SIZE - 1]),
      sort: JSON.stringify(['userGroupName', 'ASC']),
      attributes: [],
    };
  }, []);
  return (
    <HeaderContent title={<FormattedMessage id="app.userGroup.list.header" />}>
      <h1>Nhóm người dùng</h1>
    </HeaderContent>
  );
};

export default UserGroup;
