"use strict";

// 모듈
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./src/models/user"); // User 스키마
const Board = require("./src/models/boards"); // Board 스키마
const Comment = require("./src/models/comment"); // Comment 스키마
const bodyParser = require("body-parser"); // req.body 데이터를 사용자가 원하는데로 파싱
const authMiddleware = require("./src/routes/auth-middleware");
const dotenv = require("dotenv"); // nodes.js 서버의 포트, DB관리 정보들을 관리할 수 있게함
dotenv.config();

// 데이터베이스 세팅
mongoose.connect(process.env.MongoDB_URI, {
    dbName: "4weeks_test",
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// 라우팅
const usersRouter = require("./src/routes/users");
const authRouter = require("./src/routes/auth");
const boardsRouter = require("./src/routes/boards");
const commentsRouter = require("./src/routes/comments");

// use -> 미들웨어를 등록해주는 메서드
app.use(express.json());
app.use("/api", express.urlencoded({ extended: false }), [usersRouter, authRouter, boardsRouter, commentsRouter]);

module.exports = app;