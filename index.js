const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('req-body', (req,res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body',))


let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

const generateId = () => {
    const randomId = Math.floor(Math.random() * 10000000)
    return randomId
  }

app.get('/info', (request, response) => {
    const currentDate = new Date()
    const personCount = persons.length
    response.send(`<br>Phonebook has info for ${personCount} people</br>
    <br>${currentDate}</br>`)
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
  })

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({error: 'Name or number is missing'})
    }

    const personExists = persons.some((person) => person.name === body.name)

    if(personExists) {
        return response.status(400).json({error: 'The name already exists in the phonebook'})
    }
  
    const newPerson = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(newPerson)
    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })


const PORT = 3002
app.listen(PORT)
console.log(`Server running on port ${PORT}`)