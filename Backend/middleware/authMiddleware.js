import jwt from 'jsonwebtoken'


const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = decoded;
            next();
        } catch (error) {
            console.error("JWT Verification Error:", error.message); // ✅ Debug Log
            return res.status(401).json({ message: "Invalid Token" });
        }
    } else {
        return res.status(401).json({ message: "Access Denied, No Token Provided" });
    }
};

export default protect;