import React, { useState, useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import axios from 'axios';

const SellerAccounts = () => {
  const [sellerAccounts, setSellerAccounts] = useState([]);

  useEffect(() => {
    // Fetch seller accounts data from the server
    axios.get('http://127.0.0.1:8000/paymentsseller/')
      .then(response => {
        setSellerAccounts(response.data);
      })
      .catch(error => {
        console.error('Error fetching seller accounts:', error);
      });
  }, []);

  return (
    <Box maxWidth="1500px">
      <Table variant="simple" style = {{marginLeft: "20px"}}>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Agent</Th>
            <Th>Seller</Th>
            <Th>Amount Due</Th>
            <Th>Due Date</Th>
            <Th>Created At</Th>
            <Th>Modified At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sellerAccounts.map(account => (
            <Tr key={account.id}>
              <Td>{account.id}</Td>
              <Td>{account.agent}</Td>
              <Td>{account.seller}</Td>
              <Td>{account.amount_due}</Td>
              <Td>{account.due_date}</Td>
              <Td>{account.created_at}</Td>
              <Td>{account.modified_at}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default SellerAccounts;
