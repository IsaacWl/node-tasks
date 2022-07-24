exports.getDay = function() {
    const today = new Date()

    const options = {
        weekday: "short",
        day: "numeric",
        month: "short"
    }

    return today.toLocaleDateString("pt-BR", options)
}