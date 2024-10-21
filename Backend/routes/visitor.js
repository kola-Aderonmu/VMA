const express = require("express");
const {
  getVisitors,
  createVisitor,
  checkVisitors,
  getVisitorsByDate,
} = require("../controller/visitor");
const router = express.Router();

router.route("/").get(getVisitors).post(createVisitor);
router.route("/checkUser").get(checkVisitors);
router.route("/report").get(getVisitorsByDate);

module.exports = router;
