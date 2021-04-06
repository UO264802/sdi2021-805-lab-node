module.exports = function (app, swig, gestorBD) {
    app.post('/comentarios/:cancion_id', (req, res) => {
        let comentario = {
            autor: req.session.usuario,
            text: req.body.comentario,
            cancion_id: gestorBD.mongo.ObjectID(req.params.cancion_id)
        };

        gestorBD.añadirComentario(comentario, function (id) {
            if (id == null) {
                res.send("Error al insertar el comentario");
            } else {
                res.send("Agregado id: " + id);
            }
        });
    });

    app.get('/cancion/eliminar/:id', function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.eliminarCancion(criterio, function (canciones) {
            if (canciones == null) {
                res.send(respuesta);
            } else {
                res.redirect("/publicaciones");
            }
        });
    });

    app.get('/comentarios/borrar/:comentario_id', function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.comentario_id),
                        "autor": req.session.usuario};
        gestorBD.eliminarComentario(criterio, function (comentarios) {
            if (comentarios == null) {
                res.send("Error al borrar comentario");
            } else {
                res.send("Comentario borrado");
            }
        });
    })
};
