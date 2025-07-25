const crypto = require("crypto");
import config from '@src/configs/app.config'


export const validateOneGameHubHash = (SECRET_SALT = config.get('gameHub1.hmacSalt')) => {
    return (req, res, next) => {
        try {
            const queryParams = { ...req.query }; // Get query parameters
            const receivedHash = queryParams.hash; // Extract the hash
            if (!receivedHash) {
                return res.status(401).json({ status: 401, error: { code: "ERR006", message: "Unauthorized request.", display: false, action: "restart" } });
            }

            delete queryParams.hash; // Remove hash from query

            // Sort parameters alphabetically
            const sortedParams = Object.keys(queryParams)
                .sort()
                .map(key => `${key}=${queryParams[key]}`)
                .join("&");

            // Generate HMAC SHA-256 hash
            const computedHash = crypto
                .createHmac("sha256", SECRET_SALT)
                .update(sortedParams)
                .digest("hex");

            // Compare hashes
            if (computedHash !== receivedHash) {
                return res.status(401).json({ status: 401, error: { code: "ERR006", message: "Unauthorized request.", display: false, action: "restart" } });
            }

            next(); // Proceed if hash is valid
        } catch (error) {
            console.error("Hash validation error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}