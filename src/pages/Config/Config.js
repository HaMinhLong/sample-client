import React, { useState, useEffect } from 'react';
import HeaderContent from '../../layouts/HeaderContent';
import { FormattedMessage } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
const Config = () => {
  // const dispatch = useDispatch();

  return (
    <HeaderContent
      title={<FormattedMessage id="app.config.list.title.header" />}
    >
      <h1>{<FormattedMessage id="app.config.list.title.header" />}</h1>
    </HeaderContent>
  );
};
export default Config;
