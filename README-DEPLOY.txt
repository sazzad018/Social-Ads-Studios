=========================================================
HOW TO DEPLOY TO SHARED HOSTING (PHP & MySQL)
=========================================================

Since your hosting only supports PHP and MySQL, you CANNOT upload the `server.ts` or `package.json` files to your server. Those are for Node.js.

Instead, follow these exact steps to deploy your React app with the PHP backend:

STEP 1: PREPARE THE DATABASE
1. Go to your hosting control panel (cPanel, DirectAdmin, etc.).
2. Open "MySQL Databases" and create a new database.
3. Create a new database user and assign it to the database with ALL PRIVILEGES.
4. Open "phpMyAdmin".
5. Select your new database.
6. Click "Import" and upload the `php-backend-database.sql` file from this project.

STEP 2: CONFIGURE THE PHP BACKEND
1. In this project, open the file `public/api/db.php`.
2. Change the database credentials at the top of the file to match the ones you just created:
   $host = 'localhost'; // Usually localhost
   $dbname = 'your_database_name';
   $username = 'your_database_user';
   $password = 'your_database_password';

STEP 3: BUILD THE FRONTEND
1. In AI Studio, click the Settings (Gear) icon in the top right.
2. Select "Export to ZIP" and download the project.
3. Extract the ZIP on your computer.
4. Open a terminal/command prompt in the extracted folder.
5. Run these commands:
   npm install
   npm run build

STEP 4: UPLOAD TO YOUR HOSTING
1. After running `npm run build`, a new folder named `dist` will be created.
2. Open your hosting File Manager or use FTP (FileZilla).
3. Go to your `public_html` folder (or the root folder of your domain).
4. Upload ALL the contents inside the `dist` folder directly into `public_html`.
   (Do NOT upload the `dist` folder itself, just the files INSIDE it).

That's it! 
Your website will now load the React frontend, and it will automatically talk to the PHP backend located at `yourdomain.com/api/api.php`.

HOW IT WORKS:
- The React frontend is compiled into static HTML/JS/CSS files.
- The `public/api` folder (containing `api.php` and `db.php`) is automatically copied to the `dist` folder during the build process.
- The frontend is configured to send all API requests to `/api/api.php` when running in production.
