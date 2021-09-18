import React, { PureComponent } from 'react';
import { Table } from 'antd';
import './index.scss';

export default class TableAntd extends PureComponent {
  render() {
    const {
      loading,
      rowKey,
      components,
      dataSource,
      columns,
      onChange,
      condensed,
      bordered,
      pagination,
      style,
      scroll,
      size,
      emptyText,
      defaultExpandAllRows,
      ...rest
    } = this.props;
    if (!pagination) {
      return (
        <Table
          defaultExpandAllRows={defaultExpandAllRows}
          loading={loading}
          rowKey={rowKey}
          dataSource={dataSource}
          columns={columns}
          components={components}
          rowClassName={(record, index) =>
            index % 2 === 0 ? '' : 'styleRowle'
          }
          size="small"
          onChange={onChange}
          className="TableAntd"
          style={style}
          scroll={scroll}
          locale={{ emptyText: emptyText || 'Không có dữ liệu' }}
          condensed={condensed}
          bordered={bordered !== 'none'}
          {...rest}
        />
      );
    }
    if (pagination === 'none') {
      return (
        <Table
          loading={loading}
          rowKey={rowKey}
          dataSource={dataSource}
          columns={columns}
          components={components}
          size="small"
          onChange={onChange}
          className="TableAntd"
          rowClassName={(record, index) =>
            index % 2 === 0 ? '' : 'styleRowle'
          }
          style={style}
          scroll={scroll}
          locale={{ emptyText: emptyText || 'Không có dữ liệu' }}
          condensed={condensed}
          bordered={bordered !== 'none'}
          pagination={false}
          {...rest}
        />
      );
    }
    return (
      <Table
        loading={loading}
        rowKey={rowKey}
        dataSource={dataSource}
        columns={columns}
        components={components}
        size="small"
        pagination={pagination}
        onChange={onChange}
        className="TableAntd"
        rowClassName={(record, index) => (index % 2 === 0 ? '' : 'styleRowle')}
        style={style}
        scroll={scroll}
        locale={{ emptyText: emptyText || 'Không có dữ liệu' }}
        condensed={condensed}
        bordered={bordered !== 'none'}
        {...rest}
      />
    );
  }
}
