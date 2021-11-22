const crypto = require("crypto");

const sigHeaderName = "X-Hub-Signature-256";
const sigHashAlg = "sha256";

module.exports = function guard(req, res, next) {
  if (!process.env.SECRET) return next();
  console.log("checking auth token");
  if (!req.rawBody) {
    return next("Request body empty");
  }

  const sig = Buffer.from(req.get(sigHeaderName) || "", "utf8");
  const hmac = crypto.createHmac(sigHashAlg, process.env.SECRET);
  const digest = Buffer.from(
    sigHashAlg + "=" + hmac.update(req.rawBody).digest("hex"),
    "utf8"
  );
  if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
    return next(
      `Request body digest (${digest}) did not match ${sigHeaderName} (${sig})`
    );
  }
  console.log("passed");

  return next();
};
