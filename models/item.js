const mongoose = require("mongoose")
const ItemSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

ItemSchema.statics.toggleComplete = async function(id) {
    const item = await mongoose.model("Item").findById({ _id: id })
    item.completed = !item.completed
    await item.save()
    return item
}
const ListSchema = new mongoose.Schema({
    list: {
        type: String,
        required: true
    },
    items: {
        type: [ItemSchema],
        default: []
    }
})

module.exports = {
    Item: mongoose.model("Item", ItemSchema),
    List: mongoose.model("List", ListSchema)
}