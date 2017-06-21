var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);  // 80 포트로 소켓을 엽니다
var mysql = require("mysql");
var fs = require('fs');
var PORT = process.env.PORT || 8000;
var post;
var posData;
// var connection = mysql.createConnection({
//
//     host : "localhost",
//
//     port : 3306,
//
//     user : "root",
//
//     password : "1111",
//
//     database : "test"
//
// });
//mysql connection pool 생성
var pool = mysql.createPool({

    host :'localhost',

    port : 3306,

    user : 'root',

    password : '',

    database:'learnfun',

    connectionLimit:20,

    waitForConnections:false

});
//제이슨 형태의 배열로 만든다
var class1 = new Array();
var class2 = new Array();
var class3 = new Array();
//학생의 gps를 받으면 그 학생이 몇반인지를 체크하여
//제이슨 오브젝트로 만든다
var student1 = {
  name : "김봉춘",
  lat : 35.897532,
  lng : 128.622696,
  gender : "M",
  class : "1"
};

var student2 = {
  name : "이기춘",
  lat : 35.896664,
  lng : 128.619985,
  gender : "F",
  class : "1"
};
var student3 = {
  name : "함초롬",
  lat : 35.894991,
  lng : 128.619800,
  gender : "F",
  class : "1"
};
var student4 = {
  name : "강물맑음",
  lat : 35.894930,
  lng : 128.621581,
  gender : "F",
  class : "1"
};
var student5 = {
  name : "정수철",
  lat : 35.895877,
  lng : 128.623480,
  gender : "F",
  class : "1"
};
//여기부터 2반
var student6 = {
  name : "김봄",
  lat : 35.891765,
  lng : 128.614243,
  gender : "M",
  class : "2"
};
var student7 = {
  name : "이여름",
  lat : 35.897884,
  lng : 128.608298,
  gender : "F",
  class : "2"
};
var student8 = {
  name : "박가을",
  lat : 35.896494,
  lng : 128.624048,
  gender : "F",
  class : "1"
};
var student9 = {
  name : "정겨울",
  lat : 35.897598,
  lng : 128.622160,
  gender : "F",
  class : "1"
};
var student10 = {
  name : "김소피아",
  lat : 35.896077,
  lng : 128.621977,
  gender : "F",
  class : "1"
};
//여기부터 3반
var student11 = {
  name : "이산",
  lat : 35.895238,
  lng : 128.622741,
  gender : "F",
  class : "3"
};
var student12 = {
  name : "김바다",
  lat : 35.893233,
  lng : 128.624808,
  gender : "F",
  class : "3"
};
var student13 = {
  name : "양초원",
  lat : 35.897433,
  lng : 128.621322,
  gender : "F",
  class : "1"
};
var student14 = {
  name : "심들판",
  lat : 35.895938,
  lng : 128.621408,
  gender : "F",
  class : "1"
};
var student15 = {
  name : "강사막",
  lat : 35.897042,
  lng : 128.622427,
  gender : "F",
  class : "1"
};
//제이슨배열안에 제이슨객체를 넣는다
class1.push(student1);
class1.push(student2);
class1.push(student3);
class1.push(student4);
class1.push(student5);
class2.push(student6);
class2.push(student7);
class2.push(student8);
class2.push(student9);
class2.push(student10);
class3.push(student11);
class3.push(student12);
class3.push(student13);
class3.push(student14);
class3.push(student15);
//새로운 제이슨객체를 만들어서 특정 이름으로 제이슨 배열을 넣는다
var wrapClass1 = {
  class : class1
};
var wrapClass2 = {
  class : class2
};
var wrapClass3 = {
  class : class3
};

// app.get('/', function (req,res) {
//    if (req.headers.cookie) {
//    res.send('<h1> 잘못된 접근입니다 </h1>');
//    } else {
//     fs.createReadStream('./client.html').pipe(res);
//    };
// });
// app.get('/socket.io.js', function (req,res) {
//    if (req.headers.cookie) {
//    res.send('<h1> 잘못된 접근입니다 </h1>');
//    } else {
//     fs.createReadStream('./socket.io.js').pipe(res);
//    };
// });
// app.get('/jquery', function (req,res) {
//    if (req.headers.cookie) {
//    res.send('<h1> 잘못된 접근입니다 </h1>');
//    } else {
//     fs.createReadStream('./admin/jquery-2.2.2.min.js').pipe(res);
//    };
// });
// //connection.connect();

http.listen(PORT,function(){
  console.log("server on!");
});
  //소켓에 접속
io.sockets.on('connection', function (socket) { // connection이 발생할 때 핸들러를 실행합니다.

console.log('server running at 8000 port');


//클라이언트에서 my other evnet 라는 호출이 오면
socket.on('class1', function (data) { // 클라이언트에서 my other event가 발생하면 데이터를 받습니다.
  //db에 연결
  //pool.getConnection(function(err,connection){


      console.log(data);
      // var pos = {
      //   cid : data.id,
      //   lat : data.lat,
      //   lng : data.lng
      // };
      // posData = data;
      // //각각의 쿼리문
      //  var insertQuery = "INSERT INTO pos SET ?";
      //  var selectQuery = "select cid from pos where cid='"+data.id+"'";
      //  var post = pos;
      //  var updateQuery = "update pos set lat='"+data.lat+"',lng='"+data.lng+"' where cid='"+data.id+"'";
      //  function callback(err,result){
       //
      //     if(err){
       //
      //          throw err
       //
      //      }
       //
      //      console.log("Insert Complete!");
       //
      //      console.log(query.sql);
       //
      //  }

      //소켓으로 받은 데이터를 db에서 조회해서 id값이 있으면 업데이트 없으면 인설트
      // var query = connection.query(selectQuery,function(error,results){
      //
      //   if(results[0] == undefined){
      //     if(pos.cid != null){
      //      var query = connection.query(insertQuery,post, function(error,results){
      //
      //      });
      //    }
      //   }else{
      //     var query = connection.query(updateQuery, function(error,results){
      //
      //     });
      //   }
      //
      // });

        console.log("브로프캐스트보낸다!");
       //socket.broadcast.emit('getclass1', wrapClass1);   //전체클라이언트에 gps 이벤트를 보냅니다.
       socket.emit('getclass', wrapClass1);
       console.log("브로프캐스트보냈다!");

      //connection.release(); // 커넥션을 풀로 되돌림
    //})
   });
   socket.on('class2', function (data) {
     socket.emit('getclass', wrapClass2);
   });
  //  socket.on('connection', function (data) {
  //    console.log(data);
  //  });


   socket.on('class3', function (data) {
     socket.emit('getclass', wrapClass3);
   });

   var child1 = {
     name : "박성원",
     lat : 35.891765,
     lng : 128.614243,
     gender : "M",
     class : "2"
   };

   var child = {
     child : child1
   };
   socket.on('kidGPS', function (data) {
     console.log(data);
     console.log("kidGPS IN");
     socket.emit('getKidGPS', child);
     //socket.broadcast.emit('getKidGPS', child);   //전체클라이언트에 gps 이벤트를 보냅니다.
     console.log("child 보냈습니다 : " + child);
   });
   socket.on('studentGPS', function (data) {
     console.log(data);
   });

   socket.on('childGPS', function (data) {
    console.log(data);
    console.log("childGPS IN");
    pool.getConnection(function(err,connection){
      console.log("DB connected");
       var selectStudentGradeQuery = "select student.grade_class from student,users where user.no = student.student and user.id='"
       +data.id+"'";
       //받은 정보의 아이디를 가지고 학반을 조회 한 뒤 각 반별로 데이터를 정리함
       var query = connection.query(selectStudentGradeQuery,function(error,results){

         console.log(query);

       });
    })
   });
// socket.on('plzgps', function () {
//
//   socket.emit('gps', posData);   //클라이언트에 gps 이벤트를 보냅니다.
//
// });
//socket.emit('my other event', { lat : pos.coords.latitude , lng : pos.coords.longitude });   //서버에 my other event 이벤트를 보냅니다.

});
 io.sockets.on('disconnection', function(){
   console.log("closed!!!");
   connection.end();
   });
