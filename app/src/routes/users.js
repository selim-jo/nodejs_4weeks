const express = require("express");
const User = require("../models/user");
const router = express.Router();
const Joi = require("joi");
const authMiddleware = require("./auth-middleware");

// 회원가입 API(로그인 토큰 전달한 채로 조회했을 때)           
router.get("/users", authMiddleware, (req, res) => {
    const user = res.locals.user;
    if (user){
        res.status(400).send({
            errorMessage: "이미 로그인이 되었습니다.",
        });
        return;
    }
});

// 회원가입 검증하기
const postUsersSchema = Joi.object({
    nickname: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    password: Joi.string().min(4).required(),
    confirmPassword: Joi.string().min(4).required(),
});

// 회원가입 API
router.post("/users", async (req, res) => {
    try{
        const { nickname, password, confirmPassword } = await postUsersSchema.validateAsync(req.body);
        // 패스워드와 패스워드 확인란 동일 여부 확인
        if (password !== confirmPassword){
            res.status(400).send({
                errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
            });
            return;
        }

        // if (password.includes(nickname))
        
        if (password.indexOf(nickname) > -1){
            res.status(400).send({
                errorMessage: "비밀번호에 닉네임이 포함되었습니다."
            });
            return;
        }
        // 이미 존재하는 사용자인지 확인
        const existUsers = await User.find({nickname});
        if (existUsers.length) {
            res.status(400).send({
                errorMessage: "중복된 닉네임입니다.",
            });
            return;
        };
        // user 정보를 데이터베이스에 저장
        const user = new User({ nickname, password });
        await user.save();
        res.status(201).send();
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "요청한 형식이 올바르지 않습니다.",
        });
    }
});

// router 모듈 밖으로 내보내기
module.exports = router;