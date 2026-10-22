const crypto = require("crypto");

const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || crypto.randomBytes(32).toString("hex");
const TOKEN_TTL_SECONDS = 60 * 60 * 12;

const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");

const createToken = (role, subject) => {
  const payload = encode({ role, subject, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS });
  const signature = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
};

const verifyToken = (token) => {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest();
  let supplied;
  try {
    supplied = Buffer.from(signature, "base64url");
  } catch {
    return null;
  }
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return null;

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return claims.exp > Math.floor(Date.now() / 1000) ? claims : null;
  } catch {
    return null;
  }
};

const requireAuth = (req, res, next) => {
  const requestPath = req.originalUrl.split("?")[0];
  if (["/api/projectengineerlogin", "/api/siteadminlogin", "/api/estimatorlogin"].includes(requestPath)) {
    return next();
  }

  const authorization = req.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const claims = match ? verifyToken(match[1]) : null;
  if (!claims) {
    return res.status(401).json({ success: false, message: "A valid Bearer token is required" });
  }

  if (claims.role === "estimator") {
    if (req.method !== "GET") {
      return res.status(403).json({ success: false, message: "Estimators have read-only access" });
    }
  }

  req.auth = claims;
  next();
};

const requireProjectManager = (req, res, next) => {
  if (req.auth?.role !== "project_manager") {
    return res.status(403).json({ success: false, message: "Only project managers can manage projects" });
  }
  next();
};

module.exports = { createToken, requireAuth, requireProjectManager };
