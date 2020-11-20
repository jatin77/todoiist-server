const Project = require("../models/Project");

// @desc      Get all projects
// @route     GET /api/v1/projects
// @access    Private
exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.log(error);
  }
};

// @desc      Create a project
// @route     POST /api/v1/projects
// @access    Private
exports.createProject = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const project = await Project.create(req.body);

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// @desc      Update a project
// @route     UPDATE /api/v1/projects/:id
// @access    Private
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(400).json({
        success: false,
        error: `No such project found ${req.params.id}`,
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      project: project,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// @desc      Delete a project
// @route     DELETE /api/v1/projects/:id
// @access    Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(400).json({
        success: false,
        error: `No such project found ${req.params.id}`,
      });
    }

    project.remove();

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
