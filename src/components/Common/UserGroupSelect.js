/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { useDispatch } from 'react-redux';
import { fnKhongDau } from '../../utils/utils';
import { Select, Spin } from 'antd';
import _ from 'lodash';

let timer = null;

const UserGroupSelect = ({
  value,
  textProps,
  filter,
  key,
  placeholder,
  disabled,
  allowClear,
  size,
  style,
  onChange,
  getAll,
}) => {
  const dispatch = useDispatch();

  const [valueState, setValueState] = useState(value);
  const [loading, setLoading] = useState(false);
  const [dataArr, setDataArr] = useState([]);
  const [icon, setIcon] = useState(null);
  const [numOfScroll, setNumOfScroll] = useState(2);
  const [searchValue, setSearchValue] = useState('');
  const [checkState, setCheckState] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [dataStore, setDataStore] = useState([]);
  const [text, setText] = useState(textProps || '');
  useEffect(() => {
    fetch(1, undefined, valueState, false, false, false);
  }, []);

  const onFocus = () => {
    setIcon(<i className="fa fa-search" />);
  };
  const onBlur = () => {
    setIcon(null);
  };
  const onChangeFun = (valueState) => {
    if (valueState) {
      setValueState(valueState);
      setText(
        dataArr.find((x) => x.valueState === valueState) &&
          dataArr.find((x) => x.valueState === valueState).text
      );
    } else {
      setValueState(valueState);
      setText(
        dataArr.find((x) => x.valueState === valueState) &&
          dataArr.find((x) => x.valueState === valueState).text
      );
      fetch(1, undefined, valueState, false, false, true);
    }
    if (onChange)
      onChange(
        valueState,
        dataArr.find((x) => x.valueState === valueState) &&
          dataArr.find((x) => x.valueState === valueState).text
      );
  };
  const fetch = (
    current,
    flag,
    valueState,
    ChangeFilter,
    checkAddItem,
    checkDataAll
  ) => {
    const pagesize = 20;
    const tfilter = {
      userGroupName: searchValue,
      status: 1,
    };
    if (getAll) {
      delete tfilter.status;
    }
    if (!searchValue || (searchValue && !searchValue.trim())) {
      delete tfilter.userGroupName;
    }
    const params = {
      filter: JSON.stringify(tfilter),
      range: JSON.stringify([pagesize * (current - 1), current * pagesize]),
      sort: JSON.stringify(['userGroupName', 'ASC']),
      attributes: 'id,userGroupName',
    };
    dispatch({
      type: 'userGroup/fetchLazyLoading',
      payload: params,
      select: current !== 1,
      callback: (result) => {
        if (result && result.success === true) {
          const data =
            result &&
            result.results &&
            result.results.list.map((data) => ({
              valueState: data.id,
              text: data.userGroupName,
            }));
          setTotalItems(
            result &&
              result.results.pagination &&
              result.results.pagination.total
          );
          if (dataArr.length === 0 || flag) {
            if (checkAddItem) {
              if (searchValue) {
                setDataArr([..._.uniqBy([...dataArr, ...data], 'valueState')]);
                setDataStore([
                  ..._.uniqBy([...dataStore, ...data], 'valueState'),
                ]);
              } else {
                setDataArr([..._.uniqBy([...dataArr, ...data], 'valueState')]);
                setDataStore([
                  ..._.uniqBy([...dataStore, ...data], 'valueState'),
                ]);
                addItem(valueState);
              }
            } else {
              setDataArr([..._.uniqBy([...dataArr, ...data], 'valueState')]);
              setDataStore([
                ..._.uniqBy([...dataStore, ...data], 'valueState'),
              ]);
              addItem(valueState);
            }
          } else if (checkDataAll) {
            setDataArr([..._.uniqBy([...dataStore, ...data], 'valueState')]);
            setDataStore([..._.uniqBy([...dataStore, ...data], 'valueState')]);
            setCheckState(true);
            setNumOfScroll(2);
          } else {
            setDataArr([..._.uniqBy([...dataArr, ...data], 'valueState')]);
            setDataStore([..._.uniqBy([...dataStore, ...data], 'valueState')]);
            setCheckState(true);
          }
        }
      },
    });
  };

  const handleScroll = (e) => {
    e.preventDefault();
    const pagination = totalItems;

    const isEndOfList = e.target.scrollTop + e.target.clientHeight;

    if (
      checkState &&
      isEndOfList >= (4 * e.target.scrollHeight) / 5 &&
      20 * (numOfScroll - 1) < pagination
    ) {
      setNumOfScroll(numOfScroll + 1);
      setCheckState(false);
      fetch(numOfScroll, undefined, valueState, false, false, false);
    }
  };

  const addItem = (valueState) => {
    if (
      valueState !== undefined &&
      text !== undefined &&
      valueState !== '' &&
      text !== '' &&
      dataArr.findIndex((o) => o.valueState === valueState) < 0
    ) {
      setDataArr([{ text: `${text}`, valueState }, ...dataArr]);
      setDataStore([{ text: `${text}`, valueState }, ...dataStore]);
    }
  };

  const search = (string) => {
    const dataTemp = dataStore.filter(
      (item) => fnKhongDau(item.text).indexOf(fnKhongDau(string)) !== -1
    );
    if (string) {
      setDataArr(dataTemp);
      setSearchValue(string);
      setNumOfScroll(2);
    } else {
      setDataArr(dataStore);
      setSearchValue('');
      setNumOfScroll(2);
    }
    clearTimeout(timer);
    timer = setTimeout(
      fetch.bind(this, 1, string, valueState, false, true, false),
      500
    );
  };
  const handleMouseLeave = () => {
    if (searchValue && searchValue !== '' && filter) {
      setSearchValue('');
    }
  };
  const renderData = (data) =>
    (data || []).map((item) => (
      <Select.Option value={item.valueState} key={item.valueState}>
        {item.text.trim()}
      </Select.Option>
    ));
  const dataRender = renderData(dataArr);
  console.log('dataRender', dataRender);
  return (
    <React.Fragment>
      <Select
        key={key}
        onFocus={onFocus}
        onBlur={onBlur}
        suffixIcon={icon}
        showArrow
        showSearch
        defaultValue={valueState || undefined}
        notFoundContent={loading ? <Spin size="small" /> : null}
        onChange={onChangeFun}
        onSearch={search}
        filterOption={false}
        disabled={disabled}
        placeholder={placeholder}
        size={size}
        allowClear={allowClear}
        loading={loading}
        onPopupScroll={handleScroll}
        onDropdownVisibleChange={handleMouseLeave}
        style={style}
      >
        {dataRender}
      </Select>
    </React.Fragment>
  );
};

export default UserGroupSelect;
