const Project = require("../../model/projectengineer/projectassignmodel");

// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const { projectname ,title, description } = req.body;

    if (!projectname || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Project name, title, and description are required",
      });
    }

    const project = await Project.create({
      projectname,
      title,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// EDIT PROJECT
const editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectname ,title, description } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      {
        projectname,
        title,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE PROJECT
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ASSIGN PROJECT TO SITE ENGINEER
const assignProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { siteEngineer } = req.body;

    if (!siteEngineer) {
      return res.status(400).json({
        success: false,
        message: "Site engineer name is required",
      });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      {
        siteEngineer,
        isAssigned: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project assigned successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LIST PROJECTS
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjectCounts = async (req, res) => {
  try {
    const [totalProjects, assignedProjects, unassignedProjects] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ isAssigned: true }),
      Project.countDocuments({ isAssigned: false }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        assignedProjects,
        unassignedProjects,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAssignedProjects = async (req, res) => {
  try {
    const { siteEngineer } = req.query;
    const query = {
      isAssigned: true,
    };

    if (siteEngineer) {
      query.siteEngineer = siteEngineer;
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });

    if (projects.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No project available",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Assigned projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSiteEngineers = async (req, res) => {
  try {
    const engineers = await Project.distinct("siteEngineer", {
      siteEngineer: { $nin: [null, ""] },
    });

    res.status(200).json({
      success: true,
      data: engineers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  editProject,
  deleteProject,
  assignProject,
  getProjects,
  getProjectCounts,
  getAssignedProjects,
  getSiteEngineers,
};
