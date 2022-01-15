const express = require('express')
const {templates} = require('./examples_data')

const app = express()
const port = 3000

app.use(express.static('dist', { extensions: ['scss', 'css'] }));

app.get('/', (req, res) => {
  res.send(templates.login())
})

app.get('/register', (req, res) => {
  res.send(templates.register())
})

app.get('/settings', (req, res) => {
  res.send(templates.settings())
})

app.get('/chat', (req, res) => {
  res.send(templates.chat())
})

app.get('/error_404', (req, res) => {
  res.send(templates.error_404())
})

app.get('/error_500_and_more', (req, res) => {
  res.send(templates.error_500_and_more())
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})