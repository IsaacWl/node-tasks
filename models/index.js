const { randomUUID } = require("crypto")

class List {
    constructor (title) {
        this.id = randomUUID()
        this.title = String(title)
        this.complete = false 
    }
    setTitle(title) {
        this.title = String(title)
        return this
    }
    toggleComplete() {
        this.complete = !this.complete
        return this 
    }
}

module.exports = List