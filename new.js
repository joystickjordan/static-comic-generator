
const fs = require('fs')
let settings = JSON.parse(fs.readFileSync('./settings.json'))

const comics = fs.readdirSync(settings.comics)

const data = `
extends ../templates/comic

block title
    | comic title

block comic
    img(src='')
    
block blogTitle
    | blog title

block blog
    | blog text lorem ipsum
`

const filePath = settings.comics + (comics.length + 1) + '.pug'

fs.writeFile(filePath, data, err => {
    if (err) console.error(err)
    else {
        console.log(`${filePath} created!`)
    }
})