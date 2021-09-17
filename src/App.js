import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from 'antd';
import HeaderPage from './layouts/HeaderPage';
import AppRoutes from './routes/AppRoutes';
import { IntlProvider } from 'react-intl';

import Vietnamese from './lang/vi';
import English from './lang/en';
const { Content } = Layout;

const App = () => {
  const [localLanguage, setLocalLanguage] = useState(
    localStorage.getItem('lang')
  );
  let lang;
  if (localLanguage === 'en-US') {
    lang = English;
  } else {
    lang = Vietnamese;
  }

  return (
    <IntlProvider locale={localLanguage} messages={lang}>
      <Router>
        <Layout className="layout">
          <HeaderPage
            localLanguage={localLanguage}
            setLocalLanguage={setLocalLanguage}
          />
          <Content>
            <AppRoutes />
          </Content>
        </Layout>
      </Router>
    </IntlProvider>
  );
};

export default App;
