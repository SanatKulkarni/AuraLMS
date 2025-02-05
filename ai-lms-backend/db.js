const fs = require('fs').promises;

const dbFilePath = 'db.json';

// Helper function to read the database
async function readDB() {
  try {
    const data = await fs.readFile(dbFilePath, 'utf8');
    console.log('DB read successfully');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB:', error);
    return { users: [], courses: [], assignments: [], classEnrollments: [] };
  }
}

// Helper function to write to the database
async function writeDB(data) {
  try {
    await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('DB write successfully');
  } catch (error) {
    console.error('Error writing to DB:', error);
  }
}

module.exports = { readDB, writeDB };