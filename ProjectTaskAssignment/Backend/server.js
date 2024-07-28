


const express = require('express');
const mongoose = require('mongoose');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Project = mongoose.model('Project', projectSchema);

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Task = mongoose.model('Task', taskSchema);

mongoose.connect(
  'mongodb+srv://poornashri2703:poorna8777@cluster0.wijm5gs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

app.use(express.json());

// Middleware for authentication
const auth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!user) throw new Error();
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// User registration
app.post('/api/users/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// User login
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create project
app.post('/api/projects', auth, async (req, res) => {
  const project = new Project({ ...req.body, user: req.user._id });
  try {
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read all projects
app.get('/api/projects', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id });
    res.send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read single project
app.get('/api/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).send();
    res.send(project);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update project
app.patch('/api/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).send();
    res.send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete project
app.delete('/api/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).send();
    res.send(project);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create task
app.post('/api/tasks', auth, async (req, res) => {
  const task = new Task({ ...req.body, user: req.user._id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read all tasks
app.get('/api/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read single task
app.get('/api/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update task
app.patch('/api/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete task
app.delete('/api/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// File upload endpoint
app.post('/api/upload', auth, (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, 'uploads');
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const oldPath = files.file.path;
    const newPath = path.join(form.uploadDir, files.file.name);

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: 'File uploaded successfully', file: files.file });
    });
  });
});

// Search projects
app.get('/api/projects/search/:query', auth, async (req, res) => {
  try {
    const query = req.params.query;
    const projects = await Project.find({
      user: req.user._id,
      $or: [{ name: new RegExp(query, 'i') }, { description: new RegExp(query, 'i') }],
    });
    res.send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Search tasks
app.get('/api/tasks/search/:query', auth, async (req, res) => {
  try {
    const query = req.params.query;
    const tasks = await Task.find({
      user: req.user._id,
      $or: [{ name: new RegExp(query, 'i') }, { description: new RegExp(query, 'i') }],
    });
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
