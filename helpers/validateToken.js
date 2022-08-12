const jwt = require("jsonwebtoken");
function collectToken(req) {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        return req.headers.authorization.split(" ")[1];
    }
    return null
}

module.exports = isLoggedIn = async (req, res, next) => {
    const token = collectToken(req)
    if (!token) {
        return res.status(401).json({
            success: false,
            massage: "Authorization token is not provided"
        })
    }
    jwt.verify(token, "secret", (err, payload) => {
        console.log(err)
        if (err) {
            return res.status(401).json({
                success: false,
                massage: "Authorization token error"
            })
        }
        req.payload = payload
        next()
    })
}