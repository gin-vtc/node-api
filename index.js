const express = require('express');
const dbFunc = require('./func');
const app = express();
const port = 3000

//　デフォルト
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    var _send = res.send;
    var sent = false;
    res.send = function(data){
        if(sent) return;
        _send.bind(res)(data);
        sent = true;
    };

    // Pass to next layer of middleware
    next();
});

//　ルート
app.get('/', (req, res) => {
    // ステータスチェック
    res.sendStatus(200)
    res.send('ok');
});
// つぶやく
app.get('/statusList', (req, res) => {
    list = dbFunc.getJson('status')
    list ? res.status(200).json(list) : res.sendStatus(500)
})
app.post('/status', (req, res) => {
    const {id, status} = req.query

    let sid = ''
    do {
        sid = dbFunc.makeid(15)
    } while (!dbFunc.checkId('status', sid));
    //　同じIDを回避する


    const statusCode = dbFunc.appendJson('status', {
        id: sid,
        user: id,
        status: status,
        time: Math.floor(Date.now() / 1000)
    })
    res.sendStatus(statusCode)

})
app.put('/status', (req, res) => {
    const {id, status} = req.query
    let statusDb = dbFunc.getJson('status')
    for (x in statusDb) {
        if (statusDb[x] && statusDb[x].id === id) {
            statusDb[x].status = status
            statusDb[x].time = Math.floor(Date.now() / 1000);
            const statusCode = dbFunc.updateDb('status', statusDb)
            res.sendStatus(statusCode)
        }
    }
    res.sendStatus(401)
})
app.delete('/status', (req, res) => {
    const {id, status} = req.query
    let statusDb = dbFunc.getJson('status')
    for (x in statusDb) {
        if (statusDb[x] && statusDb[x].id === id) {
            delete statusDb[x]
            const statusCode = dbFunc.updateDb('status', statusDb)
            res.sendStatus(statusCode)
        }
    }
    res.sendStatus(401)
})

// コメント
app.get('/comment', (req, res) => {
    const {status} = req.query
    let list = dbFunc.getJson('comment')
    let statusList = dbFunc.getJson('status')
    let final = []
    let user =""
    for (s in statusList){
        if(statusList[s].id ===status){
            user = statusList[s].user
        }
    }
    if (list) {
        for (x in list) {
            if (list[x] && list[x].statusId === status) {
                list[x].user = user
                final.push(list[x])
            }
        }
        res.status(200).json(final)
    } else {
        res.sendStatus(500)
    }
})
app.post('/comment', (req, res) => {
    const {statusId, comment} = req.query

    let cid = ''
    do {
        cid = dbFunc.makeid(15)
    } while (!dbFunc.checkId('comment', cid));
    //　同じIDを回避する

    const cmData = {
        id: cid,
        statusId: statusId,
        comment: comment,
        time: Math.floor(Date.now() / 1000)
    }
    console.log(cmData)
    const statusCode = dbFunc.appendJson('comment', cmData)
    res.sendStatus(statusCode)

})
app.delete('/comment', (req, res) => {
    const {id, comment} = req.query
    let db = dbFunc.getJson('comment')
    for (x in db) {
        if (db[x] && db[x].id === id) {
            delete db[x]
            const statusCode = dbFunc.updateDb('comment', db)
            res.sendStatus(statusCode)
        }
    }
    res.sendStatus(401)
})


// ログイン
app.get('/login', (req, res) => {
    let sent = false
    const {user, password} = req.query
    userDB = dbFunc.getJson('user')
    console.log(user)
    if (user) {
        let status = 400
        // res.sendStatus(200)
        for (let x in userDB) {
            if (userDB[x].user === user && userDB[x].password === password) {
                res.status(200).json(userDB[x])
                sent = true
            }
        }
        if(!sent) res.sendStatus(status)
    } else {
        if(!sent)  res.sendStatus(500)
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
app.get('/userList', (req, res) => {
    userDB = dbFunc.getJson('user')

    for (x in userDB) {
        delete userDB[x].password
    }

    res.status(200).json(userDB)

})
;
app.post('/user', (req, res) => {
    const {user, password, name} = req.query

    let id = ''
    do {
        id = dbFunc.makeid(15)
    } while (!dbFunc.checkId('user', id));
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
            console.log("Found")
            if (newPwd) {
                userDB[x].password = newPwd
            }
            if (newName) {
                userDB[x].name = newName
            }
            const status = dbFunc.updateDb('user', userDB)
            res.sendStatus(status)
        }
    }
    res.sendStatus(401)

});


//　サバー起動
app.listen(port, () => {
    console.log(`APIサーバーを起動します(Port: ${port})`);
});
