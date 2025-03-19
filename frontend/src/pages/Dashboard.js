// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  paperTitle: {
    marginBottom: theme.spacing(2),
  },
  chartContainer: {
    height: 300,
    position: 'relative',
  },
  circularProgressContainer: {
    position: 'relative',
    display: 'inline-flex',
    marginTop: theme.spacing(2),
  },
  circularProgressLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [footprintData, setFootprintData] = useState(null);

  useEffect(() => {
    // In a real app, fetch data from your API
    // This is mock data for demonstration
    const mockData = {
      currentFootprint: 8500,
      targetFootprint: 5000,
      nationalAverage: 10000,
      historyData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Your Carbon Footprint (kg CO2e)',
            data: [9200, 9000, 8800, 8700, 8600, 8500],
            borderColor: '#2e7d32',
            backgroundColor: 'rgba(46, 125, 50, 0.1)',
          },
        ],
      },
      breakdown: {
        labels: ['Transportation', 'Home Energy', 'Food', 'Shopping', 'Other'],
        datasets: [
          {
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
              '#4caf50',
              '#8bc34a',
              '#cddc39',
              '#ffeb3b',
              '#ff9800',
            ],
          },
        ],
      },
      recommendations: [
        'Switch to LED bulbs to save 5% on electricity',
        'Consider carpooling twice a week to reduce emissions by 8%',
        'Reducing meat consumption by 20% can lower food emissions by 15%',
      ],
    };

    // Simulate API fetch
    setTimeout(() => {
      setFootprintData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Container className={classes.container}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const progressPercentage = (footprintData.currentFootprint - footprintData.targetFootprint) / 
                            (footprintData.nationalAverage - footprintData.targetFootprint) * 100;
  const normalizedProgress = 100 - Math.min(Math.max(progressPercentage, 0), 100);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        {/* Welcome and overview */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h4" gutterBottom>
              Welcome to Your GreenPrint Dashboard
            </Typography>
            <Typography variant="body1">
              Track your carbon footprint, set reduction goals, and get personalized recommendations to help reduce your environmental impact.
            </Typography>
          </Paper>
        </Grid>

        {/* Current vs target footprint */}
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.paperTitle}>
              Current Carbon Footprint
            </Typography>
            <Box display="flex" justifyContent="space-around" alignItems="center">
              <div className={classes.circularProgressContainer}>
                <CircularProgress
                  variant="determinate"
                  value={normalizedProgress}
                  size={140}
                  thickness={5}
                  color="primary"
                />
                <div className={classes.circularProgressLabel}>
                  <Typography variant="h5" component="div" color="textSecondary">
                    {Math.round(normalizedProgress)}%
                  </Typography>
                </div>
              </div>
              <Box>
                <Typography variant="body1" paragraph>
                  Current: {footprintData.currentFootprint.toLocaleString()} kg CO2e/year
                </Typography>
                <Typography variant="body1" paragraph>
                  Target: {footprintData.targetFootprint.toLocaleString()} kg CO2e/year
                </Typography>
                <Typography variant="body1">
                  National Avg: {footprintData.nationalAverage.toLocaleString()} kg CO2e/year
                </Typography>
              </Box>
            </Box>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/calculator"
              >
                Recalculate
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.paperTitle}>
              Footprint Breakdown
            </Typography>
            <div className={classes.chartContainer}>
              <Doughnut data={footprintData.breakdown} options={doughnutOptions} />
            </div>
          </Paper>
        </Grid>

        {/* Historical tracking */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.paperTitle}>
              Historical Tracking
            </Typography>
            <div className={classes.chartContainer}>
              <Line data={footprintData.historyData} options={chartOptions} />
            </div>
          </Paper>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.paperTitle}>
              Personalized Recommendations
            </Typography>
            {footprintData.recommendations.map((recommendation, index) => (
              <Typography key={index} variant="body1" paragraph>
                • {recommendation}
              </Typography>
            ))}
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/recommendations"
            >
              View All Recommendations
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;