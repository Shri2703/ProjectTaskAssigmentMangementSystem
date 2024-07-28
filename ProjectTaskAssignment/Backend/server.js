const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const JWT_SECRET = 'secret123'
const PORT = process.env.PORT || 5000

// MongoDB Connection
mongoose
  .connect(
    'mongodb+srv://poornashri2703:jwtauth8777@cluster0.q4itzl8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err))

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], required: true },
})

const User = mongoose.model('User', userSchema)

// Project Schema
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const Project = mongoose.model('Project', projectSchema)

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const Task = mongoose.model('Task', taskSchema)

// Middleware for verifying JWT tokens
const authenticateJWT = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(' ')[1]

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }
      req.user = user
      next()
    })
  } else {
    res.sendStatus(401)
  }
}

// Middleware for authorizing admin roles
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.sendStatus(403)
  }
  next()
}

// Registration
app.post(
  '/register',
  [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    check('role')
      .isIn(['admin', 'member'])
      .withMessage('Role must be either admin or member'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password, role } = req.body

    try {
      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ message: 'User already exists' })
      }

      user = new User({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role,
      })
      await user.save()

      res.status(201).json({ message: 'User registered successfully' })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// Login
app.post(
  '/login',
  [
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password').not().isEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: '1h',
      })

      res.json({ token })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// Fetch All Users (Admin Only)
app.get('/users', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// CRUD for Projects
app.post('/projects', authenticateJWT, async (req, res) => {
  try {
    const { name, description } = req.body
    const project = new Project({ name, description, createdBy: req.user.id })
    await project.save()
    res.status(201).json(project)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/projects', authenticateJWT, async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id })
    res.json(projects)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.put('/projects/:id', authenticateJWT, async (req, res) => {
  try {
    const { name, description } = req.body
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    )
    res.json(project)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.delete('/projects/:id', authenticateJWT, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id)
    res.json({ message: 'Project deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// CRUD for Tasks
app.post('/tasks', authenticateJWT, async (req, res) => {
  try {
    const { title, description, status, projectId, assignedTo } = req.body
    const task = new Task({ title, description, status, projectId, assignedTo })
    await task.save()
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/tasks', authenticateJWT, async (req, res) => {
  try {
    const tasks = await Task.find().populate('projectId').populate('assignedTo')
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.put('/tasks/:id', authenticateJWT, async (req, res) => {
  try {
    const { title, description, status, projectId, assignedTo } = req.body
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, projectId, assignedTo },
      { new: true }
    )
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.delete('/tasks/:id', authenticateJWT, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id)
    res.json({ message: 'Task deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
