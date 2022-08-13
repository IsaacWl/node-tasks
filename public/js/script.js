const selectElement = (element) => document.querySelector(element)
const selectElements = (elements) => document.querySelectorAll(elements)

const handleComplete = (e) => {
    const elements = selectElements("#check")
    if (!elements) return
    
    elements.forEach((element) => {
        element.addEventListener("change", async (e) => {
            const id = e.target.getAttribute("key")
            const list = e.target.value

            const options = {
                method: "PATCH"
            }
            try {
                const request = await fetch(`/${id}?list=${list}`, options)
                if (request.status === 200)
                    location.reload()

            } catch (error) {
                console.error({ error: error.message })
            } 
        })
    })
}

handleComplete()

selectElement(".close")
?.addEventListener("click", async (e) => {
    const id = e.target.getAttribute("key")
    const list = e.target.getAttribute("data-title")
    console.log(list)
    const options = {
        method: "DELETE"
    }
    try {
        const request = await fetch(`/${id}?list=${list}`, options)
        if (request.status === 200)
            location.reload()

    } catch (error) {
        console.error({ error })
    }
})