const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')
const cors = require('cors')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const JWT_SECRET = process.env.JWT_SECRET || 'secret123'
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
  role: { type: String, enum: ['member'], required: true },
})

const User = mongoose.model('User', userSchema)

// Admin Schema
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

const Admin = mongoose.model('Admin', adminSchema)

// Project Schema
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
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

// File Schema
const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

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
const authorizeAdmin = async (req, res, next) => {
  const admin = await Admin.findById(req.user.id)
  if (!admin) {
    return res.sendStatus(403)
  }
  next()
}

// Hardcoded Admins
const hardcodedAdmins = [
  {
    name: 'Admin1',
    email: 'admin1@example.com',
    password: bcrypt.hashSync('password1', 10),
  },
  {
    name: 'Admin2',
    email: 'admin2@example.com',
    password: bcrypt.hashSync('password2', 10),
  },
]

// Initialize Admin Collection
const initializeAdmins = async () => {
  for (const admin of hardcodedAdmins) {
    const existingAdmin = await Admin.findOne({ email: admin.email })
    if (!existingAdmin) {
      await new Admin(admin).save()
    }
  }
}

initializeAdmins()

// Registration
app.post(
  '/register',
  [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ message: 'User already exists' })
      }

      user = new User({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: 'member',
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
      const user =
        (await User.findOne({ email })) || (await Admin.findOne({ email }))
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      const token = jwt.sign(
        { id: user._id, role: user.role || 'admin' },
        JWT_SECRET,
        {
          expiresIn: '1h',
        }
      )

      res.json({ token })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// Fetch All Members (Admin Only)
app.get('/members', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const members = await User.find({ role: 'member' })
    res.json(members)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// CRUD for Projects
app.post('/projects', authenticateJWT, authorizeAdmin, async (req, res) => {
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

app.put('/projects/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
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

app.delete(
  '/projects/:id',
  authenticateJWT,
  authorizeAdmin,
  async (req, res) => {
    try {
      await Project.findByIdAndDelete(req.params.id)
      res.json({ message: 'Project deleted' })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// CRUD for Tasks
app.post('/tasks', authenticateJWT, authorizeAdmin, async (req, res) => {
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

app.put('/tasks/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
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

app.delete('/tasks/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id)
    res.json({ message: 'Task deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// File upload endpoint (Admin Only)
// File upload endpoint (Admin Only)
app.post('/api/upload', authenticateJWT, authorizeAdmin, (req, res) => {
  const form = new formidable.IncomingForm()

  // Set upload directory
  form.uploadDir = path.join(__dirname, 'uploads')
  form.keepExtensions = true // Keep file extensions

  // Parse form data
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err)
      return res.status(500).json({ error: err.message })
    }

    console.log('Fields:', fields)
    console.log('Files:', files)

    // Check if file is present and is an array
    const fileArray = files.file
    if (!Array.isArray(fileArray) || fileArray.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    // Process the first file (adjust if multiple files are needed)
    const file = fileArray[0]
    console.log('File details:', file)

    // Ensure the file has a filepath
    const oldPath = file.filepath
    if (!oldPath) {
      console.error('File path is undefined')
      return res.status(400).json({ message: 'File path is undefined' })
    }

    const newFilename = file.originalFilename || 'uploaded_file'
    const newPath = path.join(form.uploadDir, newFilename)

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(form.uploadDir)) {
      fs.mkdirSync(form.uploadDir, { recursive: true })
    }

    // Move the file to the new path
    fs.rename(oldPath, newPath, async (err) => {
      if (err) {
        console.error('File rename error:', err)
        return res.status(500).json({ error: err.message })
      }

      // Save file details in MongoDB
      const fileDetails = new File({
        name: newFilename,
        path: newPath,
      })

      try {
        await fileDetails.save()
        res.status(201).json({ message: 'File uploaded successfully' })
      } catch (err) {
        console.error('Database save error:', err)
        res.status(500).json({ error: err.message })
      }
    })
  })
})





// File Schema

// Search API for projects and tasks
app.get('/search', authenticateJWT, async (req, res) => {
  try {
    const { q } = req.query
    const projects = await Project.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ],
      createdBy: req.user.id,
    })

    const tasks = await Task.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ],
    })

    res.json({ projects, tasks })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
