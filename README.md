//controllers
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
//SERVER

const express = require('express');
const path = require ('path');
const hbs = require('hbs');
const fs = require('fs');
const deporteRouter = require('../routes/deportes');

const app = express();


class Server{
    constructor(){
        this._app = express();
        this._port = 3000;
        this.middleware();
        this.routes();
    }

    middleware(){
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: true}));
        this._app.set('view engine', 'hbs');
        this._app.set('views', path.join(__dirname, '../views'));
        /* this._app.use(express.static(path.join(__dirname, '../public'))); */
    }

    routes(){
        this._app.get('/', (req, res) => {
            res.render('index.hbs');
        })

        
        this._app.use('/deportes', deporteRouter);
    }


    listen() {
        try {
        this._app.listen(this._port, () => {
            console.log(`Escuchando en el puerto ${this._port}`);
        });
        } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        }
    }
    }
    
    module.exports = Server;

//ROUTES
const express = require('express');
const { findAllController, findByIdController, insertController, updateController, deleteByIdController } = require('../controllers/deportes');

const router = express.Router();

router.get('/', findAllController);

router.get('/:id', findByIdController);

router.post('/',insertController);

router.put('/:id', updateController);

router.delete('/:id', deleteByIdController);

module.exports = router;

    //VIEWS CAMBIAR
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Deportes</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-4">
        <h1 class="text-center mb-4">Club de Deportes Discipline SPA</h1>
        
        <!-- Formulario de Agregar -->
        <div class="card mb-4">
            <div class="card-body">
                <h5 class="card-title">Agregar Nuevo Deporte</h5>
                <form id="agregarForm" class="needs-validation" novalidate>
                    <div class="form-group">
                        <label for="nombre">Nombre</label>
                        <input type="text" class="form-control" id="nombre" required>
                    </div>
                    <div class="form-group">
                        <label for="precio">Precio</label>
                        <input type="number" class="form-control" id="precio" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Agregar Deporte</button>
                </form>
            </div>
        </div>

        <!-- Tabla de Deportes -->
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Deportes Registrados</h5>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="deportesTableBody">
                            {{#each deportes}}
                            <tr>
                                <td>{{this.id}}</td>
                                <td>{{this.nombre}}</td>
                                <td>${{this.precio}}</td>
                                <td>
                                    <button class="btn btn-sm btn-warning" onclick="editarDeporte('{{this.id}}', '{{this.nombre}}', {{this.precio}})">
                                        Editar
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="eliminarDeporte('{{this.id}}')">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                            {{/each}}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de Edición -->
    <div class="modal fade" id="editModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Deporte</h5>
                    <button type="button" class="close" data-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="editId">
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" id="editNombre" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Precio</label>
                        <input type="number" id="editPrecio" class="form-control" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="guardarCambios()">Guardar Cambios</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

    <script>
        // Agregar deporte
        document.getElementById('agregarForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const precio = document.getElementById('precio').value;
            
            try {
                const response = await axios.post('/deportes', { nombre, precio });
                alert(response.data.mensaje);
                window.location.reload();
            } catch (error) {
                alert('Error al agregar el deporte');
            }
        });

        // Editar deporte
        function editarDeporte(id, nombre, precio) {
            document.getElementById('editId').value = id;
            document.getElementById('editNombre').value = nombre;
            document.getElementById('editPrecio').value = precio;
            $('#editModal').modal('show');
        }

        async function guardarCambios() {
            const id = document.getElementById('editId').value;
            const nombre = document.getElementById('editNombre').value;
            const precio = document.getElementById('editPrecio').value;
            
            try {
                const response = await axios.put(`/deportes/${id}`, { nombre, precio });
                alert(response.data.mensaje);
                window.location.reload();
            } catch (error) {
                alert('Error al actualizar el deporte');
            }
        }

        // Eliminar deporte
        async function eliminarDeporte(id) {
            if (confirm('¿Está seguro de que desea eliminar este deporte?')) {
                try {
                    const response = await axios.delete(`/deportes/${id}`);
                    alert(response.data.mensaje);
                    window.location.reload();
                } catch (error) {
                    alert('Error al eliminar el deporte');
                }
            }
        }
    </script>
</body>
</html>