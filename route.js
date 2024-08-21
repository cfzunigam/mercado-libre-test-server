const express = require('express');
const searchItemsMiddleware = require('./middlewares/searchItemsMiddleware');
const itemDetailMiddleware = require('./middlewares/itemDetailMiddleware');

const router = express.Router();

// Definir las rutas y asignar los middlewares correspondientes
router.get('/api/items', searchItemsMiddleware);
router.get('/api/items/:id', itemDetailMiddleware);

module.exports = router;