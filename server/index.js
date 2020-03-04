const express = require('express');

const app = express();
const PORT = 5000;

var bodyParser     =        require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const todos = [
    {
        id: 1,
        title: 'Về quê bằng xe Ô HÔ',
        description: 'Bắt xe về quê lúc 5h30',
        urgent: true,
        done: true
    },
    {
        id: 2,
        title: 'Mua hoa trang trí nhà',
        description: 'Mua một cành đào đá thật to để trang trí',
        urgent: true,
        done: false
    },
    {
        id: 3,
        title: 'Mua đồ chơi cho cháu',
        description: 'Mua bóng da, bóng chuyền hơi, xe đạp, bóng nhựa, cầu lông để các cháu về quê chơi',
        urgent: false,
        done: false
    }
]

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

// API Homepage
app.get('/', (req, res) => {
    res.send('Hi user, I am serving for API server')
})

// Get to-do task
app.get('/apicenter/todos', (req, res) => {
    if (Object.keys(req.query).length === 0 && req.query.constructor === Object){
        res.json(todos);
    } else {
        const query = req.query; // an Object
        let result = [];

        for (let i = 0; i < todos.length; i++) {
            let hasQuery = true;
            for (let q in query ) {
                if(todos[i][q].toString() !== query[q]) {
                    hasQuery = false;
                    break;
                }
            }
            if(hasQuery) result.push(todos[i]);
        }
    
        res.json(result);
    }
})

// POST METHODS
app.post('/apicenter/todos/finish/:todoId', (req, res) => {

    for (let todo of todos) {
        if(todo['id'] == req.params.todoId) {
            todo['done'] = ! todo['done'];
            break;
        }
    }
    res.json(true);
})

app.post('/apicenter/todos/urgent/:todoId', (req, res) => {

    for (let todo of todos) {
        if(todo['id'] == req.params.todoId) {
            todo['urgent'] = ! todo['urgent'];
            break;
        }
    }
    res.json(true);
})

app.post('/apicenter/todos/add', (req, res) => {
    var title = req.body.title
    var desc = req.body.description;

    let newItem = {};
    newItem['id'] = todos[todos.length - 1]['id'] + 1;
    newItem['title'] = title;
    newItem['description'] = desc;
    
    todos.push(newItem);
    
    res.json(true);
})




// DELETE METHODS
app.delete('/apicenter/todos/delete/:todoId', (req, res) => {

    for (let todo of todos) {
        if(todo['id'] == req.params.todoId) {
            let deleteIndex = todos.indexOf(todo);
            todos.splice(deleteIndex, 1);
            break;
        }
    }
    res.json(true);
})


// =====================================
// =====================================
app.listen(PORT, ()=> {
    console.log(`Server has started at port ${PORT}`);
})