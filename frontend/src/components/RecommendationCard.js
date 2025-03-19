// frontend/src/components/RecommendationCard.js
import React from 'react';
import { Card, CardContent, Typography, Chip, Button, Box } from '@material-ui/core';
import { Star, Eco } from '@material-ui/icons';

const RecommendationCard = ({ recommendation, onSave }) => {
  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'gray';
    }
  };

  const getImpactStars = (impact) => {
    const impactValue = parseInt(impact) || 1;
    return Array(impactValue).fill().map((_, i) => (
      <Star key={i} style={{ color: '#FFD700' }} />
    ));
  };

  return (
    <Card className="recommendation-card">
      <CardContent>
        <Typography variant="h6" component="h2">
          {recommendation.title}
        </Typography>
        
        <Box mt={1} mb={2}>
          <Chip 
            icon={<Eco />} 
            label={recommendation.category} 
            color="primary" 
            size="small" 
            style={{ marginRight: 8 }} 
          />
          <Chip 
            label={`Difficulty: ${recommendation.difficulty}`} 
            style={{ 
              backgroundColor: getDifficultyColor(recommendation.difficulty),
              color: 'white',
              marginRight: 8
            }} 
            size="small" 
          />
        </Box>
        
        <Typography variant="body2" color="textSecondary" component="p">
          {recommendation.description}
        </Typography>
        
        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" component="span">
              Impact: 
            </Typography>
            {getImpactStars(recommendation.potentialImpact)}
          </Box>
          
          <Button 
            variant="contained" 
            color="primary" 
            size="small"
            onClick={() => onSave(recommendation)}
          >
            Add to Goals
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;