module.exports = function (app, swig) {
    app.get('/autores/agregar', function (req, res) {
        const r = swig.renderFile('views/autores-agregar.html', {});
        res.send(r);
    });

    app.post('/autor', (req, res) => {
        if (!req.body.nombre)
            res.send('Nombre no enviado en la petición.');

        if (!req.body.grupo)
            res.send('Grupo no enviado en la petición.');

        if (!req.body.rol)
            res.send('Rol no enviado en la petición.');

        res.send('Nombre: ' + req.body.nombre + '<br>Grupo' + ':' +
            req.body.grupo + '<br>Rol' + ': ' + req.body.rol);
    });

    app.get("/autores/*", function (req, res) {
        res.redirect('/autores');
    });

    app.get("/autores", function (req, res) {
        const autores = [{
            'nombre': 'Nombre1',
            'grupo': 'Grupo1',
            'rol': 'cantante'
        }, {
            'nombre': 'Nombre2',
            'grupo': 'Hrupo2',
            'rol': 'bajista'
        }, {
            'nombre': 'Nombre3',
            'grupo': 'Grupo3',
            'rol': 'teclista'
        }];

        const respuesta = swig.renderFile('views/autores.html', {autores});

        res.send(respuesta);
    });
};