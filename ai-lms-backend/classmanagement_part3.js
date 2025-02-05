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

module.exports = router;