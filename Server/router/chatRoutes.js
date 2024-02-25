const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteFun
} = require("../controller/chatController");

router.route("/").post(protect, accessChat).get(protect, fetchChats);
router.route("/group").post( createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupRemove").put(protect, removeFromGroup);
router.route("/groupAdd").put(protect, addToGroup);
router.delete("/delete",deleteFun)
module.exports = router;
