const express = require('express')

const router = express.Router();

const { registerUser, authuser, allUsers } = require('../controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware'); // authMiddleware

router.route('/').post(registerUser).get(protect, allUsers)
router.post('/login', authuser);

module.exports = router;