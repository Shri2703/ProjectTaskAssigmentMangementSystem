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

// Member Schema
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['member'], default: 'member' },
})

const Member = mongoose.model('Member', memberSchema)

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
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
})

const Task = mongoose.model('Task', taskSchema)

// File Schema
const fileSchema = new mongoose.Schema(
  {
    name: String,
    path: String,
    mimetype: String,
    size: Number,
  },
  { timestamps: true }
)

const File = mongoose.model('File', fileSchema)

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
      let member = await Member.findOne({ email })
      if (member) {
        return res.status(400).json({ message: 'Member already exists' })
      }

      member = new Member({
        name,
        email,
        password: await bcrypt.hash(password, 10),
      })
      await member.save()

      res.status(201).json({ message: 'Member registered successfully' })
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
      const member =
        (await Member.findOne({ email })) || (await Admin.findOne({ email }))
      if (!member) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      const isMatch = await bcrypt.compare(password, member.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      const token = jwt.sign(
        { id: member._id, role: member.role || 'admin' },
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
app.get('/members', async (req, res) => {
  try {
    const members = await Member.find()
    res.json(members)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/members/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
    if (!member) {
      return res.status(404).json({ message: 'Member not found' })
    }
    res.json(member)
  } catch (error) {
    console.error('Error fetching member:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})
app.put('/members/:id', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const updatedFields = { name, email }

    if (password) {
      const salt = await bcrypt.genSalt(10)
      updatedFields.password = await bcrypt.hash(password, salt)
    }

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      {
        new: true,
      }
    ).select('-password')

    if (!member) return res.status(404).json({ message: 'Member not found' })

    res.json(member)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// CRUD for Projects
app.post('/projects', async (req, res) => {
  try {
    const { name, description, createdBy } = req.body
    const project = new Project({ name, description, createdBy })
    await project.save()
    res.status(201).json(project)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find()
    res.json(projects)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.put('/projects/:id', async (req, res) => {
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

app.delete('/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id)
    res.json({ message: 'Project deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// CRUD for Tasks
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, status, projectId, assignedTo } = req.body
    const task = new Task({ title, description, status, projectId, assignedTo })
    await task.save()
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().populate('projectId').populate('assignedTo')
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.put('/tasks/:id', async (req, res) => {
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

app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id)
    res.json({ message: 'Task deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// File Upload
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

app.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm()
  form.uploadDir = uploadDir
  form.keepExtensions = true

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    const file = files.file
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const newFile = new File({
      name: file.originalFilename,
      path: file.filepath,
      mimetype: file.mimetype,
      size: file.size,
    })

    try {
      await newFile.save() // Using async/await to save the file
      res
        .status(200)
        .json({ message: 'File uploaded successfully', file: newFile })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
})


// New Endpoint to Fetch Users with Project and Task Counts
// Get users with project and task counts
// Get users with task counts
app.get('/api/usersWithCounts', async (req, res) => {
  try {
    const users = await Member.find() // Assuming you're interested in members

    const userData = await Promise.all(
      users.map(async (user) => {
        const taskCount = await Task.countDocuments({ assignedTo: user._id })

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          taskCount,
        }
      })
    )

    res.json(userData)
  } catch (error) {
    console.error('Error fetching user data:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Fetch all projects and the projects assigned to a specific member
app.get('/projectsForMember/:memberId', async (req, res) => {
  try {
    const memberId = req.params.memberId

    // Step 1: Find all tasks assigned to the specific member
    const tasks = await Task.find({ assignedTo: memberId }).select('projectId')

    // Step 2: Extract unique project IDs
    const projectIds = [...new Set(tasks.map((task) => task.projectId))]

    // Step 3: Fetch details of these projects
    const projects = await Project.find({ _id: { $in: projectIds } })

    res.json({
      allProjects: await Project.find(), // Fetch all projects
      memberProjects: projects, // Fetch projects assigned to the member
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/projects/assigned/:userId', async (req, res) => {
  try {
    const userId = req.params.userId

    // Step 1: Find all tasks assigned to the specific user
    const tasks = await Task.find({ assignedTo: userId }).select('projectId')

    // Step 2: Extract unique project IDs
    const projectIds = [...new Set(tasks.map((task) => task.projectId))]

    // Step 3: Fetch details of these projects
    const projects = await Project.find({ _id: { $in: projectIds } })

    res.json(projects)
  } catch (error) {
    console.error('Error fetching assigned projects:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})
app.get('/tasks/assigned/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId })
    if (!tasks) {
      return res.status(404).json({ message: 'No tasks found' })
    }
    res.json(tasks)
  } catch (error) {
    console.error('Error fetching assigned tasks:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

app.put('/updateStatus/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params
    const { status } = req.body

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    )

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get users with task counts
app.get('/usersWithCounts', async (req, res) => {
  try {
    const users = await Member.find() // Assuming you're interested in members

    const userData = await Promise.all(
      users.map(async (user) => {
        const taskCount = await Task.countDocuments({ assignedTo: user._id })

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          taskCount,
        }
      })
    )

    res.json(userData)
  } catch (error) {
    console.error('Error fetching user data:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
