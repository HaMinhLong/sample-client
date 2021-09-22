import React, { useState } from 'react';
import { Checkbox } from 'antd';

const CheckBox = (props) => {
  const { onChange, cell, row, name, disabled } = props;
  const [value, setValue] = useState(props.value);
  const onCheckedChange = (e) => {
    setValue(e.target.checked);
    if (onChange) {
      onChange(e, name, cell, row);
    }
  };
  return (
    <React.Fragment>
      <Checkbox
        checked={value}
        disabled={disabled}
        onChange={onCheckedChange}
      />
    </React.Fragment>
  );
};

export default CheckBox;
