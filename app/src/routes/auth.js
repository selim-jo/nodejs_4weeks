const express = require("express");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("./auth-middleware");

// 로그인 API(로그인 토큰 전달한 채로 조회했을 때)           
router.get("/auth", authMiddleware, (req, res) => {
    const user = res.locals.user;
    if (user){
        res.status(400).send({
            errorMessage: "이미 로그인이 되었습니다.",
        });
        return;
    }
});

// 로그인 API
router.post("/auth", async (req, res) => {
    try {
    // client쪽에서 nickname과 password를 body 통해 입력받음
    const { nickname, password } = req.body;
    // db에서 email과 password 찾아 user에 담음
    const user = await User.findOne({ nickname, password }).exec();
    // user가 없으면 응답으로 오류 발생(리턴 필수!!)
    if (!user) {
        res.status(400).send({
            errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
        });
        return;
    }
    // 로그인 성공 시 토큰 발급
    const token = jwt.sign({ userId: user.userId }, 'my-key');
    res.send({
        token,
    });
    } catch (err) {
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
        });
    }
});




// router 모듈 밖으로 내보내기
module.exports = router;