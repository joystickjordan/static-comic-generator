
const pug = require('pug')
const fs = require('fs')
const rmdir = require('rimraf')

let settings = JSON.parse(fs.readFileSync('./settings.json'))

rmdir.sync(settings.output);
fs.mkdirSync(settings.output);

const comics = fs.readdirSync(settings.comics)
// sort array from low to high
comics.sort((a,b) => {
    const aInt = a.split('.pug')[0]|0
    const bInt = a.split('.pug')[0]|0
    return (aInt < bInt)
})
for (let c = 1; c <= comics.length; c++) {
    const htmlFileName = comics[c-1].split('.pug')[0]+'.html'
    let data = pug.renderFile(settings.comics + comics[c-1])
    const path = settings.output + htmlFileName

    // pagination
    let prevComic = '1.html';
    if (c > 1) prevComic = c - 1 + '.html'
    let nextComic = 'index.html'
    if (c < comics.length ) nextComic = c + 1 + '.html' 
    data = data.replace('{prevComic}', prevComic).replace('{nextComic}', nextComic)

    fs.writeFile(path, data, err => {
        if (err) console.error(err)
    })

    // making the latest comic "index.html"
    if (c == comics.length) {
        fs.writeFile(settings.output + 'index.html', data, err => {
            if (err) console.error(err)
        })
    }
}

// static file (non-comic pugs) handler

const static = fs.readdirSync(settings.static)
static.forEach(file => {
    let htmlFile = file.split('.pug')[0]+'.html'
    let data = pug.renderFile(settings.static + file)
    let path = settings.output + htmlFile
    fs.writeFile(path, data, err => {
        if (err) console.error(err)
    })
})

// asset (images, css, js, etc handler

const assets = fs.readdirSync(settings.assets)
assets.forEach(file => {
    fs.readFile(settings.assets + file, (err, data) => {
        if (err) console.error(err)
        else {
            fs.writeFile(settings.output + file, data, writeErr => {
                if (err) console.error(err)
            })
        }
    })
})