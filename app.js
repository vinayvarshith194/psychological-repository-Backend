const express = require("express");
// const https = require('https');
const http = require("http");
const cors = require("cors");

global.validate = require("express-validation");
global.env = require("dotenv").config();
const app = express();
global.fs = require("fs");
global.stdCodes = require("./config/error_codes"); //Error Codes Config File
global.jwt = require("jsonwebtoken");
const socketIo = require("socket.io");
// global.bcrypt = require('sha256');
const server = http.createServer(app);
const io = socketIo(server);
const db = require("./config/socket_db");

global.validate = require("express-validation");
const bodyParser = require("body-parser");
const useragent = require("express-useragent");
global.logger = require("./config/logger");
global.path = require("path");
global.bcrypt = require("bcryptjs");
global.async = require("async");
global.sqldb = require("./config/dbconnect"); //To establish a connection to particular DB
global.dbutil = require("./utils/dbutils"); //Execute Query
global.multer = require("multer"); //file upload Module
global.upload = multer(); //file upload Module
global.moment = require("moment");
process.env["NO_PROXY"] = "*";
// //global.email_service = require('./utils/mail_services'); //send a E-mail from AWS-SES //
app.use(express.static(__dirname + "/react-native-app"));

app.use(useragent.express());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use(express.static("public"));
app.use(logErrors);
app.use("/filestorage", express.static(path.join(__dirname, "/filestorage")));
app.use(cors());

app.use(function (req, res, next) {
  // console.log(req.headers.origin,"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%^^^")
  logger.info("Requested URL : ", req.header);
  console.info(`Requested URL---: ${req.url}`);
  logger.info(req.url);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Accept,authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  if ("OPTIONS" == req.method || req.url == "/favicon.ico") {
    return res.status(200).send("OK");
  } else {
    next();
  }
});
// app.use(express.static('public'));
// app.use(logErrors);

app.use("/", require("./routes/routes"));
app.use((err, req, res, next) => {
  if (err instanceof validate.ValidationError) {
    res.status(err.status).json(err);
  } else {
    res.status(500).json({
      status: err.status,
      message: err.message,
    });
  }
});
function logErrors(err, req, res, next) {
  logger.error(err.stack);
  next(err);
}
app.get("/", function (req, res) {
  res.send("SafeMind APP Api server is listening");
});

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("getMessagesGroup", (group_number) => {
    // socket.join(groupId);
    socket.join(group_number);
    console.log(group_number.group_number, "group_number");
    // Retrieve messages between sender and receiver from the database
    db.query(
      "SELECT * FROM safemind_messages_group WHERE (group_number = ? ) ORDER BY created_at ASC;",
      [group_number.group_number],
      (err, results) => {
        if (err) {
          console.error("Error retrieving messages:", err);
        } else {
          console.error(" messages:", results);
          if (group_number) {
            socket.emit("allMessagesGroup", results);
          }
          console.log("get all Groupmessage");
          return;
        }
      }
    );
    // console.log(`User ${socket.id} joined group ${groupId}`);
  });

  socket.on(
    "sendMessageGroup",
    ({ group_number, reciverid, message, name }) => {
      // io.to(groupId).emit('receiveMessageGroup', { groupId, message });
      console.log(group_number, reciverid, message, name, "message");
      
  let current_timestamp = moment().format("yyyyMMDDHHmmss");
      db.query(
        "INSERT INTO safemind_messages_group (group_number,reciverid, message,name,created_at) VALUES (?, ?, ?,?,?)",
        [group_number, reciverid, message, name,current_timestamp],
        (err, result) => {
          if (err) {
            console.error("Error inserting message:", err);
          } else {
            if (group_number) {
              io.emit("receiveMessageGroup", {
                group_number,
                reciverid,
                message,
                name,
              });
            }
       

            return;
          }
        }
      );
    }
  );
});


// Start server
server.listen(8000, () => {
    const [host, port] = [server.address().address, server.address().port];
    logger.debug(`safemind APP API server is listening at http://${host}:${port}`);
  });