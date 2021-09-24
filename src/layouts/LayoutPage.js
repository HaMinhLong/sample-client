import React from 'react';
import { Layout } from 'antd';
import HeaderPage from './HeaderPage';
import AppRoutes from '../routes/AppRoutes';
const { Content } = Layout;

const LayoutPage = ({ localLanguage, setLocalLanguage }) => {
  return (
    <>
      <Layout className="layout">
        <HeaderPage
          localLanguage={localLanguage}
          setLocalLanguage={setLocalLanguage}
        />
        <Content>
          <AppRoutes />
        </Content>
      </Layout>
    </>
  );
};

export default LayoutPage;
