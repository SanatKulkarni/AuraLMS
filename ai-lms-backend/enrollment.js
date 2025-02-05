const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('./db');

// Class Enrollment endpoint
router.post('/enroll', async (req, res) => {
  console.log('Enrollment request received');
  const { studentId, courseId } = req.body;
  console.log(`studentId: ${studentId}, courseId: ${courseId}`);
  const db = await readDB();
  console.log('DB read successfully in enroll endpoint');

  // Check if student and course exist
  const student = db.users.find(u => u.id === studentId && u.role === 'student');
  console.log(`Student found: ${!!student}`);
  const course = db.courses.find(c => c.id === courseId);
  console.log(`Course found: ${!!course}`);

  if (!student || !course) {
    console.log('Invalid studentId or courseId');
    return res.status(400).json({ error: 'Invalid studentId or courseId' });
  }

  // Check if already enrolled
  const alreadyEnrolled = db.classEnrollments.find(e => e.studentId === studentId && e.courseId === courseId);
  console.log(`Already enrolled: ${!!alreadyEnrolled}`);
  if (alreadyEnrolled) {
    console.log('Student already enrolled in this course');
    return res.status(400).json({ error: 'Student already enrolled in this course' });
  }

  const newEnrollment = { studentId, courseId };
  db.classEnrollments.push(newEnrollment);
  console.log('New enrollment added');
  await writeDB(db);
  console.log('DB written successfully in enroll endpoint');

  res.json({ message: 'Enrollment successful' });
  console.log('Enrollment successful response sent');
});

// Get courses for a student
router.get('/courses/:studentId', async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const db = await readDB();

  const enrollments = db.classEnrollments.filter(e => e.studentId === studentId);
  const courseIds = enrollments.map(e => e.courseId);
  const courses = db.courses.filter(c => courseIds.includes(c.id));

  res.json(courses);
});

// Add a student to a course
router.post('/:courseId/students', async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const { studentId } = req.body;

  const db = await readDB();

  // Check if student and course exist
  const student = db.users.find(u => u.id === studentId && u.role === 'student');
  const course = db.courses.find(c => c.id === courseId);

  if (!student || !course) {
    return res.status(400).json({ error: 'Invalid studentId or courseId' });
  }

  // Check if already enrolled
  const alreadyEnrolled = db.classEnrollments.find(e => e.studentId === studentId && e.courseId === courseId);
  if (alreadyEnrolled) {
    return res.status(400).json({ error: 'Student already enrolled in this course' });
  }

  const newEnrollment = { studentId, courseId };
  db.classEnrollments.push(newEnrollment);
  await writeDB(db);

  res.json({ message: 'Student added to course successfully' });
});

// Remove a student from a course
router.delete('/:courseId/students/:studentId', async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const studentId = parseInt(req.params.studentId);

  const db = await readDB();

  // Find the enrollment to remove
  const enrollmentIndex = db.classEnrollments.findIndex(e => e.studentId === studentId && e.courseId === courseId);

  if (enrollmentIndex === -1) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }

  db.classEnrollments.splice(enrollmentIndex, 1);
  await writeDB(db);

  res.json({ message: 'Student removed from course successfully' });
});

// Get study materials for a course
router.get('/:courseId/materials', async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const db = await readDB();

  const studyMaterials = db.studyMaterials.filter(m => m.courseId === courseId);

  res.json(studyMaterials);
});

// Add a new study material to a course
router.post('/:courseId/materials', async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const { title, description, url } = req.body;

  const db = await readDB();

  const newStudyMaterial = {
    id: db.studyMaterials.length + 1, // Simple ID generation (not ideal for production)
    courseId: courseId,
    title: title,
    description: description,
    url: url
  };

  db.studyMaterials.push(newStudyMaterial);
  await writeDB(db);

  res.json({ message: 'Study material added successfully', newStudyMaterial: newStudyMaterial });
});

// Update an existing study material
router.put('/:courseId/materials/:materialId', async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const materialId = parseInt(req.params.materialId);
  const { title, description, url } = req.body;

  const db = await readDB();

  const materialIndex = db.studyMaterials.findIndex(
    (m) => m.id === materialId && m.courseId === courseId
  );

  if (materialIndex === -1) {
    return res.status(404).json({ error: 'Study material not found' });
  }

  const updatedStudyMaterial = {
    id: materialId,
    courseId: courseId,
    title: title !== undefined ? title : db.studyMaterials[materialIndex].title,
    description: description !== undefined ? description : db.studyMaterials[materialIndex].description,
    url: url !== undefined ? url : db.studyMaterials[materialIndex].url,
  };

  db.studyMaterials[materialIndex] = updatedStudyMaterial;

  await writeDB(db);

  res.json({ message: 'Study material updated successfully' });
});

// Delete a study material
router.delete('/:courseId/materials/:materialId', async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const materialId = parseInt(req.params.materialId);

  const db = await readDB();

  const materialIndex = db.studyMaterials.findIndex(
    (m) => m.id === materialId && m.courseId === courseId
  );

  if (materialIndex === -1) {
    return res.status(404).json({ error: 'Study material not found' });
  }

  db.studyMaterials.splice(materialIndex, 1);
  await writeDB(db);

  res.json({ message: 'Study material deleted successfully' });
});

// Get calendar entries for a course
router.get('/:courseId/calendar', async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const db = await readDB();

  const calendarEntries = db.calendarEntries.filter(entry => entry.courseId === courseId);

  res.json(calendarEntries);
});

// Add a new calendar entry to a course
router.post('/:courseId/calendar', async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const { title, description, startTime, endTime } = req.body;

  const db = await readDB();

  const newCalendarEntry = {
    id: db.calendarEntries.length + 1, // Simple ID generation (not ideal for production)
    courseId: courseId,
    title: title,
    description: description,
    startTime: startTime,
    endTime: endTime
  };

  db.calendarEntries.push(newCalendarEntry);
  await writeDB(db);

  res.json({ message: 'Calendar entry added successfully', newCalendarEntry: newCalendarEntry });
});

// Update an existing calendar entry
router.put('/:courseId/calendar/:entryId', async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const entryId = parseInt(req.params.entryId);
  const { title, description, startTime, endTime } = req.body;

  const db = await readDB();

  const entryIndex = db.calendarEntries.findIndex(entry => entry.id === entryId && entry.courseId === courseId);

  if (entryIndex === -1) {
    return res.status(404).json({ error: 'Calendar entry not found' });
  }

  const updatedCalendarEntry = {
    id: entryId,
    courseId: courseId,
    title: title !== undefined ? title : db.calendarEntries[entryIndex].title,
    description: description !== undefined ? description : db.calendarEntries[entryIndex].description,
    startTime: startTime !== undefined ? startTime : db.calendarEntries[entryIndex].startTime,
    endTime: endTime !== undefined ? endTime : db.calendarEntries[entryIndex].endTime
  };

  db.calendarEntries[entryIndex] = updatedCalendarEntry;
  await writeDB(db);

  res.json({ message: 'Calendar entry updated successfully' });
});

// Delete a calendar entry
router.delete('/:courseId/calendar/:entryId', async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const entryId = parseInt(req.params.entryId);

  const db = await readDB();

  const entryIndex = db.calendarEntries.findIndex(entry => entry.id === entryId && entry.courseId === courseId);

  if (entryIndex === -1) {
    return res.status(404).json({ error: 'Calendar entry not found' });
  }

  db.calendarEntries.splice(entryIndex, 1);
  await writeDB(db);

  res.json({ message: 'Calendar entry deleted successfully' });
});

module.exports = router;