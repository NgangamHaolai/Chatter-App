import express from 'express';
import { RetrieveMessages, StoreMessages } from '../controller/Messages.js';
import Contacts from '../controller/Contacts.js';

const router = express.Router();

// router.post('/chat/storeMessages', StoreMessages);
router.get('/chat/retrieveMessages', RetrieveMessages);
router.get('/chat/retrieveContacts', Contacts);

export default router;