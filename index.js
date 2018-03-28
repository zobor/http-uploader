const program = require('commander')
const packageJson = require('./package.json')

if (process.argv.length==2) {
  process.argv.push('-p')
}

program
    .version(packageJson.version)
    .option('-c, --config [value]', 'specifies the profile path')
    .option('-p, --port [value]', 'specify the app port')
    .parse(process.argv)

if (program.start || program.port || program.config) {
    const Uploader = require('./src/app.js')
    if (typeof program.port === 'boolean' || !/^\d+$/.test(program.port)) {
        program.port = null
    }
    new Uploader(program)
}


module.exports = {}