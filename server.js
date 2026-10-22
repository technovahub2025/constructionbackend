require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const apiMiddleware = require("./middleware/apiMiddleware");
const { requireAuth, requireProjectManager } = require("./middleware/auth");
const { estimatorLogin, getEstimatorProjects } = require("./controller/projectengineer/estimatorcontroller");
const { login } = require("./controller/projectengineer/projectengineer");
const { sitelogin } = require("./controller/projectengineer/siteengineer");
const {
  createProject,
  editProject,
  assignProject,
  getProjects,
  getProjectCounts,
  getAssignedProjects,
} = require("./controller/projectengineer/projectdata");
const {
  createLabour,
  updateLabour,
  getLabours,
} = require("./controller/projectengineer/labourcontroller");
const {
  createMaterial,
  updateMaterial,
  getMaterials,
} = require("./controller/projectengineer/materialcontroller");
const {
  createMeasurement,
  updateMeasurement,
  getMeasurements,
} = require("./controller/projectengineer/measurementcontroller");
const {
  createClientIssue,
  getClientIssues,
} = require("./controller/projectengineer/issuecontroller");
const {
  getWorkflowPreview,
  submitWorkflow,
  approveWorkflow,
} = require("./controller/projectengineer/workflowcontroller");

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", apiMiddleware);
app.use("/api", requireAuth);

// Routes
app.post("/api/projectengineerlogin", login);
app.post("/api/siteadminlogin", sitelogin);
app.post("/api/estimatorlogin", estimatorLogin);
app.get("/api/estimator/projects", getEstimatorProjects);

app.post("/api/createproject", requireProjectManager, createProject);
app.put("/api/updateproject/:id", requireProjectManager, editProject);
app.put("/api/assignproject/:id", requireProjectManager, assignProject);
app.get("/api/getprojects", getProjects);
app.get("/api/getprojectcounts", getProjectCounts);
app.get("/api/getassignedprojects", getAssignedProjects);

app.post("/api/cretaelabour", createLabour);
app.put("/api/updatelabour/:id", updateLabour);
app.get("/api/getlabour", getLabours);

app.post("/api/creatematerial", createMaterial);
app.put("/api/updatematerial/:id", updateMaterial);
app.get("/api/getmaterial", getMaterials);

app.post("/api/createmaeasurment", createMeasurement);
app.put("/api/updatemeasurement/:id", updateMeasurement);
app.get("/api/getmeasurement", getMeasurements);

app.post("/api/submitissue", createClientIssue);
app.get("/api/getissue", getClientIssues);

app.get("/api/workflowpreview", getWorkflowPreview);
app.put("/api/submitworkflow", submitWorkflow);
app.put("/api/approveworkflow", requireProjectManager, approveWorkflow);

// Port from .env
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
