const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()
const port = 48985
const cors = require('cors')

app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello from Express!')
    console.log(`Request received! ${req}`)
})

app.listen(port, '0.0.0.0', () => {
    console.log(`AutoSFC backend listening on port ${port}!`)
})

app.post('/', bodyParser.json(), (req, res) => {
    const url = req.body.url
    console.log(`Request received from ${req.headers.origin}!`)

    request(url, {}, (err, response, body) => {
        if (err) {
            console.error(err)
            res.send(`Express: Error when loading URL: ${err}`)
        } else {
            console.log('Fetch worked! Data:')
            let lines = body.toString().split('\n')
            lines = lines.length <= 3 ? lines.join('\n') : lines.slice(0, 3).join('\n') + '\n...'
            console.log(lines)
            res.send({msg: 'Express: File read successfully!', fileContent: body})
        }
    })
})
