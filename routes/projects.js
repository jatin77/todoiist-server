const express = require("express");
const {
  getAllProjects,
  createProject,
  deleteProject,
  updateProject,
} = require("../controllers/projects");
const { protect } = require("../middleware/auth");

// Include other resources routers
const notesRouter = require("./notes");

const router = express.Router();

// Re-route into other resource router
router.use("/:projectId/notes", notesRouter);

router.route("/").get(protect, getAllProjects).post(protect, createProject);
router.route("/:id").delete(protect, deleteProject).put(protect, updateProject);

module.exports = router;
