/* eslint no-console:0 */

'use strict';


// split
const fs = require('fs')
const util = require('util');
const simpleParser = require('mailparser').simpleParser;


var mboxFilename = process.argv[2];
var emailAddress = process.argv[3];
var fromDateString = process.argv[4];
var currentEmail = ""
var count = 0;

var emailContents = []

fs.readFileSync(mboxFilename, 'utf-8').split('\n').forEach((line) => {
    if(line.indexOf("From ") === 0){
        emailContents.push(currentEmail)
        currentEmail = ""
        count++
    }
    currentEmail += line + '\n'
})
emailContents.push(currentEmail)

var links = ""

emailContents.forEach((emailString) => {

    setTimeout(function() {

        simpleParser(emailString)
        .then(mail => {
            mail.to.value.forEach((addressee) => {
                if(addressee.address === emailAddress && mail.date > new Date()){
                    links += mail.text + '\n'
                }
            })
        })
        .catch(err => {
            console.log(err);
        });
    }, Math.random() * 60000)

})

setTimeout(function(){
    clean(links)
}, 70000)

function clean(dirtyLinks) {

    // clean

    var cleanedLinks = ""
    var rejectPile = ""
    var previousLine = ""

    var currentOutputLine
    dirtyLinks.split('\n').forEach((line, index) => {
        line = line.trim()

        if(line === ""){
            if(currentOutputLine.indexOf('trulia') < 0){
                cleanedLinks += currentOutputLine + "\n"
            }
            currentOutputLine = ""
        } else {
            if(currentOutputLine === "") {
                currentOutputLine = line
            } else {
                currentOutputLine += " " + line
            }
        }

    })
    formatCleanedLinks(cleanedLinks)
}

function formatCleanedLinks(links) {
    var formattedFile = ""
    var filterFile = ""
    var secondFilterFile = ""

    links.split('\n').forEach((line) => {
        var split = line.split(" - ")
        if(split.length === 2 && split[1].indexOf("http") >= 0) {
            formattedFile += line + "\n"
        } else { 
            filterFile += line + "\n"
        }
    })

    filterFile.split('\n').forEach((line) => {
        // lobsters
        if (line.indexOf('https://lobste.rs') === 0) {
            var split = line.split('/')
            var title = split[split.length - 1].trim().split('_').join(' ').split('-').join('_')
            line = title + ' - ' + line.trim()
            formattedFile += line + '\n'

        // medium
        } else if (line.indexOf('https://medium.com') === 0) {
            var split = line.split('/')
            var title = split[split.length - 1].trim().split('-')
            title.splice(-1,1)
            title = title.join(' ').trim()
            line = title + ' - ' + line.trim()
            formattedFile += line + '\n'

        // github
        } else if (line.indexOf('https://github.com') === 0) {
            var split = line.split('/')
            var title = split[split.length - 1].trim().split('-').join(' ').trim()
            line = title + ' - ' + line.trim()
            formattedFile += line + '\n'

        } else {
            secondFilterFile += line + '\n';
        }
    })

    fs.writeFileSync('accepted.txt', formattedFile,'utf-8')
    fs.writeFileSync('rejected.txt', secondFilterFile,'utf-8')
}
