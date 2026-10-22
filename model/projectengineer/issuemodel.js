const mongoose = require("mongoose");

const clientIssueSchema = new mongoose.Schema(
  {
    issueText: {
      type: String,
      required: [true, "Issue text is required"],
      trim: true,
    },

    images: {
      type: [String], // Base64 image strings
      validate: {
        validator: function (images) {
          return images.length <= 3;
        },
        message: "Maximum 3 images are allowed",
      },
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ClientIssue", clientIssueSchema);