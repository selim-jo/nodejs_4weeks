const express = require("express");
const { equal } = require("joi");
const Board = require("../models/boards");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("./auth-middleware");
const boards = require("../models/boards");
const res = require("express/lib/response");

// 전체 게시글 목록 조회 API
router.get("/boards", async (req, res) => {
    try{
        const boards = await Board.find({}).sort({ createdAt: -1});
        res.send({ boards});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 게시글 작성 API
router.post("/boards", authMiddleware, async (req, res) => {
    const { nickname } = res.locals.user;
    const { title, content } = req.body;
    const createdBoards = await Board.create({ nickname, title, content });
    res.send({ result: "게시글을 생성하였습니다."});
}); 

// 게시글 조회 API
router.get("/boards/:boardId", authMiddleware, async (req, res) => {
    const board = await Board.findOne({_id: req.params.boardId});
    if (!board){
        res.status(404).send({});
    } else {
        res.json({ board });
    }
});

// 게시글 수정 API
router.patch('/boards/:boardId', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    const board = await Board.findOne({ _id: req.params.boardId });
    if (![board])  {
        return res.status(404).json({ success: false, errorMessage: "게시글이 없습니다."});
    }
    await Board.updateOne({ _id: req.params.boardId }, { $set: { title, content } });
    res.status(201).json({ success: true, message: "수정 완료하였습니다."});
});

// 게시글 삭제 API
router.delete('/boards/:boardId', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    const board = await Board.findOne( { _id: req.params.boardId });
    if (![board]) {
        return res.status(404).json({ success: false, errorMessage: "게시글이 없습니다."});
    }
    await Board.deleteOne({ _id: req.params.boardId });
    res.json({ success: true });
});

// router 모듈 밖으로 내보내기
module.exports = router;