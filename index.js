const express = require('express')
const app = express()
const port = 48985
const cors = require('cors')

app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello from Express!')
    console.log(`Request received! ${req}`)
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`)
})
