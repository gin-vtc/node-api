const express = require('express');
const dbFunc = require('./func');
const app = express();
const port = 3000

//　ルート
app.get('/', (req, res) => {
    // ステータスチェック
    res.sendStatus(200)
    res.send('ok');
});

// ログイン
app.get('/login', (req, res) => {
    const {user, password} = req.query
    userDB = dbFunc.getJson('user')
    console.log(user)
    if (user) {
        let status = 400
        // res.sendStatus(200)
        for (let x in userDB) {
            if (userDB[x].user === user && userDB[x].password === password) {
                status = 200
            }
        }
        res.sendStatus(status)
    } else {
        res.sendStatus(500)
    }
});
app.get('/user', (req, res) => {
    const {id} = req.query
    userDB = dbFunc.getJson('user')
    let status = 404
    for (x in userDB) {
        console.log(userDB[x].id, id)
        if (userDB[x].id === id) {
            status = 200
        }
    }
    console.log(status)
    if (status === 404) {
        res.send(404)
    } else {
        res.status(200).json(userDB[x])
    }
});
app.post('/user', (req, res) => {
    const {user, password, name} = req.query

    let id = ''
    do {
        id = dbFunc.makeid(15)
    } while (dbFunc.makeid('user', id));
    //　同じIDを回避する


    if (user && password && name) {
        const status = dbFunc.appendJson('user', {id, user, password, name})
        res.sendStatus(status)
    } else {
        res.sendStatus(401)
    }
});
app.put('/user', (req, res) => {
    const {user, password, newPwd, newName} = req.query
    userDB = dbFunc.getJson('user')
    for (x in userDB) {
        if (userDB[x].user === user && userDB[x].password === password) {
            if(newPwd){
                userDB[x].password = newPwd
            }
            if(newName){
                userDB[x].name = newName
            }
           const status =  dbFunc.updateDb('user',userDB)
            res.sendStatus(status)
        }
    }
    res.sendStatus(401)

});


//　サバー起動
app.listen(port, () => {
    console.log(`APIサーバーを起動します(Port: ${port})`);
});
