const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectname: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    projectType: {
      type: String,
      enum: ["commercial", "industrial", "residential", "others"],
      required: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Hold", "Pending", "Accept", "Reject"],
      default: "Pending",
    },
    siteEngineer: {
      type: String,
      default: null,
    },
    isAssigned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
