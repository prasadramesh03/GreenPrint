// frontend/src/pages/Calculator.js
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  stepContent: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  resultPaper: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

const Calculator = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    transportation: {
      carType: 'gasoline',
      carMileage: 0,
      publicTransport: 0,
      flights: 0,
    },
    home: {
      electricityUsage: 0,
      gasUsage: 0,
      peopleInHousehold: 1,
    },
    food: {
      dietType: 'mixed',
      foodWaste: 'medium',
    },
  });
  const [results, setResults] = useState(null);

  const steps = ['Transportation', 'Home Energy', 'Food & Consumption'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      calculateFootprint();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleChange = (section, field) => (event) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: event.target.value,
      },
    });
  };

  const calculateFootprint = async () => {
    try {
      // In a real app, this would call your backend API
      // const response = await axios.post('/api/calculate', formData);
      // setResults(response.data);
      
      // For demo, we'll simulate a response
      const carbonTotal = 
        (formData.transportation.carMileage * (formData.transportation.carType === 'gasoline' ? 0.35 : 0.2)) +
        (formData.transportation.publicTransport * 0.15) +
        (formData.transportation.flights * 1200) +
        (formData.home.electricityUsage * 0.4) +
        (formData.home.gasUsage * 0.5) / formData.home.peopleInHousehold +
        (formData.food.dietType === 'meat' ? 2000 : formData.food.dietType === 'mixed' ? 1500 : 1000);
      
      setResults({
        totalEmissions: carbonTotal,
        breakdown: {
          transportation: (formData.transportation.carMileage * (formData.transportation.carType === 'gasoline' ? 0.35 : 0.2)) + 
                          (formData.transportation.publicTransport * 0.15) + 
                          (formData.transportation.flights * 1200),
          home: (formData.home.electricityUsage * 0.4) + (formData.home.gasUsage * 0.5) / formData.home.peopleInHousehold,
          food: formData.food.dietType === 'meat' ? 2000 : formData.food.dietType === 'mixed' ? 1500 : 1000,
        },
        recommendations: [
          "Consider carpooling or using public transport more frequently",
          "Switch to energy-efficient appliances to reduce electricity consumption",
          "Reduce food waste by planning meals more efficiently",
        ],
      });
      
      setActiveStep(activeStep + 1);
    } catch (error) {
      console.error('Error calculating footprint:', error);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3} className={classes.stepContent}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Car Type"
                fullWidth
                value={formData.transportation.carType}
                onChange={handleChange('transportation', 'carType')}
              >
                <MenuItem value="gasoline">Gasoline</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
                <MenuItem value="electric">Electric</MenuItem>
                <MenuItem value="none">No Car</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Weekly Car Mileage"
                fullWidth
                value={formData.transportation.carMileage}
                onChange={handleChange('transportation', 'carMileage')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Weekly Public Transport Miles"
                fullWidth
                value={formData.transportation.publicTransport}
                onChange={handleChange('transportation', 'publicTransport')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Flights per Year"
                fullWidth
                value={formData.transportation.flights}
                onChange={handleChange('transportation', 'flights')}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3} className={classes.stepContent}>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Monthly Electricity Usage (kWh)"
                fullWidth
                value={formData.home.electricityUsage}
                onChange={handleChange('home', 'electricityUsage')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Monthly Gas Usage (therms)"
                fullWidth
                value={formData.home.gasUsage}
                onChange={handleChange('home', 'gasUsage')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="People in Household"
                fullWidth
                value={formData.home.peopleInHousehold}
                onChange={handleChange('home', 'peopleInHousehold')}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3} className={classes.stepContent}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Diet Type"
                fullWidth
                value={formData.food.dietType}
                onChange={handleChange('food', 'dietType')}
              >
                <MenuItem value="meat">Meat Heavy</MenuItem>
                <MenuItem value="mixed">Mixed Diet</MenuItem>
                <MenuItem value="vegetarian">Vegetarian</MenuItem>
                <MenuItem value="vegan">Vegan</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Food Waste Level"
                fullWidth
                value={formData.food.foodWaste}
                onChange={handleChange('food', 'foodWaste')}
              >
                <MenuItem value="high">High (throw away a lot)</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low (very little waste)</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );
      case 3:
        return results && (
          <div className={classes.stepContent}>
            <Paper className={classes.resultPaper} elevation={3}>
              <Typography variant="h4" gutterBottom>
                Your Carbon Footprint
              </Typography>
              <Typography variant="h2" gutterBottom>
                {results.totalEmissions.toFixed(2)} kg CO2e/year
              </Typography>
              <Typography variant="subtitle1">
                This is how your carbon footprint breaks down:
              </Typography>
              <Grid container spacing={2} style={{ marginTop: '16px' }}>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    Transportation: {results.breakdown.transportation.toFixed(2)} kg
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    Home Energy: {results.breakdown.home.toFixed(2)} kg
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    Food & Consumption: {results.breakdown.food.toFixed(2)} kg
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="h6" style={{ marginTop: '24px' }}>
                Recommendations:
              </Typography>
              <ul>
                {results.recommendations.map((rec, index) => (
                  <li key={index}>
                    <Typography variant="body1">{rec}</Typography>
                  </li>
                ))}
              </ul>
              <Button 
                variant="contained" 
                color="primary" 
                style={{ marginTop: '16px' }}
              >
                Save Results
              </Button>
            </Paper>
          </div>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Carbon Footprint Calculator
        </Typography>
        <Typography variant="subtitle1" align="center" paragraph>
          Answer the questions below to calculate your carbon footprint
        </Typography>

        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {getStepContent(activeStep)}
        
        <div className={classes.buttons}>
          {activeStep !== 0 && activeStep !== steps.length && (
            <Button onClick={handleBack} className={classes.button}>
              Back
            </Button>
          )}
          {activeStep === steps.length ? (
            <Button 
              variant="contained" 
              color="primary" 
              className={classes.button}
              onClick={() => setActiveStep(0)}
            >
              Calculate Again
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              className={classes.button}
            >
              {activeStep === steps.length - 1 ? 'Calculate' : 'Next'}
            </Button>
          )}
        </div>
      </Paper>
    </Container>
  );
};

export default Calculator;