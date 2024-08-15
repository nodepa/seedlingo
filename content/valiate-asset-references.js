#!/usr/bin/env node

const path = require('path')
const fs = require('fs')

const words = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'WordSpec.json'), 'utf-8')).words

const ignoreList = [
  ".",
  ",",
  ":",
  ";",
  "?",
]

const audioRefs = []
const picRefs = []
let printOut = "Key                                  Word               A P\n"
let errMsg = ''
Object.keys(words).forEach((key) => {
  if (ignoreList.includes(words[key].word)) {
    return
  }

  printOut += `${key} ${words[key].word.padEnd(18)}`
  if (words[key].audio) {
    audioRefs.push(path.resolve(__dirname, words[key].audio))
    if (fs.existsSync(path.resolve(__dirname, words[key].audio))) {
      printOut += " \033[32m✔\033[0m"
    } else {
      printOut += " \033[31m✘\033[0m"
      errMsg += " Audio not found"
    }
  } else {
    printOut += " \033[31m✘\033[0m"
    errMsg += " Audio field missing"
  }
  if (words[key].picture) {
    picRefs.push(path.resolve(__dirname, words[key].picture))
    if (fs.existsSync(path.resolve(__dirname, words[key].picture))) {
      printOut += " \033[32m✔\033[0m"
    } else {
      printOut += " \033[31m✘\033[0m"
      errMsg += " Picture not found"
    }
  } else {
    printOut += " \033[33m—\033[0m"
  }
  console.log(printOut, errMsg)
  printOut = ''
  errMsg = ''
})

printOut = ''
const audioFiles = fs.readdirSync(path.resolve(__dirname, 'audio'), { recursive: true }).map((file) => path.resolve(__dirname, 'audio', file))
audioFiles.forEach((fileName) => {
  if (fileName.endsWith('.audio')) {
    if (!audioRefs.includes(fileName.slice(0, -6))) {
      printOut += "\n" + fileName.slice(0, -6).padEnd(80) + "🔗 \033[31m✘\033[0m  💾 \033[32m✔\033[0m"
      if (fs.existsSync(path.resolve(__dirname, 'audio', fileName.slice(0, -6)))) {
        printOut += "  .mp3 \033[32m✔\033[0m  .audio \033[32m✔\033[0m"
      } else {
        printOut += "  .mp3 \033[31m✘\033[0m  .audio \033[32m✔\033[0m"
      }
    } else if (!fs.existsSync(path.resolve(__dirname, 'audio', fileName.slice(0, -6)))) {
      printOut += "\n" + fileName.slice(0, -6).padEnd(80) + "🔗 \033[32m✔\033[0m  💾 \033[32m✔\033[0m"
      printOut += "  .mp3 \033[31m✘\033[0m  .audio \033[32m✔\033[0m"
    }
  } else if (fileName.endsWith('.mp3')) {
    if (!audioRefs.includes(fileName)) {
      printOut += "\n" + fileName.padEnd(80) + "🔗 \033[31m✘\033[0m  💾 \033[32m✔\033[0m"
      if (fs.existsSync(path.resolve(__dirname, 'audio', fileName + '.audio'))) {
        printOut += "  .mp3 \033[32m✔\033[0m  .audio \033[32m✔\033[0m"
      } else {
        printOut += "  .mp3 \033[32m✔\033[0m  .audio \033[31m✘\033[0m"
      }
    } else if (!fs.existsSync(path.resolve(__dirname, 'audio', fileName + '.audio'))) {
      printOut += "\n" + fileName.padEnd(80) + "🔗 \033[32m✔\033[0m  💾 \033[32m✔\033[0m"
      printOut += "  .mp3 \033[31m✘\033[0m  .audio \033[32m✔\033[0m"
    }
  }
})
if (printOut) {
  console.log("\n\n\nAudio reference issues:")
  console.log(printOut)
}

printOut = ''
const picFiles = fs.readdirSync(path.resolve(__dirname, 'pics')).map((file) => path.resolve(__dirname, 'pics', file))
picFiles.forEach((fileName) => {
  if (!picRefs.includes(fileName)) {
    printOut += "\n" + fileName.padEnd(80) + "🔗 \033[31m✘\033[0m   💾 \033[32m✔\033[0m\n"
  }
})
picRefs.forEach((ref) => {
  if (!picFiles.includes(ref)) {
    printOut += "\n" + ref.padEnd(80) + "🔗 \033[31m✘\033[0m   💾 \033[32m✔\033[0m\n"
  }
})

if (printOut) {
  console.log("\nPictures reference issues:")
  console.log(printOut)
}
