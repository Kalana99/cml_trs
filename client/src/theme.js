import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#000000', // Primary color (black)
        },
        secondary: {
            main: '#FFFFFF', // Secondary color (white)
        },
        background: {
            default: '#F5F5F5', // Light gray for background
            paper: '#FFFFFF', // White background for paper elements
        },
        text: {
            primary: '#000000', // Primary text color (black)
            secondary: '#666666', // Secondary text color (dark gray)
        },
        divider: '#E0E0E0', // Light gray for dividers
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
            color: '#000000', // Black for h1 text
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
            color: '#000000', // Black for h2 text
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 400,
            color: '#333333', // Dark gray for body1 text
        },
        body2: {
            fontSize: '0.875rem',
            fontWeight: 400,
            color: '#4F4F4F', // Lighter gray for body2 text
        },
        button: {
            textTransform: 'none',
            color: '#FFFFFF', // White text for buttons
        },
    },
});

export default theme;
