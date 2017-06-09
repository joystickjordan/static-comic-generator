
const pug = require('pug')
const fs = require('fs')
const rmdir = require('rimraf')

let settings = JSON.parse(fs.readFileSync('./settings.json'))

// delete everything but '.git'
makeDir(settings.output)
const pubFiles = fs.readdirSync(settings.output)
pubFiles.forEach(file => {
    if (file != '.git') rmdir.sync(settings.output + file)
})

// comics handler
makeDir(settings.comics)
const comics = fs.readdirSync(settings.comics)
// sort array from low to high
comics.sort((a,b) => {
    const aInt = a.replace('.pug','')|0
    const bInt = b.replace('.pug','')|0
    return (aInt - bInt)
})
for (let c = 1; c <= comics.length; c++) {
    let pagination = {};
    if (c > 1) {
        pagination.disablePrev = ''
        pagination.urlFirst = '../1/'
        pagination.urlPrev = '../' + parseInt(c - 1) + '/'
    } else {
        pagination.disablePrev = 'disabled'
        pagination.urlFirst = ''
        pagination.urlPrev = ''
    }

    if (c < comics.length ) {
        pagination.disableNext = ''
        pagination.urlNext = '../' + parseInt(c + 1) + '/'
        pagination.urlLast = '../'
    } else {
        pagination.disableNext = 'disabled'
        pagination.urlNext = ''
        pagination.urlLast = ''
    }
    let paginationRendered = pug.renderFile(settings.templates + 'pagination.pug', pagination)
    let data = pug.renderFile(settings.comics + comics[c-1], {pagination: paginationRendered})
    const path = settings.output + c

    fs.mkdirSync(path)
    fs.writeFile(path + '/index.html', data, err => {
        if (err) console.error(err)
    })

    // copying the latest comic to "index.html"
    if (c == comics.length) {
        data.replace('..', '')
        fs.writeFile(settings.output + 'index.html', data, err => {
            if (err) console.error(err)
        })
    }
}

// pages handler
makeDir(settings.pages)
const pages = fs.readdirSync(settings.pages)
pages.forEach(file => {
    let filename = file.replace('.pug','')
    let data = pug.renderFile(settings.pages + file)
    let path = settings.output + filename
    fs.mkdir(path, (mkdirErr) => {
        if (mkdirErr) console.error(mkdirErr)
        else {
            fs.writeFile(path + '/index.html', data, err => {
                if (err) console.error(err)
            })
        }
    }) 
})

// assets (css, js, etc) handler
makeDir(settings.assets)
const assets = fs.readdirSync(settings.assets)
fs.mkdirSync(settings.output + 'assets/')
assets.forEach(file => {
    fs.readFile(settings.assets + file, (err, data) => {
        if (err) console.error(err)
        else {
            fs.writeFile(settings.output + 'assets/' + file, data, writeErr => {
                if (writeErr) console.error(writeErr)
            })
        }
    })
})

// images handler
makeDir(settings.images)
const images = fs.readdirSync(settings.images)
fs.mkdirSync(settings.output + 'images/')
images.forEach(file => {
    fs.readFile(settings.images + file, (err, data) => {
        if (err) console.error(err)
        else {
            fs.writeFile(settings.output + 'images/' + file, data, writeErr => {
                if (writeErr) console.error(writeErr)
            })
        }
    })
})

// static file handler, places files into top level with index.html
makeDir(settings.static)
const static = fs.readdirSync(settings.static)
static.forEach(file => {
    fs.readFile(settings.static + file, (err, data) => {
        if (err) console.error(err)
        else {
            fs.writeFile(settings.output + file, data, writeErr => {
                if (writeErr) console.error(writeErr)
            })
        }
    })
})

function makeDir(path) {
    try {
        fs.statSync(path)
    } catch(e) {
        fs.mkdirSync(path)
    }
}