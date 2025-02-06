"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  Chip,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse
} from '@mui/material';
import { styled } from '@mui/system';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { keyframes } from '@emotion/react';

const coursesEndpoint = '/api/courses'; // Define the coursesEndpoint variable
const contentEndpoint = '/api/content'; // Define the contentEndpoint variable
const outlineEndpoint = '/api/outline'; // Define the outlineEndpoint variable
const notesEndpoint = '/api/notes'; // Define the notesEndpoint variable
const flashcardsEndpoint = '/api/flashcards'; // Define the flashcardsEndpoint variable
const quizzesEndpoint = '/api/quizzes'; // Define the quizzesEndpoint variable

// Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh',
  animation: `${fadeIn} 0.5s ease-out`
}));

const CourseCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  borderRadius: '16px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
  }
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  margin: `${theme.spacing(3)}px 0`,
  fontWeight: 700,
  color: theme.palette.primary.main,
  fontSize: '1.5rem',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: '50px',
    height: '3px',
    backgroundColor: theme.palette.secondary.main
  }
}));

const InteractiveList = styled(List)(({ theme }) => ({
  '& .MuiListItem-root': {
    transition: 'all 0.3s ease',
    borderRadius: '8px',
    margin: '4px 0',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      transform: 'scale(1.02)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    }
  }
}));

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseContent, setCourseContent] = useState([]);
  const [outline, setOutline] = useState([]);
  const [notes, setNotes] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({
    content: true,
    outline: false,
    notes: false,
    flashcards: false,
    quizzes: false
  });

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(coursesEndpoint);
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const fetchCourseDetails = async (courseId) => {
    try {
      setLoading(true);
      const [contentRes, outlineRes, notesRes, flashcardsRes, quizzesRes] = await Promise.all([
        axios.get(`${contentEndpoint}?courseId=${courseId}`),
        axios.get(`${outlineEndpoint}?courseId=${courseId}`),
        axios.get(`${notesEndpoint}?courseId=${courseId}`),
        axios.get(`${flashcardsEndpoint}?courseId=${courseId}`),
        axios.get(`${quizzesEndpoint}?courseId=${courseId}`),
        axios.get(`${coursesEndpoint}?courseId=${courseId}`)
      ]);

      setCourseContent(contentRes.data);
      setOutline(outlineRes.data);
      setNotes(notesRes.data);
      setFlashcards(flashcardsRes.data);
      setQuizzes(quizzesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    fetchCourseDetails(course.id);
  };

  const TabPanel = ({ children, value, index }) => {
    return (
      <div hidden={value !== index}>
        {value === index && <Box p={3}>{children}</Box>}
      </div>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 700, 
        color: 'primary.main',
        textAlign: 'center',
        mb: 4,
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        🎓 Course Management Portal
      </Typography>

      <Box display="flex" gap={4} sx={{ position: 'relative' }}>
        {/* Course List */}
        <Card sx={{ 
          width: 300, 
          height: 'fit-content',
          position: 'sticky',
          top: 20,
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <CardHeader 
            title="Available Courses" 
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px'
            }} 
          />
          <InteractiveList>
            {courses.map((course) => (
              <ListItem
                button
                key={course.id}
                onClick={() => handleCourseSelect(course)}
                selected={selectedCourse?.id === course.id}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText'
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={600}>
                      {course.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Chip
                        label={course.category}
                        size="small"
                        sx={{ mr: 1, mt: 1, bgcolor: 'secondary.light' }}
                      />
                      <Chip
                        label={course.studyType}
                        size="small"
                        sx={{ bgcolor: 'success.light' }}
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </InteractiveList>
        </Card>

        {/* Course Details */}
        {selectedCourse && (
          <CourseCard>
            <CardHeader
              title={selectedCourse.title}
              subheader={
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip 
                    label={`Instructor: ${selectedCourse.instructorId}`} 
                    color="primary" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={`$${selectedCourse.price}`} 
                    color="success" 
                    variant="filled" 
                  />
                </Box>
              }
              sx={{
                bgcolor: 'background.paper',
                borderBottom: '2px solid',
                borderColor: 'divider'
              }}
            />
            <CardContent>
              <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
                {selectedCourse.description}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Accordion 
                  expanded={expanded.content} 
                  onChange={() => toggleSection('content')}
                  sx={{ mb: 2 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <SectionHeader variant="h6">Course Content</SectionHeader>
                  </AccordionSummary>
                  <AccordionDetails>
                    {courseContent.map((chapter) => (
                      <Collapse key={chapter.id} in={expanded.content}>
                        <Box mb={3} sx={{ pl: 2 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            📹 {chapter.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Chip 
                              label={`${chapter.duration} mins`} 
                              size="small" 
                              color="info" 
                            />
                            <Button 
                              variant="outlined" 
                              size="small"
                              onClick={() => window.open(chapter.videoURL, '_blank')}
                            >
                              Watch Video
                            </Button>
                          </Box>
                          <Divider sx={{ my: 2 }} />
                        </Box>
                      </Collapse>
                    ))}
                  </AccordionDetails>
                </Accordion>

                {/* Repeat similar Accordion structure for other sections */}
                <Accordion expanded={expanded.outline} onChange={() => toggleSection('outline')}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <SectionHeader variant="h6">Course Outline</SectionHeader>
                  </AccordionSummary>
                  <AccordionDetails>
                    {outline.map((item) => (
                      <Box key={item.id} mb={2} sx={{ pl: 2 }}>
                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                          📌 {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                          {item.content}
                        </Typography>
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>

                {/* Add similar accordions for Notes, Flashcards, Quizzes */}
              </Box>
            </CardContent>
          </CourseCard>
        )}
      </Box>
    </StyledContainer>
  );
}
