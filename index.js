// TODO:
//  • install and switch to MongoDB? (cannot run gpg as root)
//  • handle hash URLs
//  • handle max number of URLs
//  • Mail feedback or create repo issue
//  • Login?

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const { nanoid } = require('nanoid')

const MAX_ALLOWED_URLS = 10e+9
const UID_LENGTH = 8

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
        if (err) {
            console.error(err)
            res.status(400).json({error: `Express: Error when loading URL: ${err}`})
        } else {
            console.info('Fetch worked! Data:')
            let lines = body.toString().split('\n')
            lines = lines.length <= 3 ? lines.join('\n') : lines.slice(0, 3).join('\n') + '\n...'
            console.info(lines)

            // Retrieve or generate hash
            let newUid = false
            let uid = ''

            const defaultData = {urls: []}
            const {JSONFilePreset} = await import ('lowdb/node')
            const db = await JSONFilePreset('db.json', defaultData)
            const { urls } = db.data
            // noinspection JSUnresolvedReference
            const existingUrl = urls.find(u => u.fullUrl === url)
            if (existingUrl) {
                uid = existingUrl.uid
                console.info(`Found URL ${url} in db; UID: ${uid}`)
            } else {
                uid = nanoid(UID_LENGTH)
                await db.update(({urls}) => urls.push({fullUrl: url, uid: uid}))
                console.info(`URL ${url} not found in db; Uid generated and added to db: ${uid}`)
                newUid = true
            }

            res.status(200).json({
                msg: `Express: File read successfully! ${newUid ? `New UID created: ${uid}`: `UID received: ${uid}`}.`,
                fileContent: body, uid: uid, newUid: newUid
            })
        }
    })
})
