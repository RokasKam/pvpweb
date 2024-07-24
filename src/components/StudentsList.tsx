import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

interface Student {
  id: string;
  username: string;
}

interface StudentsListProps {
  students: Student[];
  removeStudent: (studentId: string) => void;
}

const StudentsList: React.FC<StudentsListProps> = ({ students, removeStudent }) => {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {students.map((student, index) => (
        <React.Fragment key={student.id}>
          <ListItem
            alignItems="flex-start"
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => removeStudent(student.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar
                alt={student.username}
                src={`/static/images/avatar/${index + 1}.jpg`} // Placeholder for student avatar
              />
            </ListItemAvatar>
            <ListItemText primary={student.username} />
          </ListItem>
          {index < students.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default StudentsList;
