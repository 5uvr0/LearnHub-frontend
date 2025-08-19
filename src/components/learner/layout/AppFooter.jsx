// src/components/layout/AppFooter.jsx

import React from 'react';
import { Container } from 'react-bootstrap';
import texts from '../../../i18n/texts.js';

const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container className="text-center">
        <p className="mb-0">&copy; {currentYear} {texts.footer.copyright}</p>
      </Container>
    </footer>
  );
};

export default AppFooter;