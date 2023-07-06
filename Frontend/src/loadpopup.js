import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoadPopup = ({ refreshLoadList, onClose }) => {
  const [agentId, setAgentId] = useState('');
  const [loadId, setLoadId] = useState('');
  const [numGoats, setNumGoats] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [amountDue, setAmountDue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [goats, setGoats] = useState([]);
  const [agents, setAgents] = useState([]);
  const [sellers, setSellers] = useState([]);

  const handleGoatDetailChange = (index, field, value) => {
    const updatedGoats = [...goats];
    updatedGoats[index] = {
      ...updatedGoats[index],
      [field]: value,
    };
    setGoats(updatedGoats);
  };

  const handleSubmit = () => {
    const payload = {
      seller_id: sellerId,
      due_date: dueDate,
      amount_due: amountDue,
      load_id: loadId,
      agent_id: agentId,
      total_price: totalPrice,
      goats: goats,
    };

    axios
      .post('http://127.0.0.1:8000/Createlandg/', payload)
      .then((response) => {
        console.log(response.data);
        refreshLoadList(); // Invoke the refresh callback function
        onClose(); // Close the popup
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
      
  };

  const handleNumGoatsChange = (event) => {
    const count = parseInt(event.target.value);
    setNumGoats(count);

    // Initialize goats array with default values
    const initialGoats = Array(count).fill({
      sex: '',
      weight: '',
      photo_url: '',
    });
    setGoats(initialGoats);
  };

  useEffect(() => {
    // Fetch agents from the server
    axios
      .get('http://127.0.0.1:8000/agents/')
      .then((response) => {
        setAgents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching agents:', error);
      });

    // Fetch sellers from the server
    axios
      .get('http://127.0.0.1:8000/sellers/')
      .then((response) => {
        setSellers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching sellers:', error);
      });
  }, []);

  return (
    <div className="popup-container">
      <div className="popup-content">
        <select id="agentId" onChange={(e) => setAgentId(e.target.value)}>
          <option value="">Select Agent ID</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
        <br />
        <select id="sellerId" onChange={(e) => setSellerId(e.target.value)}>
          <option value="">Select Seller ID</option>
          {sellers.map((seller) => (
            <option key={seller.id} value={seller.id}>
              {seller.name}
            </option>
          ))}
        </select>
        <br />
        <input
          type="date"
         value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          placeholder="Due Date"
        />
        <br />
        <input
          type="number"
          value={amountDue}
          onChange={(event) => setAmountDue(parseFloat(event.target.value))}
          placeholder="Amount Due"
        />
        <br></br>
        <input
          type="text"
          value={loadId}
          onChange={(event) => setLoadId(event.target.value)}
          placeholder="Load ID"
        />
        <br></br>
        <input
          type="number"
          value={numGoats}
          onChange={handleNumGoatsChange}
          placeholder="Number of Goats"
        />
        <br></br>
        <input
          type="number"
          value={totalPrice}
          onChange={(event) => setTotalPrice(parseInt(event.target.value))}
          placeholder="Total Price"
        />
        <br></br>
        {Array.from({ length: numGoats }).map((_, index) => (
          <div key={index}>
            <select
              value={goats[index]?.sex || ''}
              onChange={(event) => handleGoatDetailChange(index, 'sex', event.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <input
              type="number"
              value={goats[index]?.weight || ''}
              onChange={(event) =>
                handleGoatDetailChange(index, 'weight', parseInt(event.target.value))
              }
              placeholder="Weight"
            />

            <input
              type="text"
              value={goats[index]?.photo_url || ''}
              onChange={(event) => handleGoatDetailChange(index, 'photo_url', event.target.value)}
              placeholder="Photo URL"
            />
          </div>
        ))}

        <button onClick={handleSubmit} style={{ backgroundColor: '#4CAF50', color: '#ffffff', padding: '10px 20px', fontSize: '16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Submit</button>
      </div>
    </div>
  );
};

export default LoadPopup;
