


var fs = require('fs')
var path = require('path')
var conversion = require("phantom-html-to-pdf")();

module.exports = {

    asistenciaDia: function (req, res) {

        var dia = [ 'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado' ];
        var mes = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

        var fechaA = new Date('2/27/2018');
        var hoy = new Date();
        console.log('fecha', fechaA)        
        Asistencia.find().populate('idPersona').exec((err, datoAsistencias) => {
            sails.log('datoAsistencias', datoAsistencias[0].fecha)
            datoAsistencias[0].fecha = fechaA.getDate()+ ' de ' + mes[fechaA.getMonth()] + ' de ' + fechaA.getFullYear()
            res.view('asistenciaDia', { asistencia: datoAsistencias });
        });
    },

    generarReportePorDia: (req, res) => {

        var html = ''
        conversion({
            // html: "<h1>Hello World</h1>" 
            url: 'http://localhost:1337/report/asistenciaDia'
        }

            , function (err, pdf) {
                var output = fs.createWriteStream(path.join(__dirname, '../.././assets/reportes/output.pdf'))
                console.log(pdf.logs);

                console.log(pdf.numberOfPages);
                // since pdf.stream is a node.js stream you can use it
                // to save the pdf to a file (like in this example) or to
                // respond an http request.
                pdf.stream.pipe(output);
            });
        res.send('NADA')
    },
    generarReportePorMes: (req, res) => {

        var html = ''
        conversion({
            // html: "<h1>Hello World</h1>" 
            url: 'https://es.wikipedia.org/wiki/Wikipedia:Portada'
        }

            , function (err, pdf) {
                var output = fs.createWriteStream(path.join(__dirname, '../.././assets/reportes/output.pdf'))
                console.log(pdf.logs);
                console.log(pdf.numberOfPages);
                // since pdf.stream is a node.js stream you can use it
                // to save the pdf to a file (like in this example) or to
                // respond an http request.
                pdf.stream.pipe(output);
            });
        res.send('NADA')
    },
    mostrar: function (req, res) {

        res.send('NADA otra vez')
    },
    generarReportePorGestion: (req, res) => {

        var html = ''
        conversion({
            // html: "<h1>Hello World</h1>" 
            url: 'https://es.wikipedia.org/wiki/Wikipedia:Portada'
        }

            , function (err, pdf) {
                var output = fs.createWriteStream(path.join(__dirname, '../.././assets/reportes/output.pdf'))
                console.log(pdf.logs);
                console.log(pdf.numberOfPages);
                // since pdf.stream is a node.js stream you can use it
                // to save the pdf to a file (like in this example) or to
                // respond an http request.
                pdf.stream.pipe(output);
            });
        res.send('NADA')
    },
    mostrar: function (req, res) {

        res.send('NADA otra vez')
    }

};