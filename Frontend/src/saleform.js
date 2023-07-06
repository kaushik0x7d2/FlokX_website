import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChakraProvider } from "@chakra-ui/react";
import BuyerSaleData from './buyeraccounts';

const SaleForm = () => {
  const [buyerId, setBuyerId] = useState('');
  const [agentId, setAgentId] = useState('');
  const [loadId, setLoadId] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [dueAmount, setDueAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [buyers, setBuyers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loadDetails, setLoadDetails] = useState([]);


  useEffect(() => {
    // Fetch load details from the server
    axios
      .get('http://127.0.0.1:8000/load-details/')
      .then(response => {
        setLoadDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching load details:', error);
      });

    // Fetch buyers from the /buyers/ endpoint
    fetch('http://127.0.0.1:8000/buyers/')
      .then((response) => response.json())
      .then((data) => setBuyers(data))
      .catch((error) => console.error('Error:', error));

    // Fetch agents from the /agents/ endpoint
    fetch('http://127.0.0.1:8000/agents/')
      .then((response) => response.json())
      .then((data) => setAgents(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the payload for the sale
    const payload = {
      buyer_id: buyerId,
      agent_id: agentId,
      load_id: loadId,
      sale_price: salePrice,
      due_amount: dueAmount,
      due_date: dueDate,
    };

    try {
      // Make the API call to the buygoatload endpoint
      const response = await fetch('http://127.0.0.1:8000/buygoatload/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Handle the response
      if (response.ok) {
        window.location.reload();
        // Reset form fields after successful sale
        setBuyerId('');
        setAgentId('');
        setLoadId('');
        setSalePrice('');
        setDueAmount('');
        setDueDate('');
      } else {
        alert('Failed to make the sale. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <ChakraProvider>
    <form onSubmit={handleSubmit} style = {{marginLeft : "40px", paddingTop:"50px", paddingBottom: "0px", borderRight: '1px solid green'}}>
      <div style ={{padding: "10px"}}>
        <label htmlFor="buyerId">Buyer ID:</label>
        <select id="buyerId" value={buyerId} onChange={(e) => setBuyerId(e.target.value)}>
          <option value="">Select buyer ID</option>
          {buyers.map((buyer) => (
            <option key={buyer.id} value={buyer.id}>
              {buyer.name}
            </option>
          ))}
        </select>
      </div>
      <div style ={{padding: "10px"}}>
        <label htmlFor="agentId">Agent ID:</label>
        <select id="agentId" value={agentId} onChange={(e) => setAgentId(e.target.value)}>
          <option value="">Select agent ID</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>
      <div style ={{padding: "10px"}}>
        <label htmlFor="loadId">Select Load:</label>
        <select id="loadId" value={loadId} onChange={(e) => setLoadId(e.target.value)}>
        <option value="">Select Load ID</option>
        {loadDetails.map(load => (
          <option key={load.load_id} value={load.load_id}>
            Load ID: {load.load_id} | Total Goats: {load.total_goats}
          </option>
        ))}
      </select>
      </div>
      <div style ={{padding: "10px"}}>
        <label htmlFor="salePrice">Sale Price:</label><br></br>
        <input type="number" id="salePrice" placeholder = "Enter Sale Price" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
      </div>
      <div style ={{padding: "10px"}}>
        <label htmlFor="dueAmount">Due Amount:</label><br></br>
        <input type="number" id="dueAmount" placeholder = "Enter Due Amount" value={dueAmount} onChange={(e) => setDueAmount(e.target.value)} />
      </div>
      <div style ={{padding: "10px"}}>
        <label htmlFor="dueDate">Due Date:</label><br></br>
        <input
          type="date"
         value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          placeholder="Due Date"
        />
      </div>
      <button type="submit" style={{marginLeft: "20px", backgroundColor: '#4CAF50', color: '#ffffff', padding: '10px 10px', fontSize: '15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >Make Sale</button>
    </form>
    <div style = {{maxWidth: "100%"}}>
    <BuyerSaleData />
  </div>
  </ChakraProvider>
  );
};

export default SaleForm;