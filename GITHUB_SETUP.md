# GitHub Setup Instructions

Your project is ready to be pushed to GitHub! Follow these steps:

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and log in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `millionaire-game` (or your preferred name)
   - **Description**: "Who Wants to Be a Millionaire - Multi-device web game"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Connect Your Local Repository to GitHub

After creating the repository, GitHub will show you setup instructions. Use the **"push an existing repository"** option:

```bash
cd "/Users/apriljashmeranting/Desktop/untitled folder"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/millionaire-game.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files:
   - `README.md`
   - `admin.html`
   - `contestant.html`
   - `host.html`
   - `style.css`
   - `gameState.js`
   - `admin.js`
   - `contestant.js`
   - `host.js`
   - `index.html`
   - `script.js`
   - `.gitignore`

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
gh repo create millionaire-game --public --source=. --remote=origin --push
```

## Alternative: Using GitHub Desktop

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. Go to **File → Add Local Repository**
4. Select your project folder: `/Users/apriljashmeranting/Desktop/untitled folder`
5. Click **Publish repository** button
6. Choose repository name and visibility
7. Click **Publish Repository**

## Enable GitHub Pages (Optional)

To host your game on GitHub Pages:

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**, select **main branch**
5. Click **Save**
6. Your game will be live at: `https://YOUR_USERNAME.github.io/millionaire-game/admin.html`

## Troubleshooting

### If you get "remote origin already exists":
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/millionaire-game.git
```

### If you get authentication errors:
- Use GitHub Personal Access Token instead of password
- Or set up SSH keys for easier authentication

### To update files later:
```bash
git add .
git commit -m "Your commit message"
git push
```

---

**Your project is ready! Just replace `YOUR_USERNAME` with your actual GitHub username in the commands above.**

