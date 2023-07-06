import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Grid } from '@chakra-ui/react';
import axios from 'axios';

function LoadList() {
  const [loadDetails, setLoadDetails] = useState([]);

  useEffect(() => {
    fetchLoadDetails();
  }, []);

  const fetchLoadDetails = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/load-details/');
      setLoadDetails(response.data);
    } catch (error) {
      console.error('Error fetching load details:', error);
    }
  };

  return (
    <Box>
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        {loadDetails.length ? (
          loadDetails.map((load) => (
            <Box key={load.ref_num} p={4} border="1px solid" borderColor="gray.200">
              <Heading as="h2" size="md" mb={2}>
                Load {load.load_id}
              </Heading>
              <Text>Total Number of Goats: {load.total_goats}</Text>
              <Text>Created At: {load.created_at}</Text>
              <Text>Number of Males: {load.male_goats}</Text>
              <Text>Number of Females: {load.female_goats}</Text>
              <Text>Agent: {load.agent_name} (id: {load.agent_id})</Text>
              <Text>Load Price: {load.total_price}</Text>
            </Box>
          ))
        ) : (
          <Text>Loading load details...</Text>
        )}
      </Grid>
    </Box>
  );
}

export default LoadList;
