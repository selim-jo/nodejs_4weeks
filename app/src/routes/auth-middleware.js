const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
    // headers 안에 authorization 요청
    const { authorization } = req.headers;
    // authorization을 공백 기준으로 구분해서 tokenType과 tokenValue 값 추출 
    const [tokenType, tokenValue] = authorization.split(' ');
    // tokenType이 Bearer가 아니면 탈출
    if (tokenType !== "Bearer") {
        res.status(401).send({
            errorMessage: "로그인이 필요합니다.",
        });
        return;
    }

    // 토큰 검증
    try {
        const { userId } = jwt.verify(tokenValue, "my-key");
        User.findById(userId).exec().then((user) => {
            // user가 있는데 가져와서 locals라는 공간에 담음 -> 이거는 이 미들웨어를 사용하는 다른 곳에서도 사용 가능(즉, 전역에서 사용가능한 변수가 되었다는 것)
            res.locals.user = user;
            next();
        });
    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인이 필요합니다",
        });
        return;
    }
};