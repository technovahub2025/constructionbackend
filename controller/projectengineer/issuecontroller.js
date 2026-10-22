const ClientIssue = require("../../model/projectengineer/issuemodel");

// Create Issue
const createClientIssue = async (req, res) => {
  try {
    const { issueText, images = [] } = req.body;

    // Validate issue text
    if (!issueText || issueText.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Issue text is required",
      });
    }

    // Validate images array
    if (!Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: "Images must be an array",
      });
    }

    // Maximum 3 images
    if (images.length > 3) {
      return res.status(400).json({
        success: false,
        message: "Maximum 3 images are allowed",
      });
    }

    // Validate Base64 format
    const base64Regex =
      /^data:image\/(jpeg|jpg|png|gif|webp);base64,[A-Za-z0-9+/=]+$/;

    for (const image of images) {
      if (!base64Regex.test(image)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Base64 image format",
        });
      }
    }

    // Create issue
    const issue = await ClientIssue.create({
      issueText: issueText.trim(),
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Issue submitted successfully",
      data: issue,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Issues
const getClientIssues = async (req, res) => {
  try {
    const issues = await ClientIssue.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Issue
const getClientIssueById = async (req, res) => {
  try {
    const issue = await ClientIssue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Issue
const deleteClientIssue = async (req, res) => {
  try {
    const issue = await ClientIssue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    await issue.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createClientIssue,
  getClientIssues,
  getClientIssueById,
  deleteClientIssue,
};