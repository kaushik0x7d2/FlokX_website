// theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e3f9ec',
      100: '#c0efcf',
      200: '#9be4b0',
      300: '#71da90',
      400: '#4dc372',
      500: '#38b75c', // Dark green
      600: '#2c964b',
      700: '#21773a',
      800: '#165828',
      900: '#0b3917',
    },
  },
});

export default theme;
