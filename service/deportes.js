const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const filePath = path.join(__dirname, '../data/deportes.json');

// Función auxiliar para leer el archivo
const readFile = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(filePath, JSON.stringify([]));
            return [];
        }
        throw error;
    }
};

// Función auxiliar para escribir en el archivo
const writeFile = async (data) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

const findAll = async () => {
    try {
        const deportes = await readFile();
        return {
            mensaje: deportes.length > 0 ? 'Deportes encontrados' : 'No hay deportes',
            deportes
        };
    } catch (error) {
        throw new Error(`Error al obtener deportes: ${error.message}`);
    }
};

const findById = async (id) => {
    try {
        const deportes = await readFile();
        const deporte = deportes.find(d => d.id === id);
        
        if (!deporte) {
            throw new Error(`Deporte con id ${id} no existe`);
        }
        
        return {
            mensaje: 'Deporte encontrado',
            deporte
        };
    } catch (error) {
        throw error;
    }
};

const insert = async (nombre, precio) => {
    try {
        if (!nombre || !precio) {
            throw new Error('Nombre y precio son requeridos');
        }

        const deportes = await readFile();
        const nuevoDeporte = {
            id: uuidv4(),
            nombre,
            precio: Number(precio)
        };
        
        deportes.push(nuevoDeporte);
        await writeFile(deportes);
        
        return {
            mensaje: 'Deporte insertado con éxito',
            deporte: nuevoDeporte
        };
    } catch (error) {
        throw error;
    }
};

const update = async (id, nombre, precio) => {
    try {
        const deportes = await readFile();
        const index = deportes.findIndex(d => d.id === id);
        
        if (index === -1) {
            throw new Error(`Deporte con id ${id} no existe`);
        }
        
        deportes[index] = {
            ...deportes[index],
            nombre: nombre || deportes[index].nombre,
            precio: precio ? Number(precio) : deportes[index].precio
        };
        
        await writeFile(deportes);
        
        return {
            mensaje: 'Deporte actualizado con éxito',
            deporte: deportes[index]
        };
    } catch (error) {
        throw error;
    }
};

const deleteById = async (id) => {
    try {
        const deportes = await readFile();
        const index = deportes.findIndex(d => d.id === id);
        
        if (index === -1) {
            throw new Error(`Deporte con id ${id} no existe`);
        }
        
        const deportesActualizados = deportes.filter(d => d.id !== id);
        await writeFile(deportesActualizados);
        
        return {
            mensaje: `Deporte eliminado correctamente`,
            deportes: deportesActualizados
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findAll,
    findById,
    insert,
    update,
    deleteById
};