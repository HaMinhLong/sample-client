import React from 'react';
import { Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import HeaderContent from '../../layouts/HeaderContent';

const List = ({ headerPage }) => {
  return (
    <>
      {headerPage}
      <HeaderContent title="Dashboard">
        <Row gutter={[15, 15]}>
          <Col xs={24} md={12} lg={12} xl={8}>
            <Card
              bodyStyle={{
                textAlign: 'left',
                padding: '12px 24px',
              }}
              style={{
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0px 5px',
                background: '#FF5370',
                color: 'white',
                width: '100%',
              }}
              title={
                <span style={{ color: 'white' }}>Thông tin hồ sơ ứng viên</span>
              }
              extra={
                <Link style={{ color: 'white' }} to="/">
                  Chi tiết
                </Link>
              }
              bordered={false}
            >
              <p>Tên ứng viên: Nguyễn Văn A</p>
              <p>Vị trí ứng tuyển: Marketing Manger</p>
              <p>Email: nguyenvana@gmail.com</p>
              <p>Số điện thoại: 0987654321</p>
            </Card>
          </Col>
        </Row>
      </HeaderContent>
    </>
  );
};

export default List;
