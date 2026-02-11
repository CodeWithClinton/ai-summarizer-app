
## Build React → Serve static files with Nginx

### 1) Prep the server

SSH in:

```bash
ssh root@YOUR_SERVER_IP
```

Update packages:

```bash
sudo apt update && sudo apt -y upgrade
```

Create a non-root user (recommended):

```bash
adduser deploy
usermod -aG sudo deploy
```

(Optional but recommended) basic firewall:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Now log in as the new user:

```bash
ssh deploy@YOUR_SERVER_IP
```

---

### 2) Install Node (only needed on server if you plan to build on server)

If you will **build locally** and upload `/dist` or `/build`, you can skip Node.
If you’ll **build on the VPS**, install Node LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

---

### 3) Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Test in browser: `http://YOUR_SERVER_IP` should show the Nginx welcome page.

---

### 4) Point your domain to the VPS

In your DNS provider (DigitalOcean DNS / Cloudflare / etc), add:

* **A record**: `@` → `YOUR_SERVER_IP`
* **A record**: `www` → `YOUR_SERVER_IP` (optional)
* or if using subdomain: `app.yourdomain.com` → `YOUR_SERVER_IP`

Wait for DNS to propagate (can be a few minutes to a few hours).

---

### 5) Put your React app on the server

Pick a directory:

```bash
sudo mkdir -p /var/www/myreactapp
sudo chown -R deploy:deploy /var/www/myreactapp
```

#### If you use Vite

On your local machine (or on server):

```bash
npm install
npm run build
```

This creates `dist/`.

Upload the `dist/` contents to `/var/www/myreactapp` (examples):

**Using rsync (best):**

```bash
scp -r dist/* user@YOUR_SERVER_IP:/var/www/myreactapp/
```

#### If you use CRA

Build:

```bash
npm run build
```

Upload `build/` contents similarly.

---

### 6) Configure Nginx to serve the React build (with SPA routing fix)

Create a new site config:

```bash
sudo nano /etc/nginx/sites-available/myreactapp
```

Paste (replace domain + path):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/myreactapp;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # optional: cache static assets harder
    location ~* \.(?:css|js|jpg|jpeg|gif|png|svg|ico|webp|ttf|woff|woff2)$ {
        expires 30d;
        access_log off;
        add_header Cache-Control "public";
        try_files $uri =404;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/myreactapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

At this point, `http://yourdomain.com` should show your React app.

---

### 7) Add HTTPS (free SSL) with Let’s Encrypt

Install certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Get SSL + auto-configure Nginx:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Test auto-renewal:

```bash
sudo certbot renew --dry-run
```


