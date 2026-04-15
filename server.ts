import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

// Initialize SQLite Database
const db = new Database('database.sqlite');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    format TEXT NOT NULL,
    createdAt INTEGER NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    format TEXT NOT NULL,
    createdAt INTEGER NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS screenshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    createdAt INTEGER NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS salesReports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    createdAt INTEGER NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS fbAdsResults (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    createdAt INTEGER NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS whatWeDoVideos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnailUrl TEXT,
    createdAt INTEGER NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  );
`);

// Insert default admin if not exists
const adminEmail = 'ronykazi115@gmail.com';
const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);
if (!existingAdmin) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run(adminEmail, hashedPassword, 'admin');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    res.json({ user: req.user });
  });

  // Generic CRUD generator
  const createCrudRoutes = (tableName: string) => {
    app.get(`/api/${tableName}`, (req, res) => {
      const items = db.prepare(`SELECT * FROM ${tableName} ORDER BY createdAt DESC`).all();
      res.json(items);
    });

    app.post(`/api/${tableName}`, authenticateToken, (req, res) => {
      const keys = Object.keys(req.body);
      const values = Object.values(req.body);
      const placeholders = keys.map(() => '?').join(', ');
      
      const info = db.prepare(`INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`).run(...values);
      const newItem = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(info.lastInsertRowid);
      res.json(newItem);
    });

    app.delete(`/api/${tableName}/:id`, authenticateToken, (req, res) => {
      db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(req.params.id);
      res.json({ success: true });
    });
  };

  createCrudRoutes('videos');
  createCrudRoutes('photos');
  createCrudRoutes('screenshots');
  createCrudRoutes('salesReports');
  createCrudRoutes('fbAdsResults');
  createCrudRoutes('whatWeDoVideos');

  // Settings Routes
  app.get('/api/settings/:key', (req, res) => {
    const setting: any = db.prepare('SELECT * FROM settings WHERE key = ?').get(req.params.key);
    res.json(setting ? JSON.parse(setting.value) : null);
  });

  app.post('/api/settings/:key', authenticateToken, (req, res) => {
    const { key } = req.params;
    const value = JSON.stringify(req.body);
    
    db.prepare(`
      INSERT INTO settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(key, value);
    
    res.json({ success: true });
  });

  // API Route for Facebook Conversions API (CAPI)
  app.post('/api/fb-capi', async (req, res) => {
    try {
      const { eventName, eventData, userData, sourceUrl } = req.body;

      const settingsDoc: any = db.prepare('SELECT * FROM settings WHERE key = ?').get('tracking_private');
      if (!settingsDoc) {
        return res.status(404).json({ error: 'Tracking settings not found' });
      }

      const settings = JSON.parse(settingsDoc.value);
      const { fbPixelId, fbAccessToken, fbTestEventCode } = settings || {};

      if (!fbPixelId || !fbAccessToken) {
        return res.status(400).json({ error: 'Facebook Pixel ID or Access Token missing' });
      }

      const payload = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            event_source_url: sourceUrl || 'https://socialaddstudio.com',
            user_data: {
              client_ip_address: req.ip || req.headers['x-forwarded-for'] || '',
              client_user_agent: req.headers['user-agent'] || '',
              ...userData
            },
            custom_data: eventData
          }
        ],
        test_event_code: fbTestEventCode || undefined
      };

      const response = await axios.post(
        `https://graph.facebook.com/v17.0/${fbPixelId}/events`,
        payload,
        {
          params: { access_token: fbAccessToken }
        }
      );

      res.json({ success: true, fbResponse: response.data });
    } catch (error: any) {
      console.error('FB CAPI Error:', error.response?.data || error.message);
      res.status(500).json({ 
        error: 'Failed to send event to Facebook CAPI', 
        details: error.response?.data || error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

