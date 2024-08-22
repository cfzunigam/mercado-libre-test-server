const express = require('express');
const searchItemsMiddleware = require('./middlewares/searchItemsMiddleware');
const itemDetailMiddleware = require('./middlewares/itemDetailMiddleware');

const router = express.Router();

router.get('/api/items', searchItemsMiddleware);
router.get('/api/items/:id', itemDetailMiddleware);

module.exports = router;