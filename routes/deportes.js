const express = require('express');
const { findAllController, findByIdController, insertController, updateController, deleteByIdController } = require('../controllers/deportes');

const router = express.Router();

router.get('/', findAllController);

router.get('/:id', findByIdController);

router.post('/',insertController);

router.put('/:id', updateController);

router.delete('/:id', deleteByIdController);

module.exports = router;