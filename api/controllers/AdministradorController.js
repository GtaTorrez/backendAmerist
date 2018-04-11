/**
 * AdministradorController
 *
 * @description :: Server-side logic for managing Administradors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('async');

var csvjson = require('csvjson');
var fs = require('fs');
var path = require('path')
var tutor = {};

var codigoFoto = "";

var rest = require('restler');

var qr = require('qr-image');

function metodo1(callback) {
    rest.postJson('http://localhost:1337/api/persona', tutor).on('complete', function (data, response) {
        sails.log("CREANDO:", data)
        callback(null, data);
    });
}

function metodo2(callback) {
    Persona.findOne({ identificacion: codigoFoto }).exec(function (err, datoALumno) {

        sails.log("personaEncontrada:", datoALumno)
        callback(null, datoALumno);

    })
}

function metodo3() {

}

module.exports = {

    adicionarPersonas: function (res, res) {

        var csvFilePath = '../.././assets/cvs/kinder-prekinder_amerinst_tarde.csv'

        var nuevasPersonas = [];
        var data = fs.readFileSync(path.join(__dirname, csvFilePath), { encoding: 'utf8' });
        var options = {
            delimiter: ';', // optional
            quote: '"' // optional
        };

        nuevasPersonas = csvjson.toObject(data, options);
        nuevasPersonas.forEach(function (persona) {

            // if (persona.cedula.length > 0) {
            //     persona.identificacion = persona.cedula
            // } else {
            //     persona.identificacion = persona.codigoFoto
            //     persona.cedula = 0;
            // }

            if (persona.codigoFoto.length > 0) {

                if (persona.tpaterno.length == 0) {
                    persona.tnombre = "x";
                    persona.tpaterno = "x";
                }

                codigoFoto = persona.codigoFoto

                tutor = {
                    nombre: persona.tnombre,
                    paterno: persona.tpaterno,
                    materno: persona.tmaterno + " " + persona.tmaterno2,
                    rol: "tutor"
                }

                // persona.identificacion = persona.paterno.charAt(0) + persona.materno.charAt(0) + persona.nombre.charAt(0) + persona.codigoFoto

                // persona.identificacion = persona
                // persona.rol = 'alumno'
                // if (persona.rol == 'profesor') {
                //     persona.rol = 'profesor'
                // }

                // else {
                //     persona.rol = 'administrativo'
                // }

                async.series([
                    metodo1,
                    metodo2
                ], function (err, resultado) {
                    rest.postJson('http://localhost:1337/alumno/adicionar_tutor', { idTutor: resultado[0].id, idAlumno: resultado[1].id }).on('complete', function (data2, response2) {
                        // handle response
                        console.log('tutor adicionado', data2)

                    });
                });

                // rest.postJson('http://localhost:1337/api/persona', tutor).on('complete', function (data, response) {
                //     // handle response
                //     console.log('Persona Creada', data)
                //     // rest.postJson('http://localhost:1337/inscribe/inscribir', { id: data.id, idCurso: persona.idCurso, idGestionAcademica: 1 }).on('complete', function (data2, response2) {
                //     //     // handle response
                //     //     console.log('inscrito Creada', data2)

                //     // });

                //     Persona.findOne({ identificacion: persona.codigoFoto }).exec(function (err, datoALumno) {

                //         sails.log("personaEncontrada:", datoALumno)
                //         rest.postJson('http://localhost:1337/alumno/adicionar_tutor', { idTutor: data.id, idAlumno: datoALumno.id }).on('complete', function (data2, response2) {
                //             // handle response
                //             console.log('tutor adicionado', data2)

                //         });

                //     })

                // });
            }

        }, this);

        res.send('NADA')
    },
    generarCodigosQr: function (req, res) {

        // Persona.find().exec((err, personas) => {

        //     var contador = 1 ; 

        //     personas.forEach(function (persona) {
        //         var codigoQr = persona.identificacion+'$2018@'+' Unidad Educativa TCNL.RAFAEL PABON FAB' 
        //         var code = qr.image(codigoQr, { type: 'svg' });
        //         var output = fs.createWriteStream(path.join(__dirname,'../.././assets/codigos/'+contador+'.svg'))
        //         code.pipe(output);
        //     }, this);
        //     res.send('NADA 2')
        // }); 

        // var csvFilePath = '../.././assets/cvs/prekinder_amerinst.csv'
        var csvFilePath = '../.././assets/cvs/kinder-prekinder_amerinst_mañana.csv'
        var nuevasPersonas = [];
        var data = fs.readFileSync(path.join(__dirname, csvFilePath), { encoding: 'utf8' });
        var options = {
            delimiter: ';', // optional
            quote: '"' // optional
        };

        nuevasPersonas = csvjson.toObject(data, options);

        var contador = 1;
        nuevasPersonas.forEach(function (persona) {

            if (persona.codigoFoto.length > 0) {
                var tutor = {
                    nombre: persona.tnombre,
                    paterno: persona.tpaterno,
                    materno: persona.tmaterno + " " + persona.tmaterno2
                }

                console.log("Alumno", persona)
                // persona.identificacion = persona.codigoFoto ==> prekinder amerinst turno tarde
                // persona.identificacion = persona.paterno.charAt(0) + persona.materno.charAt(0) + persona.nombre.charAt(0) + persona.codigoFoto
                tutor.identificacion = tutor.paterno.charAt(0) + tutor.materno.charAt(0) + tutor.nombre.charAt(0)

                // var codigoQr = persona.identificacion + '$2018@' + ' Unidad Educativa TCNL.RAFAEL PABON FAB'
                var codigoQr = persona.identificacion + '$2018$' + 'Instituto Americano'
                var code = qr.image(codigoQr, { type: 'png' });
                var output = fs.createWriteStream(path.join(__dirname, '../.././assets/codigos/' + persona.nro + '.jpg'))
                console.log("contador : ", persona.nro)
                contador++;
                code.pipe(output);
            } else {
                // persona.identificacion = persona.codigoFoto

            }

            // // var codigoQr = persona.identificacion + '$2018@' + ' Unidad Educativa TCNL.RAFAEL PABON FAB'
            // var codigoQr = persona.identificacion + '$2018$' + 'Instituto Americano'
            // var code = qr.image(codigoQr, { type: 'svg' });
            // var output = fs.createWriteStream(path.join(__dirname, '../.././assets/codigos/' + persona.nro + '.svg'))
            // console.log("contador : " + contador)
            // contador++;
            // code.pipe(output);

        }, this);

        res.send('nada')

    },
    cargarFotosAmerinst: function (req, res) {
        req.file('avatar').upload({
            // ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/avatars'),
            maxBytes: 1025000000
        }, function whenDone(err, uploadedFiles) {

            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }

            var csvFilePath = '../.././assets/cvs/kinder-prekinder_amerinst_mañana.csv'

            var nuevasPersonas = [];
            var data = fs.readFileSync(path.join(__dirname, csvFilePath), { encoding: 'utf8' });
            var options = {
                delimiter: ';', // optional
                quote: '"' // optional
            };

            nuevasPersonas = csvjson.toObject(data, options);

            var contador = 1;
            nuevasPersonas.forEach(function (persona) {

                // if (persona.cedula.length > 0) {
                //     persona.identificacion = persona.cedula
                // } else {
                //     persona.identificacion = persona.codigoFoto
                // }

                persona.identificacion = persona.paterno.charAt(0) + persona.materno.charAt(0) + persona.nombre.charAt(0) + persona.codigoFoto
                var direccionBase = "http://localhost:1337"
                // var direccionBase = "http://192.241.152.146:1337"

                uploadedFiles.forEach(function (file, i) {

                    var nombreFoto = parseInt(file.filename.substring(4, 8)) + "";
                    sails.log('NOMBRE FOTO: ', nombreFoto)
                    sails.log('codigo FOTO: ', persona.codigoFoto)
                    if (nombreFoto == persona.codigoFoto) {
                        sails.log('++++++++++++++++++++++++++++++++++')
                        sails.log('IGUALES')

                        sails.log('Persona - Identificacion', "*" + persona.identificacion + "*")
                        var nombreFoto = (uploadedFiles[i].fd).split("\\");
                        sails.log("fotos:", nombreFoto);
                        var url ="avatars//" + nombreFoto[nombreFoto.length-1]
                        Persona.findOne({ identificacion: persona.identificacion }).exec(function (err, datoPersona) {
                            if (err) { console.log(err); return res.negotiate(err) };

                            console.log('ID PERSONA : ', datoPersona)

                            // setTimeout(function () {

                                Persona.update({ id: datoPersona.id }, { img: url }).exec(function (err, per) {

                                    if (err) { console.log(err); return res.negotiate(err) };

                                    console.log('Se adicio Foto a : ',per.identificacion)
                                });

                            // }, 200)

                        });

                    }

                }, this);

            }, this);

            //  var direccionBase = "http://localhost:1337"
            // var direccionBase = "http://192.241.152.146:1337"
            // var url = direccionBase + "/avatars//" + (uploadedFiles[0].fd).substring(47);
            // Persona.update({ id: idPersona }, {
            //     img: url,
            // }).exec(function (err,datoPersona) {

            //     if (err) { console.log(err); return res.negotiate(err) };

            //     return res.send(datoPersona[0]);
            // });
            return res.send(uploadedFiles);
        });
    },
    cargarFotos: function (req, res) {

        req.file('avatar').upload({
            // ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/avatars'),
            maxBytes: 20000000
        }, function whenDone(err, uploadedFiles) {

            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }

            var csvFilePath = '../.././assets/cvs/personalFab.csv'

            var nuevasPersonas = [];
            var data = fs.readFileSync(path.join(__dirname, csvFilePath), { encoding: 'utf8' });
            var options = {
                delimiter: ';', // optional
                quote: '"' // optional
            };

            nuevasPersonas = csvjson.toObject(data, options);

            var contador = 1;
            nuevasPersonas.forEach(function (persona) {

                if (persona.cedula.length > 0) {
                    persona.identificacion = persona.cedula
                } else {
                    persona.identificacion = persona.codigoFoto
                }

                var direccionBase = "http://localhost:1337"
                // var direccionBase = "http://192.241.152.146:1337"

                uploadedFiles.forEach(function (file, i) {

                    var nombreFoto = file.filename.substring(4, 8);
                    sails.log('NOMBRE FOTO: ', nombreFoto)
                    sails.log('codigo FOTO: ', persona.codigoFoto)
                    if (nombreFoto == persona.codigoFoto) {
                        sails.log('++++++++++++++++++++++++++++++++++')
                        sails.log('IGUALES')

                        sails.log('Persona - Identificacion', "*" + persona.identificacion + "*")
                        var url = direccionBase + "/avatars//" + (uploadedFiles[i].fd).substring(47);
                        Persona.findOne({ identificacion: persona.identificacion }).exec(function (err, datoPersona) {
                            if (err) { console.log(err); return res.negotiate(err) };

                            console.log('ID PERSONA : ', datoPersona)

                            Persona.update({ id: datoPersona.id }, { img: url }).exec(function (err, per) {

                                if (err) { console.log(err); return res.negotiate(err) };

                                console.log('Se adicio Foto a : ', per.identificacion)
                            });
                        });
                    }

                }, this);

            }, this);

            //  var direccionBase = "http://localhost:1337"
            // var direccionBase = "http://192.241.152.146:1337"
            // var url = direccionBase + "/avatars//" + (uploadedFiles[0].fd).substring(47);
            // Persona.update({ id: idPersona }, {
            //     img: url,
            // }).exec(function (err,datoPersona) {

            //     if (err) { console.log(err); return res.negotiate(err) };

            //     return res.send(datoPersona[0]);
            // });
            return res.send(uploadedFiles);
        });

    },
    random: (req, res) => {

        Persona.findOne({ identificacion: '1730' }).exec(function (err, datoPersona) {
            if (err) { console.log(err); return res.negotiate(err) };

            console.log('ID PERSONA : ', datoPersona)
            Persona.update({ id: datoPersona.id }, { img: 'url' }).exec(function (err, per) {

                if (err) { console.log(err); return res.negotiate(err) };

                console.log('Se adicio Foto a : ', per.identificacion)

                res.send(per)
            });
        });
    }

};

