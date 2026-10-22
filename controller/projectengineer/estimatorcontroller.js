const Project = require("../../model/projectengineer/projectassignmodel");
const { createToken } = require("../../middleware/auth");

const estimatorLogin = async (req, res) => {
  const { phone, password } = req.body;
  const expectedPhone = process.env.ESTIMATOR_PHONE;
  const expectedPassword = process.env.ESTIMATOR_PASSWORD;

  if (!phone || !password) {
    return res.status(400).json({ success: false, message: "Phone and password are required" });
  }
  if (!expectedPhone || !expectedPassword) {
    return res.status(503).json({ success: false, message: "Estimator credentials are not configured" });
  }
  if (phone !== expectedPhone || password !== expectedPassword) {
    return res.status(401).json({ success: false, message: "Invalid estimator credentials" });
  }

  return res.status(200).json({
    success: true,
    message: "Estimator login successful",
    user: { role: "estimator", phone: expectedPhone },
    token: createToken("estimator", expectedPhone),
  });
};

const getEstimatorProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { estimatorLogin, getEstimatorProjects };
