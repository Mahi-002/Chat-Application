const express = require('express')
const messageController = require('../controllers/message')
const { authenticate } = require('../controllers/middleware/auth');

const router = express.Router();