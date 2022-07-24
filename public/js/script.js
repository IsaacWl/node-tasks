const selectElement = (element) => document.querySelector(element)
const selectElements = (elements) => document.querySelectorAll(elements)

const handleComplete = (e) => {
    const elements = selectElements("#check")
    if (!elements) return
    
    elements.forEach((element) => {
        element.addEventListener("change", async (e) => {
            const id = e.target.getAttribute("key")
            const options = {
                method: "PATCH"
            }
            try {
                const request = await fetch(`/${id}`, options)
                const response = await request.json()
                console.log(response)
            } catch (error) {
                console.error({ error: error.message })
            } 
        })
    })
}

handleComplete()