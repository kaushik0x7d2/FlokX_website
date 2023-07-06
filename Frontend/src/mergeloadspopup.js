import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MergeLoadPopup = () => {
  const [loadDetails, setLoadDetails] = useState([]);
  const [selectedLoads, setSelectedLoads] = useState([]);
  const [newLoadId, setNewLoadId] = useState('');
  const [agentId, setAgentId] = useState('');
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    // Fetch load details from the server
    axios.get('http://127.0.0.1:8000/load-details/')
      .then(response => {
        setLoadDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching load details:', error);
      });

    // Fetch agents from the server
    axios.get('http://127.0.0.1:8000/agents/')
      .then(response => {
        setAgents(response.data);
      })
      .catch(error => {
        console.error('Error fetching agents:', error);
      });
  }, []);

  const handleLoadSelect = event => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedLoads(selectedOptions);
  };

  const handleMergeLoads = () => {
    const data = JSON.stringify({
      new_load_id: newLoadId,
      agent_id: agentId,
      load_ids: selectedLoads
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://127.0.0.1:8000/merge-loads/',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then(response => {
        console.log('Loads merged successfully:', response.data);
        // Handle any success message or redirect as needed
        window.location.reload();
      })
      .catch(error => {
        console.error('Error merging loads:', error);
        // Handle the error and display an error message if needed
      });
      
  };

  return (
    <div>
      <label htmlFor="newLoadId">New Load ID:</label>
      <input
        type="number"
        id="newLoadId"
        value={newLoadId}
        onChange={e => setNewLoadId(e.target.value)}
      />
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
      <label htmlFor="selectedLoads">Loads to Merge:</label>
      <select multiple id="selectedLoads" onChange={handleLoadSelect}>
        {loadDetails.map(load => (
          <option key={load.load_id} value={load.load_id}>
            Load ID: {load.load_id} | Total Goats: {load.total_goats}
          </option>
        ))}
      </select>
      <br></br>
      <button onClick={handleMergeLoads}style={{ backgroundColor: '#4CAF50', color: '#ffffff', padding: '10px 20px', fontSize: '16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Merge Loads</button>
    </div>
  );
};

export default MergeLoadPopup;
