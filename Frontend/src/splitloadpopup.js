import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SplitLoadPopup = ({ onClose }) => {
  const [loadDetails, setLoadDetails] = useState([]);
  const [selectedLoadId, setSelectedLoadId] = useState('');
  const [goatDetails, setGoatDetails] = useState([]);
  const [newLoadId, setNewLoadId] = useState('');
  const [agentId, setAgentId] = useState('');
  const [agents, setAgents] = useState([]);
  const [selectedGoatIds, setSelectedGoatIds] = useState([]);

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

    // Fetch agents from the server
    axios
      .get('http://127.0.0.1:8000/agents/')
      .then(response => {
        setAgents(response.data);
      })
      .catch(error => {
        console.error('Error fetching agents:', error);
      });
  }, []);

  const handleLoadSelect = event => {
    const selectedLoadId = event.target.value;
    setSelectedLoadId(selectedLoadId);

    // Fetch goat details for the selected load from the server
    axios
      .get(`http://127.0.0.1:8000/goat-details/${selectedLoadId}`)
      .then(response => {
        setGoatDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching goat details:', error);
      });
  };

  const handleSplitLoad = () => {
    const data = JSON.stringify({
      load_id: selectedLoadId,
      goat_ids: selectedGoatIds, // Use selectedGoatIds instead of goatDetails.map(goat => goat.id)
      new_load_id: newLoadId,
      agent_id: agentId,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://127.0.0.1:8000/split-load/',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        console.log('Load split successfully:', response.data);
        // Handle any success message or redirect as needed
        onClose(); // Close the popup
        window.location.reload();
      })
      .catch(error => {
        console.error('Error splitting load:', error);
        // Handle the error and display an error message if needed
      });
      
  };

  return (
    <div>
      <label htmlFor="loadId">Select Load ID:</label>
      <select id="loadId" onChange={handleLoadSelect}>
        <option value="">Select Load ID</option>
        {loadDetails.map(load => (
          <option key={load.load_id} value={load.load_id}>
            Load ID: {load.load_id} | Total Goats: {load.total_goats}
          </option>
        ))}
      </select>
      <br></br>
      <label htmlFor="selectedGoats">Select Goat IDs:</label>
      <select
        multiple
        id="selectedGoats"
        value={selectedGoatIds}
        onChange={e => setSelectedGoatIds(Array.from(e.target.selectedOptions, option => option.value))}
      >
        {goatDetails.map(goat => (
          <option key={goat.id} value={goat.id}>
            Goat ID: {goat.id} | Sex: {goat.sex} | Weight: {goat.weight}
          </option>
        ))}
      </select>
      <br></br>
      <label htmlFor="newLoadId">New Load ID:</label>
      <input type="number" id="newLoadId" value={newLoadId} onChange={e => setNewLoadId(e.target.value)} />
      <br></br>
      <label htmlFor="agentId">Agent ID:</label>
      <select id="agentId" onChange={e => setAgentId(e.target.value)}>
        <option value="">Select Agent ID</option>
        {agents.map(agent => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>
      <br></br>
      <button onClick={handleSplitLoad}style={{ backgroundColor: '#4CAF50', color: '#ffffff', padding: '10px 20px', fontSize: '16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Split Load</button>
    </div>
  );
};

export default SplitLoadPopup;
