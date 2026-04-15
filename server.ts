import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
// Note: In this environment, we might not have a service account file.
// We'll try to use the environment variables or just skip if not available.
// For now, we'll assume the environment is set up or we'll use the standard firebase SDK if needed.
// But firebase-admin is better for server-side.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    // Fallback or skip if not available
  }
}

const db = admin.apps.length ? admin.firestore() : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Facebook Conversions API (CAPI)
  app.post('/api/fb-capi', async (req, res) => {
    try {
      const { eventName, eventData, userData, sourceUrl } = req.body;

      if (!db) {
        return res.status(500).json({ error: 'Firestore not initialized on server' });
      }

      // Fetch tracking settings from Firestore
      const settingsDoc = await db.collection('settings').doc('tracking').get();
      if (!settingsDoc.exists) {
        return res.status(404).json({ error: 'Tracking settings not found' });
      }

      const { fbPixelId, fbAccessToken, fbTestEventCode } = settingsDoc.data() || {};

      if (!fbPixelId || !fbAccessToken) {
        return res.status(400).json({ error: 'Facebook Pixel ID or Access Token missing' });
      }

      // Prepare the payload for Facebook Graph API
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

      // Send to Facebook Graph API
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
