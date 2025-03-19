// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // green
    },
    secondary: {
      main: '#00796b', // teal
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/calculator" component={Calculator} />
              <Route path="/recommendations" component={Recommendations} />
              <Route path="/profile" component={Profile} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;