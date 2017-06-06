
const pug = require('pug')
const fs = require('fs')
const rmdir = require('rimraf')

let settings = JSON.parse(fs.readFileSync('./settings.json'))

rmdir.sync(settings.output);
fs.mkdirSync(settings.output);

// comics handler
const comics = fs.readdirSync(settings.comics)
// sort array from low to high
comics.sort((a,b) => {
    const aInt = a.replace('.pug','')|0
    const bInt = b.replace('.pug','')|0
    return (aInt - bInt)
})
for (let c = 1; c <= comics.length; c++) {
    let data = pug.renderFile(settings.comics + comics[c-1])
    const path = settings.output + c

    // pagination
    let prevComic = '../1';
    if (c > 1) prevComic = '../' + (c - 1)|0
    let nextComic = '../index.html'
    if (c < comics.length ) nextComic = '../' + (c + 1)|0
    data = data.replace('{prevComic}', prevComic).replace('{nextComic}', nextComic)
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