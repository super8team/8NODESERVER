var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);  // 80 포트로 소켓을 엽니다
// var fs = require('fs');
var PORT = process.env.PORT || 8000;


http.listen(PORT,function(){
  console.log("server on!");
});

  //소켓에 접속
io.sockets.on('connect', function (socket) { // connection이 발생할 때 핸들러를 실행합니다.

  console.log('server running at 8000 port'+socket.id);



  socket.on('teacherGPSToServer', function (data) {//교사폰에서 gps를 받아옴, 학생에게 보내줌
     console.log(data);
     socket.broadcast.emit('teacherGPSToStudent', data);
  });

  socket.on('studentGPSToServer', function (data) {//학생폰에서 gps를 받아옴, 교사에게 보내줌
     console.log(data);
     socket.broadcast.emit('studentGPSToTeacher', data);
  });

  socket.on('childGPSToServer', function (data) {//학생폰에서 gps를 받아옴, 학부모에게 보내줌
    console.log(data);
    socket.broadcast.emit('childGPSToParents', data);
  });

  socket.on('disconnection', function(){
      console.log("closed!!!");
      });
});
