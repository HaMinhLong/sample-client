import React from 'react';
import { Layout } from 'antd';
import HeaderPage from './HeaderPage';
import AppRoutes from '../routes/AppRoutes';
const { Content } = Layout;

const LayoutPage = ({ localLanguage, setLocalLanguage }) => {
  const headerPage = (
    <HeaderPage
      localLanguage={localLanguage}
      setLocalLanguage={setLocalLanguage}
    />
  );
  return (
    <>
      <Layout className="layout">
        <Content>
          <AppRoutes headerPage={headerPage} />
        </Content>
      </Layout>
    </>
  );
};

export default LayoutPage;
