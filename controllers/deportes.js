const { findAll, findById, insert, update, deleteById } = require('../service/deportes');

const findAllController = async (req, res) => {
    try {
        const result = await findAll();
        res.render('index', { deportes: result.deportes });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
};

const findByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await findById(id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const insertController = async (req, res) => {
    try {
        const { nombre, precio } = req.body;
        const result = await insert(nombre, precio);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateController = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio } = req.body;
        const result = await update(id, nombre, precio);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const deleteByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteById(id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = {
    findAllController,
    findByIdController,
    insertController,
    updateController,
    deleteByIdController
};