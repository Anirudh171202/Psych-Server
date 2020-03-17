var express = require('express');
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io');
var port = process.env.POT || 3000;

server.listen(port, ()=>{
    console.log("Server listening at port %d", port)
});

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

let noOfPplConnected = 0;

io.on('connection', (sock)=>{
    var addedUser = false;

    sock.on('newmsg', (msg)=>{
        sock.broadcast.emit('msg', {
            user : sock.username,
            message :msg 
        });
    });

    sock.on('newusr', (username)=>{
        if(addedUser) return;

        SocketIO.username = username;
        noOfPplConnected+=1;
        addedUser = true;

        sock.emit('login', {
            numUsers:noOfPplConnected
        });

        sock.broadcast.emit('usrjnd', {
            username: sock.username,
            numUsers:noOfPplConnected
        });
        

    })

    sock.on('typsrt', ()=>{
        sock.broadcast.emit('typsrt', {
            username:sock.username
        })

    });

    sock.on('typstp', ()={
        sock.broadcast.emit('typstp',{
            username:sock.username
        })
    }
    })

    sock.on('discnt', ()=>{
        if(addedUser){
            --noOfPplConnected;
        }

        sock.broadcast.emit('usrlft',{
            username:sock.username,
            numUsers:noOfPplConnected
        })
    })


})


