// frontend/src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Box,
  Avatar,
  Divider,
  CircularProgress,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Person, Save } from '@material-ui/icons';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    location: '',
    preferredUnits: 'metric',
    notifications: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  useEffect(() => {
    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage({ text: 'Failed to load profile', type: 'error' });
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({
      ...profile,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/users/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ text: 'Profile updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };
  
  const handleCloseMessage = () => {
    setMessage({ text: '', type: '' });
  };
  
  if (loading) {
    return (
      <Container maxWidth="md" style={{ marginTop: 32, marginBottom: 32 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" style={{ marginTop: 32, marginBottom: 32 }}>
      <Paper elevation={3} style={{ padding: 24 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar style={{ backgroundColor: '#3f51b5', marginRight: 16 }}>
            <Person />
          </Avatar>
          <Typography variant="h4">Your Profile</Typography>
        </Box>
        
        <Divider style={{ marginBottom: 24 }} />
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                variant="outlined"
                disabled
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={profile.location}
                onChange={handleChange}
                variant="outlined"
                helperText="Used for location-specific recommendations"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="units-label">Preferred Units</InputLabel>
                <Select
                  labelId="units-label"
                  name="preferredUnits"
                  value={profile.preferredUnits}
                  onChange={handleChange}
                  label="Preferred Units"
                >
                  <MenuItem value="metric">Metric (kg CO2, km)</MenuItem>
                  <MenuItem value="imperial">Imperial (lbs CO2, miles)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<Save />}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar 
        open={!!message.text} 
        autoHideDuration={6000} 
        onClose={handleCloseMessage}
      >
        <Alert onClose={handleCloseMessage} severity={message.type}>
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;