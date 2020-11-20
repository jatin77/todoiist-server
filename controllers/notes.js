const Project = require("../models/Project");
const Note = require("../models/Note");

// @desc      Get all notes of particular project
// @route     GET /api/v1/projects/:id/notes
// @access    Private
exports.getNotes = async (req, res, next) => {
  try {
    let notes = [];
    if (req.params.projectId) {
      const project = await Project.findById(req.params.projectId);

      if (!project) {
        return res.status(500).json({
          success: false,
          error: `Project ${req.params.projectId} not found`,
        });
      }
      if (req.user.id.toString() !== project.user.toString()) {
        return res.status(400).json({
          success: false,
          error: `Invalid request`,
        });
      }
      notes = await Note.find({ project: req.params.projectId });
    } else {
      notes = await Note.find({ user: req.user.id });
    }

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// @desc      Create a note
// @route     POST /api/v1/projects/:id/notes
// @access    Private
exports.createNote = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(500).json({
        success: false,
        error: `Project ${req.params.projectId} was not found.`,
      });
    }

    if (req.user.id.toString() !== project.user.toString()) {
      return res.status(400).json({
        success: false,
        error: `Invalid request`,
      });
    }

    req.body.project = req.params.projectId;
    req.body.user = req.user.id;

    const note = await Note.create(req.body);

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// @desc      Update a note
// @route     UPDATE /api/v1/notes/:id
// @access    Private
exports.updateNote = async (req, res, next) => {
  try {
    const project = await Project.findById(req.body.project);

    if (!project) {
      return res.status(500).json({
        success: false,
        error: `Project ${req.params.projectId} was not found.`,
      });
    }

    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(400).json({
        success: false,
        error: `Note ${req.params.id} not found`,
      });
    }

    if (req.user.id.toString() !== project.user.toString()) {
      return res.status(400).json({
        success: false,
        error: `Invalid request`,
      });
    }

    const inputNote = {
      description: req.body.description,
      createdAt: req.body.createdAt,
      project: req.body.project,
    };

    note = await Note.findByIdAndUpdate(req.params.id, inputNote, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// @desc      Delete a note
// @route     DELETE /api/v1/notes/:id
// @access    Private
exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(400).json({
        success: false,
        error: `Note ${req.params.id} not found`,
      });
    }

    note.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};
