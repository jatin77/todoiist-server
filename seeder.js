const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const Project = require("./models/Project");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
const projects = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/projects.json`, "utf-8")
);

// Import data
const importData = async () => {
  try {
    await Project.create(projects);
    console.log("Data imported.....");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Project.deleteMany();
    console.log("Data deleted.....");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
