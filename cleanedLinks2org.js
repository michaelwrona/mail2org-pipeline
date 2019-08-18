'use strict'

const fs = require('fs')
const readline = require('readline');
var orgedLinks = ''

var filename = process.argv[2]


fs.readFileSync(filename,'utf-8').split('\n').forEach((line) => {
    line = line.split('–').join('-')
    line = line.split('[').join('(')
    line = line.split(']').join(')')

    orgedLinks += '***** TODO [[' + line.substring(line.lastIndexOf(' - ') + 2).trim() + "][" +  line.substring(0, line.lastIndexOf(' - ')).trim() + ']]' + '\n'
})
orgedLinks = orgedLinks.slice(0, orgedLinks.length - 1)
var lines = orgedLinks.split('\n')
// assign to topics

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var obj = {}
var output = ""

function ask(){
    var question = ""
    if(lines.length === 0 ){
        console.log('\n\n\n\n')
        print()
        rl.close()
    }else {
        question = lines.shift()
        rl.question(question, (answer) => {
            if(obj[answer] === undefined) {
                obj[answer] = []
            }
            obj[answer].push(question)
            console.log(lines.length)
            ask()
        });
    }
}

function print() {
    Object.keys(obj).forEach((key) => {
        output += '**** ' + key + '\n'
        obj[key].forEach((link) => {
            output += link + '\n'
        })
    })

    fs.writeFileSync('newmiscreading.org', output, 'utf-8')
}


ask()