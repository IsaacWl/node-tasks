const mongoose = require("mongoose")
const express = require("express")
const app = express()
const date = require(__dirname + "/date.js")
const {Item, List} = require(__dirname + "/models/item.js")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set("view engine", "ejs")
app.use(express.static("public"))

// const items = []
const uri = "mongodb://localhost:27017/itemsList"

app.get("/", async (req, res) => {
    res.redirect("/lists")
})

app.get("/lists", async (req, res) => {
    const items = await Item.find({})
    res.render("home", {
        title: date.getDay(),
        items: items
    })
})

app.get("/lists/:customList", async ( req, res) => {
    const { customList } = req.params
    const list = await List.findOne({ list: { $regex: customList, $options: "i" } })
    if (!list) {
        const newList = new List({
            list: customList
        })
        await newList.save()
        return res.redirect(`/${customList}`)
    }
    res.render("home", {
        title: list.list,
        items: list.items
    })
    // res.status(201).send({ list })
})

app.post("/", async ( req, res ) => {
    const { item, list } = req.body
    const customList = await List.findOne({ list: { $regex: list, $options: "i" }})
    if (!customList) {
        if (!item.trim())
            return res.redirect("/lists")

        const newItem = new Item({
            item: item
        })
        await newItem.save()
        return res.redirect("/lists")
    }
    const newItem = new Item({
        item: item
    })
    customList.items.push(newItem)
    await customList.save()
    res.redirect(`/lists/${list}`)
})

app.patch("/:id", async ( req, res) => {
    const id = req.params.id
    const { list } = req.query
    const customList = await List.findOne({ list: { $regex: list, $options: "i" }})
    if (!customList) {
        const item = await Item.toggleComplete(id)
        if (!item)
            return res.status(404).send({ error: "item was not found." })
        return res.status(200).send()
    }
    const { items } = customList
    const item = items.find((item) => {
        return String(item._id) === id
    })
    await List.updateOne({ _id: customList._id, items: {$elemMatch: { _id: item._id }} }, {  $set : { "items.$.completed" : !item.completed } } )
    res.status(200).send()
})

app.delete("/:id", async ( req, res) => {
    const id = req.params.id
    const { list } = req.query
    try {
        const customList = await List.findOne({ list: { $regex: list, $options: "i" } })
        if (!customList) {
            await Item.findByIdAndRemove(id)
            return res.status(200).send()
        }
        await customList.updateOne({ $pull: { items: { _id: id } }})
        return res.status(200).send()
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

mongoose.connect(uri, () => {
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`listening on port ${PORT}.`))
})
