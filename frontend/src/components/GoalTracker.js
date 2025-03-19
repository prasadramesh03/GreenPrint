// frontend/src/components/GoalTracker.js
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  LinearProgress, 
  Card, 
  CardContent, 
  IconButton,
  Checkbox,
  FormControlLabel,
  Divider
} from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';

const GoalTracker = ({ goals, onUpdateGoal, onDeleteGoal }) => {
  const [editMode, setEditMode] = useState(null);
  
  const handleProgressChange = (goalId, isComplete) => {
    onUpdateGoal(goalId, { isComplete });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const calculateDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  };
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Your Carbon Reduction Goals
      </Typography>
      
      {goals.length === 0 ? (
        <Typography variant="body1">
          You haven't set any goals yet. Add recommendations to your goals to start tracking!
        </Typography>
      ) : (
        goals.map((goal) => (
          <Card key={goal._id} style={{ marginBottom: 16 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={goal.isComplete || false}
                      onChange={(e) => handleProgressChange(goal._id, e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography 
                      variant="h6" 
                      style={{ 
                        textDecoration: goal.isComplete ? 'line-through' : 'none',
                        color: goal.isComplete ? 'gray' : 'inherit'
                      }}
                    >
                      {goal.title}
                    </Typography>
                  }
                />
                
                <Box>
                  <IconButton size="small" onClick={() => setEditMode(goal._id)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDeleteGoal(goal._id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              
              <Typography variant="body2" color="textSecondary">
                Category: {goal.category}
              </Typography>
              
              <Box mt={1} mb={1}>
                <Typography variant="body2">
                  Created: {formatDate(goal.createdAt)}
                  {goal.deadline && (
                    <span> | Deadline: {formatDate(goal.deadline)} ({calculateDaysLeft(goal.deadline)} days left)</span>
                  )}
                </Typography>
              </Box>
              
              <Divider style={{ margin: '8px 0' }} />
              
              <Typography variant="body2">
                {goal.description}
              </Typography>
              
              <Box mt={2}>
                <Typography variant="body2" gutterBottom>
                  Progress:
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={goal.isComplete ? 100 : 0} 
                  style={{ height: 10, borderRadius: 5 }}
                />
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default GoalTracker;