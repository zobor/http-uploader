const http = require('http')
const fs = require('fs')
const multiparty = require('multiparty')
const path = require('path')
const colors = require('colors')
var PORT = 8080
var IPv4 = getLocalIpAddress();

function Uploader(options){
    PORT = options.port || PORT;
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
        else if (req.url == '/jquery.js') {
            res.writeHead(200, {
                'content-type': 'application/javascript'
            })
            res.end(fs.readFileSync(path.resolve(__dirname, './jquery.min.js'), 'utf-8'))
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
                // console.log('Error parsing form: ' + err.stack);
                if (err&&err.stack&&err.stack.indexOf('Request aborted')>-1) {
                    console.log('Upload Cancle');
                }else{
                    console.log(err.stack)
                }
            });
            form.on('close', function () {
                console.log('Upload completed!');
            });

            form.parse(req, function (err, fields, files) {
                res.writeHead(200, { 'content-type': 'application/json' });
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

    var $path = (DEST+'').green.underline;
    var $name = 'http-uploader'.green.bold;
    console.log(`${$name} the path to be save: ${$path}`)
    console.log(`Available on:`)
    console.log(`http://127.0.0.1:${PORT}/`.red.underline)
    console.log(`http://${IPv4}:${PORT}/`.red.underline)
    console.log(`Press Ctrl+C to stop！`.underline)
}

function getLocalIpAddress(){
    var os = require('os');
    var IPv4;
    for(var i=0;i<os.networkInterfaces().en0.length;i++){
        if(os.networkInterfaces().en0[i].family=='IPv4'){
            IPv4=os.networkInterfaces().en0[i].address;
        }
    }
    return IPv4;
}

module.exports = Uploader;