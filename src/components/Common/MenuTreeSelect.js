import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';
import { useDispatch } from 'react-redux';
import { fnKhongDau } from '../../utils/utils';
import _ from 'lodash';

let timer = null;

const { TreeNode } = TreeSelect;

const MenuTreeSelect = ({
  value,
  dataTreeProps,
  textProps,
  allowClear,
  onChange,
  idCategory,
  placeholder,
  size,
  key,
}) => {
  const dispatch = useDispatch();
  const [valueMenu, setValueMenu] = useState(value);
  const [loading, setLoading] = useState(false);
  const [dataTree, setDataTree] = useState(dataTreeProps);
  const [dataArr, setDataArr] = useState([]);
  const [data, setData] = useState([]);
  const [icon, setIcon] = useState(null);
  const [numOfScroll, setNumOfScroll] = useState(2);
  const [searchValue, setSearchValue] = useState('');
  const [checkState, setCheckState] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [text, setText] = useState(textProps);
  // const [menuParentId, setMenuParentId] = useState('');
  const [dataStore, setDataStore] = useState([]);

  useEffect(() => {
    fetch(1, undefined, valueMenu, false, false, false, '');
  }, []);

  const addItem = (valueMenu) => {
    if (
      dataTree &&
      dataTree.id &&
      valueMenu !== undefined &&
      text !== undefined &&
      valueMenu !== '' &&
      text !== '' &&
      dataArr.findIndex((o) => o.id === (dataTree && dataTree.id)) < 0
    ) {
      setDataArr([dataTree, ...dataArr]);
      setDataStore([dataTree, ...dataStore]);
    }
  };

  const fetch = (
    current,
    flag,
    valueMenu,
    checkAddItem,
    checkDataAll,
    checkSiteId,
    string
  ) => {
    const pagesize = 20;
    let tfilter = {};
    tfilter = {
      menuName: string || searchValue,
      status: 1,
    };
    if (
      !(string || searchValue) ||
      ((string || searchValue) && !(string || searchValue).trim())
    ) {
      delete tfilter.menuName;
    }
    const params = {
      filter: JSON.stringify(tfilter),
      range: JSON.stringify([pagesize * (current - 1), current * pagesize]),
      sort: JSON.stringify(['orderBy', 'ASC']),
    };
    dispatch({
      type: 'menu/fetchLazyLoading',
      payload: params,
      select: current !== 1,
      callback: (result) => {
        if (result && result.success === true) {
          const data =
            result &&
            result.results &&
            result.results.list.map((data) => ({
              menuName: data.menuName,
              id: data.id,
              children: data.children,
            }));
          setTotalItems(
            result &&
              result.results.pagination &&
              result.results.pagination.total
          );
          const dataArr1 = flatten({
            children: dataStore,
          });
          const dataArr2 = flatten({
            children: data,
          });
          const merge = [..._.uniqBy([...dataArr1, ...dataArr2], 'id')];
          const tree = unflatten(merge);
          if (dataArr.length === 0 || flag) {
            if (checkAddItem) {
              if (string || searchValue) {
                setDataArr([..._.uniqBy([...dataArr, ...data], 'id')]);
                setDataStore(tree);
              } else {
                setDataArr([..._.uniqBy([...dataArr, ...data], 'id')]);
                setDataStore(tree);
                addItem(valueMenu);
              }
            } else {
              setDataArr([..._.uniqBy([...dataArr, ...data], 'id')]);
              setDataStore(tree);
              addItem(valueMenu);
            }
          } else if (checkDataAll) {
            setDataArr(tree);
            setDataStore(tree);
            setCheckState(true);
            setNumOfScroll(2);
          } else if (checkSiteId) {
            setDataArr(data);
            setDataStore(data);
            setNumOfScroll(2);
            setValueMenu('');
            setText('');
          } else {
            setDataArr([..._.uniqBy([...dataArr, ...data], 'id')]);
            setDataStore(tree);
            setCheckState(true);
          }
        }
      },
    });
  };
  const unflatten = (arr) => {
    const tree = [];
    const mappedArr = {};
    let arrElem;
    let mappedElem;

    // First map the nodes of the array to an object -> create a hash table.
    for (let i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.id] = arrElem;
      mappedArr[arrElem.id].children = [];
    }
    for (const id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.menuParentId) {
          mappedElem.menuParentId &&
            mappedArr[mappedElem.menuParentId] &&
            mappedArr[mappedElem.menuParentId].children &&
            mappedArr[mappedElem.menuParentId].children.push(mappedElem);
        }
        // If the element is at the root level, add it to first level elements array.
        else {
          tree.push(mappedElem);
        }
      }
    }
    return tree;
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
      fetch(numOfScroll, undefined, valueMenu, false, false, false, '');
    }
  };
  const onChangeFun = (valueMenu) => {
    if (valueMenu) {
      setValueMenu(valueMenu);
      setText(
        dataArr.find((x) => x.valueMenu === valueMenu) &&
          dataArr.find((x) => x.valueMenu === valueMenu).text
      );
    } else {
      setValueMenu(valueMenu);
      setText(
        dataArr.find((x) => x.valueMenu === valueMenu) &&
          dataArr.find((x) => x.valueMenu === valueMenu).text
      );
      fetch(1, undefined, valueMenu, false, true, false, '');
    }

    if (onChange) onChange(valueMenu);
  };
  const flatten = (treeObj, idAttr, parentAttr, childrenAttr, levelAttr) => {
    if (!idAttr) idAttr = 'id';
    if (!parentAttr) parentAttr = 'parent';
    if (!childrenAttr) childrenAttr = 'children';
    if (!levelAttr) levelAttr = 'level';

    const result = processChildren(treeObj);
    return result;
  };
  const onfocus = () => {
    setIcon(<i className="fa fa-search" />);
  };

  const onblur = () => {
    setIcon(null);
  };
  const AddDataParent = (dataArr1, dataTemp1, key) => {
    let arr = [...dataTemp1];
    dataArr1.map((item) => {
      if (item.id === key) {
        arr = [..._.uniqBy([...arr, item], 'id')];
        if (item.parent) {
          arr = AddDataParent(dataArr1, arr, item.parent);
        }
      }
    });
    return arr;
  };
  const search = (string) => {
    const dataArr1 = flatten({
      children: dataStore,
    });
    let dataTemp1 = [
      ...dataArr1.filter(
        (item) => fnKhongDau(item.menuName).indexOf(fnKhongDau(string)) !== -1
      ),
    ];
    let dataTemp2 = [];
    dataTemp1.map((item) => {
      if (item.parent) {
        dataTemp2 = [...dataTemp2, item];
      }
    });
    dataTemp2.map((item) => {
      dataArr1.map((item1) => {
        if (item1.id === item.parent) {
          dataTemp1 = [..._.uniqBy([...dataTemp1, item1], 'id')];
          if (item1.parent) {
            dataTemp1 = AddDataParent(dataArr1, dataTemp1, item1.parent);
          }
        }
      });
    });
    // const dataTemp = dataStore.filter(item => fnKhongDau(item.name).indexOf(fnKhongDau(string)) !== -1);
    if (string) {
      setDataArr(unflatten(dataTemp1));
      setSearchValue(string);
      setNumOfScroll(2);
    } else {
      setDataArr(dataStore);
      setSearchValue('');
      setNumOfScroll(2);
    }
    clearTimeout(timer);
    timer = setTimeout(
      fetch.bind(this, 1, true, valueMenu, true, false, false, string),
      500
    );
  };
  const handleMouseLeave = () => {
    if (searchValue && searchValue !== '' && allowClear) {
      setSearchValue('');
    }
  };
  const checkData = (data, key) => {
    let arr =
      (data && data.length > 0 && data.filter((item) => item.id !== key)) || [];
    arr =
      arr.map((item) => {
        if (item.children && item.children.length > 0) {
          const arr1 = {
            ...item,
            children: item.children.filter((chil) => chil.id !== key),
          };
          const arr2 = arr1.children.map((item1) => {
            if (item1.children && item1.children.length > 0) {
              if (item1.children[0].children) {
                const arr3 = checkData(item1.children, key);
                return { ...item1, children: arr3 };
              }
              return {
                ...item1,
                children: item1.children.filter((chil) => chil.id !== key),
              };
            }
            return item1;
          });
          return { ...item, children: arr2 };
        }
        return item;
      }) || [];
    return arr;
  };
  const processChildren = (obj, level) => {
    if (!level) level = 0;
    let array = [];
    obj.children &&
      obj.children.length > 0 &&
      obj.children.map((childObj) => {
        array = array.concat(flattenChild(childObj, obj.id, level + 1));
      });

    return array;
  };
  const flattenChild = (childObj, menuParentId, level) => {
    let array = [];

    const childCopy = Object.assign({}, childObj);
    childCopy.level = level;
    childCopy.parent = menuParentId;
    delete childCopy.children;
    array.push(childCopy);

    array = array.concat(processChildren(childObj, level));

    return array;
  };
  const renderTreeNodes = (data) =>
    data.map((item) => {
      if (item && item.children) {
        return (
          <TreeNode
            value={item.id}
            title={item.menuName && item.menuName.trim()}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          value={item.id}
          title={item.menuName && item.menuName.trim()}
        />
      );
    });
  let arr = dataArr || [];
  if (idCategory) {
    arr = checkData(dataArr, idCategory) || [];
  }
  const datas = renderTreeNodes(arr || []);
  return (
    <TreeSelect
      key={key}
      showSearch
      value={valueMenu === '' || valueMenu === '0' ? undefined : valueMenu}
      // notFoundContent={loading ? <Spin size="small" /> : null}
      treeDefaultExpandAll
      filterOption={false}
      onChange={onChangeFun}
      placeholder={placeholder}
      onSearch={search}
      loading={loading}
      allowClear={allowClear}
      size={size}
      onScroll={handleScroll}
      onDropdownVisibleChange={handleMouseLeave}
    >
      {datas}
    </TreeSelect>
  );
};

export default MenuTreeSelect;
