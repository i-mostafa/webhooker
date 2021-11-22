require("./configLoader")("../config.json");

const express = require("express");
const guard = require("./guard");
const processHandler = require("./processHandler");
const { logHookReq } = require("./utils");

const app = express();

app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || "utf8");
      }
    },
  })
);

app.post("/webhook/deploy", guard, (req, res, next) => {
  logHookReq(req.body);
  processHandler(req.body);

  res.json({ status: "done" });
});

app.listen(process.env.PORT, () => {
  console.log("service is running on", process.env.PORT);
});
