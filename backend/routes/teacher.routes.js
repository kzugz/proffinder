import express from 'express';
const router = express.Router();

// Test Route
router.get('/', (req, res) => {
  res.send('Teachers route working!');
});

export default router;