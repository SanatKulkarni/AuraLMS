require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const authRoutes = require('./auth');
const geminiRoutes = require('./gemini');
const assignmentRoutes = require('./assignments');
const quizRoutes = require('./quizzes');
const performanceRoutes = require('./performance');
const learningPathRoutes = require('./learningpath');
const messageRoutes = require('./messages');
const classManagementRoutes = require('./enrollment'); // now contains class management and schedule
const userManagementRoutes = require('./usermanagement');
const mapTeacherRoutes = require('./mapteacher');
const unmapTeacherRoutes = require('./unmapteacher');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/', classManagementRoutes); // enrollment now contains class management and schedule
app.use('/ai', geminiRoutes);
app.use('/assignments', assignmentRoutes);
app.use('/quizzes', quizRoutes);
app.use('/performance', performanceRoutes);
app.use('/learningpath', learningPathRoutes);
app.use('/messages', messageRoutes);
app.use('/users', userManagementRoutes);
app.use('/teachers', mapTeacherRoutes);
app.use('/teachers', unmapTeacherRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
