// TODO:
//  • Mail feedback or create repo issue

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const crypto = require('crypto')

const HASH_LENGTH = 8

const app = express()
const port = 48985
const cors = require('cors')

app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello from AutoSFC server!')
    console.info(`Request received! ${req}`)
})

app.listen(port, '0.0.0.0', () => {
    console.info(`AutoSFC server listening on port ${port}!`)
})

app.post('/', bodyParser.json(), (req, res) => {
    const url = req.body.url
    console.info(`Request received from ${req.headers.origin}!`)

    request(url, {}, async (err, response, body) => {
        if (err || response.statusCode >= 400) {
            console.error(response.statusCode)
            console.error(err)
            res.status(400).json({error: `Express: Error when loading URL: ${err}`})
        } else {
            console.info('Fetch worked! Data:')
            let lines = body.toString().split('\n')
            lines = lines.length <= 3 ? lines.join('\n') : lines.slice(0, 3).join('\n') + '\n...'
            console.info(lines)

            // Generate hash
            const hash = crypto.hash('md5', body.toString())
            console.info(hash)

            res.status(200).json({
                msg: `Remote file read successfully!`,
                fileContent: body, hash: hash
            })
        }
    })
})
