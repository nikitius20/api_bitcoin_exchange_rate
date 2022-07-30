const { Router } = require("express");
const router = Router();
const Controller = require("./Controller");

router.get("/rate", Controller.GetCurrentBTC);
router.post("/subscribe", Controller.SubscribeMail);
router.post("/sendEmails", Controller.SendMails);

module.exports = router;
