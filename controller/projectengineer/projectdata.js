const Project = require("../../model/projectengineer/projectassignmodel");
const PROJECT_TYPES = ["commercial", "industrial", "residential", "others"];
const PROJECT_STATUSES = ["accept", "reject", "hold", "pending"];

// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const { projectname, title, description, projectType, status } = req.body;

    if (!projectname || !title || !description || !projectType) {
      return res.status(400).json({
        success: false,
        message: "Project name, title, description, and project type are required",
      });
    }

    if (!PROJECT_TYPES.includes(String(projectType).toLowerCase())) {
      return res.status(400).json({ success: false, message: `Project type must be one of: ${PROJECT_TYPES.join(", ")}` });
    }
    const normalizedStatus = status === undefined ? undefined : String(status).toLowerCase();
    if (normalizedStatus && !PROJECT_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({ success: false, message: `Project status must be one of: ${PROJECT_STATUSES.join(", ")}` });
    }

    const project = await Project.create({
      projectname,
      title,
      description,
      projectType: String(projectType).toLowerCase(),
      ...(normalizedStatus ? { status: normalizedStatus } : {}),
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
    const { projectname, title, description, projectType, status } = req.body;
    if (projectType !== undefined && !PROJECT_TYPES.includes(String(projectType).toLowerCase())) {
      return res.status(400).json({ success: false, message: `Project type must be one of: ${PROJECT_TYPES.join(", ")}` });
    }
    const normalizedStatus = status === undefined ? undefined : String(status).toLowerCase();
    if (normalizedStatus !== undefined && !PROJECT_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({ success: false, message: `Project status must be one of: ${PROJECT_STATUSES.join(", ")}` });
    }

    const updates = {};
    if (projectname !== undefined) updates.projectname = projectname;
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (projectType !== undefined) updates.projectType = String(projectType).toLowerCase();
    if (normalizedStatus !== undefined) updates.status = normalizedStatus;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "Provide at least one project field to update" });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { $set: updates },
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
