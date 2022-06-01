const express = require("express");
const Comment = require("../models/comment");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("./auth-middleware");

// 댓글 목록 조회 API
router.get("/boards/:boardId/comments", async (req, res) => {
    try{
        const comments = await Comment.find({boardId: req.params.boardId}).sort({ createdAt: -1});
        res.send({ comments })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 댓글 작성 API
router.post("/boards/:boardId/comments", authMiddleware, async (req, res) => {
    const { nickname } = res.locals.user;
    const { boardId } = req.params;
    const { comment } = req.body;
    if (!comment){
        return res.status(400).json({success: false, errorMessage: "댓글 내용을 입력해주세요"});

    }
    const createdComment = await Comment.create({ boardId, nickname, comment });
    res.json({ comment: createdComment });
});

// 댓글 수정 API
router.patch('/boards/:boardId/comments/:commentId', authMiddleware, async (req, res) => {
    const { boardId } = req.params;
    const { comment } = req.body;
    const comments = await Comment.find({ boardId });
    if (![comments])  {
        return res.status(404).json({ success: false, errorMessage: "댓글이 없습니다."});
    }
    await Comment.updateOne({ _id: req.params.commentId }, { $set: { comment } });
    res.status(201).json({ success: true, message: "수정 완료하였습니다."});
});


// 댓글 삭제 API
router.delete('/boards/:boardId/comments/:commentId', authMiddleware, async (req, res) => {
    const { boardId } = req.params;
    const comments = await Comment.find( { boardId });
    if (![comments]) {
        return res.status(404).json({ success: false, errorMessage: "댓글이 없습니다."});
    }
    await Comment.deleteOne({ _id: req.params.commentId });
    res.json({ success: true });
});

// router 모듈 밖으로 내보내기
module.exports = router;