var fs = require('fs')

var originalFileLocation = process.argv[2]
var newFileLocation = process.argv[3]

var originalFile = fs.readFileSync(originalFileLocation, 'utf-8').split('\n')
var newFile = fs.readFileSync(newFileLocation, 'utf-8').split('\n')

var currentKey = ''
var currentValue = ''

var linkObj = {}

originalFile.forEach((line) => {
    if (line.indexOf('**** ') === 0) {
        currentKey = line
    } else if (line.indexOf('***** ') === 0 || line.indexOf('CLOSED:') >= 0) {
        if(linkObj[currentKey] === undefined) {
            linkObj[currentKey] = []
        }
        linkObj[currentKey].push(line)
    }
})

newFile.forEach((line) => {
    if (line.indexOf('**** ') === 0) {
        currentKey = line
    } else if (line.indexOf('***** ') === 0 || line.indexOf('CLOSED:') >= 0) {
        if(linkObj[currentKey] === undefined) {
            linkObj[currentKey] = []
        }
        linkObj[currentKey].push(line)
    }
})

var output = '*** Miscellaneous Reading\n'

Object.keys(linkObj).forEach((key) => {
    output += key + '\n'
    linkObj[key].forEach((value) => {
        output += value + '\n'
    })
})

fs.writeFileSync('mergedmiscreading.org', output, 'utf-8')