To use **GitHub Actions CI/CD**, your code **must live in a GitHub repo** (Actions only runs workflows from a repo). So the path is:

1. put your Vite project on GitHub
2. add a workflow that builds + uploads `dist/` to your VPS over SSH

Here’s the clean way.

---

## 1) Push your Vite app to GitHub

From your Vite project folder:

```bash
git init
git add .
git commit -m "Initial commit"
```

Create a new repo on GitHub (empty), then connect and push:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

> Make sure you **don’t** commit secrets (like `.env` with real keys).

---

## 2) Prepare the VPS for deployments

### A) Make sure your deploy user owns the web folder

On the VPS:

```bash
sudo mkdir -p /var/www/myreactapp
sudo chown -R deploy:deploy /var/www/myreactapp
sudo chmod -R 755 /var/www/myreactapp
```

### B) Ensure SSH key-based login works

You already have a key (`linux_vps_deployment_i`). For GitHub Actions, you’ll store the **private key** as a GitHub Secret.

You also need the VPS to accept that key for the `deploy` user:

* Your public key should be in:

  ```
  /home/deploy/.ssh/authorized_keys
  ```

---

## 3) Add GitHub Secrets (important)

In your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**

Add these:

* `VPS_HOST` = `165.232.42.199`
* `VPS_USER` = `deploy`
* `VPS_SSH_KEY` = **the full private key content** of `linux_vps_deployment_i`

  * Open the file and copy everything, including:
    `-----BEGIN OPENSSH PRIVATE KEY-----` … `-----END OPENSSH PRIVATE KEY-----`

(Optional but nice)

* `VPS_PATH` = `/var/www/myreactapp`

---

## 4) Add the GitHub Actions workflow

Create this file in your repo:

**`.github/workflows/deploy.yml`**

```yaml
name: Deploy Vite React to VPS

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload dist to VPS (rsync over SSH)
        uses: burnett01/rsync-deployments@6.0.0
        with:
          switches: -avzr --delete
          path: dist/
          remote_path: ${{ secrets.VPS_PATH }}
          remote_host: ${{ secrets.VPS_HOST }}
          remote_user: ${{ secrets.VPS_USER }}
          remote_key: ${{ secrets.VPS_SSH_KEY }}
```

Commit + push:

```bash
git add .github/workflows/deploy.yml
git commit -m "Add CI/CD deploy workflow"
git push
```

Now every push to `main` will:

* build Vite
* sync `dist/` to `/var/www/myreactapp` on the VPS
* delete old files automatically (`--delete`)

---

## 5) Verify it deployed

On GitHub:

* Repo → **Actions** tab → open latest run → confirm green ✅

On your VPS (optional):

```bash
ls -la /var/www/myreactapp
```

---

