const express = require("express");
const {
  getNotes,
  createNote,
  deleteNote,
  updateNote,
} = require("../controllers/notes");
const { protect } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.route("/").get(protect, getNotes).post(protect, createNote);
router.route("/:id").put(protect, updateNote).delete(protect, deleteNote);

module.exports = router;
