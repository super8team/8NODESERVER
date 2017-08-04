var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);  // 80 포트로 소켓을 엽니다
var mysql = require("mysql");
var FCM = require('fcm-push');
// var fs = require('fs');
var PORT = process.env.PORT || 8000;

var pool = mysql.createPool({

    host :'localhost',

    port : 3306,

    user : 'root',

    password : '',

    database:'learnfun',

    connectionLimit:20,

    waitForConnections:false

});
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

  socket.on('saveTheToken', function (data) {//fcm 토큰을 받아와서 db에 저장
    console.log(data);
pool.getConnection(function(err,connection){
//     tokenObj.put("token",token);
// tokenObj.put("name",userPreferences.getUserName());
// tokenObj.put("school",userPreferences.getUserSchool());
// tokenObj.put("grade",userPreferences.getUserGrade());
// tokenObj.put("class",userPreferences.getUserClass());
// tokenObj.put("userType",userPreferences.getUserType());

var insertQuery = "INSERT INTO fcm SET ?";
var selectQuery = "select token from fcm where token = '"+data.token+"'";
//소켓으로 받은 데이터를 db에서 조회해서 id값이 있으면 업데이트 없으면 인설트
var query = connection.query(selectQuery,function(error,results){
      console.log(results[0]);
         if(results[0] == undefined){
            console.log(results[0]);
           connection.query(insertQuery,data,function(error,results){});

         }

    });
    connection.release(); // 커넥션을 풀로 되돌림
  });


})

  socket.on('sendMsg', function (data) {//교사가 학생에게 메시지를 보냄

    console.log(data);

    var tokens;

    pool.getConnection(function(err,connection){

    var serverKey = 'AAAAZFdBtjY:APA91bGXkopthR5vSKk3F6UZem0Zx_nk8NdF9a4dmF_qVYe3LjdOYqc1bejk5phQtp85f5zOaTle7-oeMbnHlJR470rTb-BrjiPeKh6xNp2-Q1YIBd5o5sMFlg4FMpKONfMy8_g9yp1J';
    var fcm = new FCM(serverKey);

    var selectQuery = "select token from fcm where school='"+data.school+"' and grade=''"+data.grade+"' and class='"+data.class+"'";
    var query = connection.query(selectQuery,function(error,results){
      tokens = results;
      console.log(results);
      console.log(error);

      for(var i =0 ; i < tokens.length ;i++){

        var message = {
         to: tokens[i].token, //registration_token_or_topics
         // required fill with device token or topics
         collapse_key: 'your_collapse_key',
         data: {
            your_custom_data_key: 'your_custom_data_value'
          },
         notification: {
            title: '공지사항',
            body: data.msg
          }
        }; //callback style

         fcm.send(message, function(err, response){
           if (err) {
              console.log("Something has gone wrong!");
         } else {
           console.log("Successfully sent with response: ", response);
         }
       });

      }

    });





    connection.release(); // 커넥션을 풀로 되돌림
    });
  });


  socket.on('disconnection', function(){
      console.log("closed!!!");
      });
});
