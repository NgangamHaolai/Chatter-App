import express from 'express';
import Login from '../controller/Login.js';
import Register from '../controller/Register.js';
// import RetrieveUserID from '../controller/RetrieveUserID.js';

const router = express.Router();

router.post('/login', Login);
router.post('/register', Register);
// router.post('/userID', RetrieveUserID);

export default router;