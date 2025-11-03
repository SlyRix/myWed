# Wedding Website Server for Raspberry Pi

This guide explains how to set up and run the wedding website server on a Raspberry Pi.

## Prerequisites

- Raspberry Pi with Raspberry Pi OS (formerly Raspbian) installed
- Node.js installed (v14 or higher recommended)
- npm installed
- Git (optional)

## Installation

1. Clone or copy the project to your Raspberry Pi:

   ```bash
   git clone https://github.com/yourusername/wedding-website.git
   # or copy the files using SCP or another method
   ```

2. Navigate to the project directory:

   ```bash
   cd wedding-website
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Setting up the API Server

1. Create the data directory:

   ```bash
   mkdir -p data
   ```

2. Install server dependencies:

   ```bash
   npm install express cors body-parser
   ```

3. Test the server:

   ```bash
   node src/server/server.js
   ```

   You should see: `Server running on port 3001`

## Running the Server Permanently

### Method 1: Using PM2 (Recommended)

PM2 is a process manager for Node.js applications that helps keep your application running.

1. Install PM2 globally:

   ```bash
   sudo npm install -g pm2
   ```

2. Start the server with PM2:

   ```bash
   pm2 start src/server/server.js --name wedding-api
   ```

3. Configure PM2 to start on boot:

   ```bash
   pm2 startup
   pm2 save
   ```

### Method 2: Using systemd

1. Create a systemd service file:

   ```bash
   sudo nano /etc/systemd/system/wedding-api.service
   ```

2. Add the following content (adjust paths as needed):

   ```
   [Unit]
   Description=Wedding Website API Server
   After=network.target

   [Service]
   User=pi
   WorkingDirectory=/home/pi/wedding-website
   ExecStart=/usr/bin/node /home/pi/wedding-website/src/server/server.js
   Restart=on-failure
   RestartSec=10
   StandardOutput=syslog
   StandardError=syslog
   SyslogIdentifier=wedding-api

   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start the service:

   ```bash
   sudo systemctl enable wedding-api
   sudo systemctl start wedding-api
   ```

4. Check the status:

   ```bash
   sudo systemctl status wedding-api
   ```

## Configuring the React Frontend

1. Create an `.env` file in the root of the project:

   ```bash
   nano .env
   ```

2. Add the following content, replacing the IP address with your Raspberry Pi's IP:

   ```
   REACT_APP_API_URL=http://192.168.1.XXX:3001/api
   ```

3. Build the frontend:

   ```bash
   npm run build
   ```

## Serving the Frontend

### Option 1: Using NGINX (Recommended for Production)

1. Install NGINX:

   ```bash
   sudo apt-get update
   sudo apt-get install nginx
   ```

2. Configure NGINX:

   ```bash
   sudo nano /etc/nginx/sites-available/wedding
   ```

3. Add the following configuration:

   ```
   server {
       listen 80;
       server_name _; # Replace with your domain if you have one

       root /home/pi/wedding-website/build;
       index index.html;

       location / {
           try_files $uri /index.html;
       }

       location /api {
           proxy_pass http://localhost:3001/api;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. Enable the site:

   ```bash
   sudo ln -s /etc/nginx/sites-available/wedding /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Option 2: Using a simple HTTP server

1. Install serve globally:

   ```bash
   sudo npm install -g serve
   ```

2. Run the server:

   ```bash
   serve -s build -l 80
   ```

## Accessing the Website

Your wedding website should now be accessible at:

- Local Raspberry Pi: http://localhost
- From other devices on your network: http://[YOUR_PI_IP]

## Troubleshooting

### If the server won't start:

1. Check for errors in the logs:

   ```bash
   # If using PM2
   pm2 logs

   # If using systemd
   sudo journalctl -u wedding-api
   ```

2. Ensure the port isn't already in use:

   ```bash
   sudo lsof -i :3001
   ```

### If the website isn't accessible:

1. Check if the server is running:

   ```bash
   # If using PM2
   pm2 status

   # If using systemd
   sudo systemctl status wedding-api
   ```

2. Check firewall settings:

   ```bash
   sudo ufw status
   ```

   If needed, allow the ports:

   ```bash
   sudo ufw allow 80
   sudo ufw allow 3001
   ```

## Backup and Restore

The guest list data is stored in `data/guestList.json`. Make regular backups of this file:

```bash
# Create a backup
cp data/guestList.json data/guestList.json.backup

# Restore from backup
cp data/guestList.json.backup data/guestList.json
```

---

For more help, check the project documentation or contact support.