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
};
