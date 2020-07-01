const express = require('express');
const { stringify } = require('querystring');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


xssdangerous = ['&','/', '<', '>', "'", '"', "$","`"] //因为正则放弃了（） 【】 * ,因为冲突放弃了；#
// 被打断 顺序
function axss(astring)
{
    for (var i = 0; i < xssdangerous.length; i++) {//forget the g
        var regex = new RegExp(xssdangerous[i], "g");
        astring=astring.replace(regex,"&#"+xssdangerous[i].charCodeAt(0)+";")
    }
    return astring;
}
//放下去
// app.get('/', function (req, res) {
//     res.render('index.ejs');
// });

app.get('/', function (req, res) {
    res.render('index.ejs');
});

io.sockets.on('connection', function (socket) {
    socket.on('username', function (username) {
        socket.username = axss(username);
        io.emit('is_online', '🔵 <i>' + socket.username + ' 加入了群组..</i>');
    });

    socket.on('disconnect', function (username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' 离开了群组..</i>');
    })

    socket.on('chat_message', function (message) {
        io.emit('chat_message', "<strong>" + socket.username + "</strong>: " + axss(message));
    });

});

const server = http.listen(80, function () {
    console.log('listening on *:80');
});
