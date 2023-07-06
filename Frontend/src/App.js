import React from 'react';
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './sidebar';
import Home from './home';
import SaleForm from './saleform';

// import GoatDataComponent from './goatdatacomponent';
import SellerAccounts from './selleraccounts';

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/selleraccounts" element={<SellerAccounts />} />
            {/* <Route path="/goatdatacomponent" element={<GoatDataComponent/>} /> */}
            <Route path="/buyersales" element={<SaleForm />} />
          </Routes>
        </div>
      </Router>
    </ChakraProvider>
  );
};

export default App;