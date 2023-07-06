import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const BuyerSaleData = () => {
  const [buyerSales, setBuyerSales] = useState([]);

  useEffect(() => {
    // Fetch buyer sale data from the server
    axios
      .get('http://127.0.0.1:8000/paymentsbuyer/')
      .then(response => {
        setBuyerSales(response.data);
      })
      .catch(error => {
        console.error('Error fetching buyer sale data:', error);
      });
  }, []);


  return (
    <Box maxWidth="1500px" style = {{marginTop: "50px", marginLeft: "25px"}}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Agent</Th>
            <Th>Buyer</Th>
            <Th>Sale Price</Th>
            <Th>Amount Due</Th>
            <Th>Due Date</Th>
            <Th>Created At</Th>
            <Th>Modified At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {buyerSales.map(account => (
            <Tr key={account.id}>
              <Td>{account.id}</Td>
              <Td>{account.agent}</Td>
              <Td>{account.buyer}</Td>
              <Td>{account.sale_price}</Td>
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

//   return (
//     <div>
//       <h2>Buyer Sale Data</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Agent</th>
//             <th>Buyer</th>
//             <th>Sale Price</th>
//             <th>Amount Due</th>
//             <th>Due Date</th>
//             <th>Created At</th>
//             <th>Modified At</th>
//           </tr>
//         </thead>
//         <tbody>
//           {buyerSales.map(sale => (
//             <tr key={sale.id}>
//               <td>{sale.id}</td>
//               <td>{sale.agent}</td>
//               <td>{sale.buyer}</td>
//               <td>{sale.sale_price}</td>
//               <td>{sale.amount_due}</td>
//               <td>{sale.due_date}</td>
//               <td>{sale.created_at}</td>
//               <td>{sale.modified_at}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

export default BuyerSaleData;
