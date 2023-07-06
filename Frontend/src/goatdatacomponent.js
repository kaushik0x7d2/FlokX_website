import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LabelStudio } from './label-studio';

const GoatDataComponent = () => {
  const [goatData, setGoatData] = useState([]);

  useEffect(() => {
    // Fetch goat data from the server
    axios
      .get('http://127.0.0.1:8000/goats/')
      .then(response => {
        setGoatData(response.data);
      })
      .catch(error => {
        console.error('Error fetching goat data:', error);
      });
  }, []);

  useEffect(() => {
    // Initialize Label Studio
    if (goatData.length > 0) {
      const project = {
        task_data: goatData,
        projectMeta: {
          id: 'goat-project',
          name: 'Goat Data Project',
          description: 'Annotate goat data',
        },
        // Add other configuration options as needed
        interfaces: [
          {
            type: 'image',
            task_description: 'Annotate the goat data',
            image_url: '{$task_data.photo_url}',
            annotations: [],
          },
        ],
      };

      const labelStudio = new LabelStudio('label-studio', project);
    }
  }, [goatData]);

  return <div id="label-studio" />;
};

export default GoatDataComponent;
