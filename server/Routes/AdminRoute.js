import express from 'express';
import { con } from '../utils/db.mjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';


const router = express.Router();

// Middleware
router.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
router.use(express.json());
router.use(cookieParser());

// 🔧 Create Tables If Not Exist


con.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
`);

con.query(`
  CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_username VARCHAR(255) NOT NULL UNIQUE,
    admin_password VARCHAR(255) NOT NULL
);
`);

con.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    creatorName VARCHAR(255),
    assignedTo VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending'
);
`);

con.query(`
  CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(50),
    table_name VARCHAR(50),
    record_id INT,
    user VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);
`);


router.post('/adminlogin', (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ?";
  con.query(sql, [username], async (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });

    if (result.length > 0) {
      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.json({ loginStatus: false, Error: "Wrong credentials" });
      }

      const token = jwt.sign(
        { role: user.role, username: user.username },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );

      res.cookie('token', token, { httpOnly: true, sameSite: 'Lax' });

      const redirectUrl = user.role === 0 ? "/dashboard" : "/dashboard";
      return res.json({ loginStatus: true, redirect: redirectUrl });

    } else {
      return res.json({ loginStatus: false, Error: "Wrong credentials" });
    }
  });
});

router.post('/Userlogin', (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ?";
  con.query(sql, [username], async (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });

    if (result.length > 0) {
      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.json({ loginStatus: false, Error: "Wrong credentials" });
      }

      const token = jwt.sign(
        { role: user.role, username: user.username },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );

      res.cookie('token', token, { httpOnly: true, sameSite: 'Lax' });

      const redirectUrl = user.role === 0 ? "/dashboard" : "/dashboard";
      return res.json({ loginStatus: true, redirect: redirectUrl });

    } else {
      return res.json({ loginStatus: false, Error: "Wrong credentials" });
    }
  });
});

// 🔐 Middleware to protect routes
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = decoded;
    next();
  });
};

const logAudit = (action, tableName, recordId, username, description) => {
  const sql = `INSERT INTO audit_logs (action, table_name, record_id, username, description) VALUES (?, ?, ?, ?, ?)`;
  const values = [action, tableName, recordId, username, description];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error("Audit log failed:", err.message);
    } else {
      console.log("Audit log recorded successfully.");
    }
  });
};

// 📊 Get Users with Role = 1
router.get('/dashboard', verifyToken, (req, res) => {
  const sql = "SELECT * FROM users WHERE role = 1";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, data: result });
  });
});
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'Lax' });
  res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/dashboard/view_tasks', verifyToken, (req, res) => {
  const sql = "SELECT * FROM tasks";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, data: result });
  });
});

// ➕ Add Task
router.post('/dashboard/add_tasks', verifyToken, (req, res) => {
  const { taskTitle, description, creatorName, assignedTo } = req.body;
  const query = `INSERT INTO tasks (title, description, CreaterName, assignedTo) VALUES (?, ?, ?, ?)`;
  const values = [taskTitle, description, creatorName, assignedTo];

  con.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding task', error: err.message });
    }
    return res.status(201).json({ message: 'Task added successfully' });
  });
});


// 🧑‍🤝‍🧑 Get All Usernames
router.get('/api/users', verifyToken, (req, res) => {
  const sql = "SELECT username FROM users";
  con.query(sql, (err, results) => {
    if (err) return res.status(500).send('Server error');
    const usernames = results.map(user => user.username);
    return res.json(usernames);
  });
});

router.post('/auth/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax',
    // secure: true, // uncomment if using HTTPS
  });
  return res.status(200).json({ message: 'Logged out successfully' });
});


// ✅ Update Task Status
// router.put('/dashboard/update_task_status', verifyToken, (req, res) => {
//   const { taskId, status } = req.body;

//   if (!taskId || !status) {
//     return res.status(400).json({ message: 'Task ID and status are required' });
//   }

//   const sql = "UPDATE tasks SET status = ? WHERE id = ?";
//   con.query(sql, [status, taskId], (err, result) => {
//     if (err) return res.status(500).json({ message: 'Error updating task status' });

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     return res.status(200).json({ message: 'Task status updated successfully' });
//   });
// });
router.put('/dashboard/update_task_status', verifyToken, (req, res) => {
  const { taskId, status } = req.body;

  if (!taskId || !status) {
    return res.status(400).json({ message: 'Task ID and status are required' });
  }

  const sql = "UPDATE tasks SET status = ? WHERE id = ?";
  con.query(sql, [status, taskId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating task status' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // ✅ Log the update action here
    logAudit('UPDATE', 'tasks', taskId, req.user.username, `Status changed to ${status}`);

    return res.status(200).json({ message: 'Task status updated successfully' });
  });
});

// 📝 Signup Route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ signupStatus: false, message: 'Username and password are required' });
  }

  const checkSql = "SELECT * FROM users WHERE username = ?";
  con.query(checkSql, [username], async (err, result) => {
    if (err) return res.status(500).json({ signupStatus: false, message: 'Database error' });

    if (result.length > 0) {
      return res.status(409).json({ signupStatus: false, message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertSql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    con.query(insertSql, [username, hashedPassword, 1], (err, result) => {
      if (err) return res.status(500).json({ signupStatus: false, message: 'Error creating user' });

      return res.status(201).json({ signupStatus: true, message: 'User registered successfully' });
    });
  });
});

export { router as adminRouter };
