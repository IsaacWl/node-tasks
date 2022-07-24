const fs = require("fs").promises
const express = require("express")
const app = express()
const date = require(__dirname + "/date.js")
const Item = require(__dirname + "/models/index.js")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set("view engine", "ejs")
app.use(express.static("public"))

const items = []
app.get("/", (req, res) => {
    res.render("home", {
        title: date.getDay(),
        items: items
    })
})

app.post("/", ( req, res ) => {
    const { item } = req.body
    if (!item.trim()) 
        return res.redirect("/")
        
    const newItem = new Item(item)
    items.push(newItem)
    res.redirect("/")
})

app.patch("/:id", ( req, res) => {
    const id = req.params.id
    const item = items.find(item => {
        return item.id === id
    })
    if (!item) 
        return res.status(400).send({ error: "item was not found." })
    
    item.toggleComplete()
    res.status(200).send({ status: "success.", item: item })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`listening on port ${PORT}.`))
