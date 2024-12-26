const secret = "bgvyzdsv"

const hasher = new Bun.CryptoHasher("md5")
let hash = ""
let i = 254573
while (true) {
    hasher.update(secret + i)
    const hash = hasher.digest("hex")
    if (hash.slice(0, 6) === "000000") {
        break
    }
    i++
}
// for (i ; hasher.digest("hex").slice(0,5) != "000000"; i++) { 
//     hasher.update(secret + i)
// }
console.log(i)

// 



