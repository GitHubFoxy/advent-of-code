import { test, full } from "./input.js"

const testArray = test.split(",")
const fullArray = full.split(",")

let password: number = 0

function checkIfNumberIsGood(number: number): boolean {
    const numberString = number.toString()

    const limit = Math.floor(numberString.length / 2)
    const n = numberString.length

    for (let blockLength = 1; blockLength <= limit; blockLength++) {
        if (n % blockLength === 0) {
            const pattern = numberString.substring(0,blockLength)
            const repeats = n/blockLength
            if (pattern.repeat(repeats) == numberString) {
                return true
            }
        }
    }
    
    return false
}

fullArray.forEach((item) => {
    const start = parseInt(item.split("-")[0])
    const end = parseInt(item.split("-")[1])

    let numberArray = Array.from({length: end - start + 1}, (_, i) => start + i)
    
    numberArray.forEach((number) => {
        if (checkIfNumberIsGood(number)) {
            password += number
        }
    })
})

console.log(password)
