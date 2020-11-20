const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Please add a note name"],
    trim: true,
    maxlength: [500, "Note name can't be more than 50 words"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Note", NoteSchema);
