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