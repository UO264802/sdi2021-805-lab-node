module.exports = function (app, gestorBD) {

    app.get("/api/cancion", function (req, res) {
        gestorBD.obtenerCanciones({}, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones));
            }
        });
    });

    app.get("/api/cancion/:id", function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones[0]));
            }
        });
    });

    app.delete("/api/cancion/:id", function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}
        gestorBD.obtenerCanciones({"_id": gestorBD.mongo.ObjectID(req.params.id), autor: res.usuario},
            function (cancion) {

                if (cancion == null || !cancion.length) {
                    res.status(403);
                    res.json({error: "Debes ser el autor para borrar la canción"})
                } else {

                    gestorBD.eliminarCancion(criterio, function (canciones) {
                        if (canciones == null) {
                            res.status(500);
                            res.json({
                                error: "se ha producido un error"
                            })
                        } else {
                            res.status(200);
                            res.send(JSON.stringify(canciones));
                        }
                    });
                }
            }
        );
    });



            const validarCancion = song => {
                let out = []
                if (!song.nombre || !song.genero || !song.precio)
                    out.push("Faltan parámetros");

                const nombre = validarNombre(song.nombre);
                if (nombre) out.push(nombre);

                const genero = validarGenero(song.genero);
                if (genero) out.push(genero);

                const precio = validarPrecio(song.precio);
                if (precio) out.push(precio);

                return out;
            };

            const validarNombre = nombre => {
                const nLength = nombre.length;
                if (!nLength || nLength > 32)
                    return "El nombre debe tener entre 1 y 32 caracteres";
            };

            const validarGenero = genero => {
                const gLength = genero.length;
                if (!gLength || gLength > 12)
                    return "El género debe tener entre 1 y 12 caracteres";
            };

            const validarPrecio = precio => {
                if (Number.isNaN(precio))
                    return "Precio inválido";

                const price = parseFloat(precio);
                if (price < 0)
                    return "Precio debe ser positivo";
            };

    app.post("/api/cancion", function (req, res) {
        let cancion = {
            nombre: req.body.nombre,
            genero: req.body.genero,
            precio: req.body.precio,
        }
        // Validar nombre, genero, precio
        const validationRes = validarCancion(cancion);

        if (validationRes.length) {
            res.status(400);
            res.json({error: validationRes})
            return;
        }

        gestorBD.insertarCancion(cancion, function (id) {
            if (id == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(201);
                res.json({
                    mensaje: "canción insertada",
                    _id: id
                })
            }
        });

    });

    app.put("/api/cancion/:id", function (req, res) {
        gestorBD.obtenerCanciones({"_id": gestorBD.mongo.ObjectID(req.params.id), autor: res.usuario},
            function (cancion) {
                if (cancion == null) {
                    res.status(403);
                    res.json({error: "Solo puede ser editada por el autor"})
                } else {

                    let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};

                    let cancion = {};
                    let validationRes = [];

                    if (req.body.nombre != null) {
                        cancion.nombre = req.body.nombre;
                        const nombre = validarNombre(cancion.nombre);
                        if (nombre) validationRes.push(nombre);
                    }
                    if (req.body.genero != null) {
                        cancion.genero = req.body.genero;
                        const genero = validarGenero(cancion.genero);
                        if (genero) validationRes.push(genero);
                    }
                    if (req.body.precio != null) {
                        cancion.precio = req.body.precio;
                        const precio = validarPrecio(cancion.precio);
                        if (precio) validationRes.push(precio);
                    }

                    if (validationRes.length) {
                        res.status(400);
                        res.json({error: validationRes})
                        return;
                    }

                    gestorBD.modificarCancion(criterio, cancion, function (result) {
                        if (result == null) {
                            res.status(500);
                            res.json({
                                error: "se ha producido un error"
                            })
                        } else {
                            res.status(200);
                            res.json({
                                mensaje: "canción modificada",
                                _id: req.params.id
                            })
                        }
                    });
                }
            });
    });

    app.post("/api/autenticar/", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email: req.body.email,
            password: seguro
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401); //Unauthorized
                res.json({
                    autenticado: false
                })
            } else {
                let token = app.get('jwt').sign(
                    {usuario: criterio.email, tiempo: Date.now() / 1000},
                    "secreto");

                res.status(200);
                res.json({
                    autenticado: true,
                    token: token
                })
            }
        });

    });


}