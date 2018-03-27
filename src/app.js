const http = require('http')
const fs = require('fs')
const multiparty = require('multiparty');
const path = require('path')
var PORT = 8080

function Uploader(options){
    var DEST = path.resolve(process.cwd(),'http-uploader-files')
    try{
        if (!fs.statSync(DEST).isDirectory() ){
            fs.mkdirSync(DEST, 07777)
        }
    }catch(err){
        fs.mkdirSync(DEST,07777)
    }

    http.createServer(function (req, res) {
        if (req.url == '/' && req.method.toLowerCase() == 'get') {
            res.end(fs.readFileSync(path.resolve(__dirname, './panel.html'), 'utf-8'))
        }
        else if (req.url == '/upload.js') {
            res.writeHead(200, {
                'content-type': 'application/javascript'
            })
            res.end(fs.readFileSync(path.resolve(__dirname, './browser-uploader.js'), 'utf-8'))
        }
        else if (req.url == '/index.js') {
            res.writeHead(200, {
                'content-type': 'application/javascript'
            })
            res.end(fs.readFileSync(path.resolve(__dirname, './browser-index.js'), 'utf-8'))
        }
        else if (req.url == '/main.css') {
            res.writeHead(200, {
                'content-type': 'text/css;charset=utf-8'
            })
            res.end(fs.readFileSync(path.resolve(__dirname, './main.css'), 'utf-8'))
        }
        else if (req.url == '/' && req.method.toLowerCase() == 'post') {

            var form = new multiparty.Form({
                uploadDir: DEST
            });
            form.on('error', function (err) {
                console.log('Error parsing form: ' + err.stack);
            });
            form.on('close', function () {
                console.log('Upload completed!');
            });

            form.parse(req, function (err, fields, files) {
                res.writeHead(200, { 'content-type': 'application/json' });
                // res.write(`
                //     <!DOCTYPE html>
                //             <html lang="en">
                //             <head>
                //             <meta charset="UTF-8" />
                //             <title>upload demo</title>
                //             </head>
                //             <body>
                //             <p style="color:green;">success</p>
                //             <script>
                //                 frameElement.callback({msg:'ok2'})
                //             </script>
                //             </body>
                //             </html>
                // `)
                res.write(JSON.stringify({
                    code:0,
                    msg: 'ok'
                }))
                res.end('')
            });
        }
        else {
            res.end('unknown route')
        }
    }).listen(PORT)

    console.log(`test server run at:http://127.0.0.1:${PORT},Press Ctrl+C to stop！`)
}

module.exports = Uploader;