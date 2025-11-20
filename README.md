# Promptex 🚀

> **Turn your local codebase into LLM-ready context in seconds.**

[![npm version](https://img.shields.io/npm/v/promptex.svg)](https://www.npmjs.com/package/promptex)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)

**Promptex** is a zero-config, localhost web interface that helps you select, visualize, and bundle your code files for Large Language Models (Claude, ChatGPT, DeepSeek).

It solves the **copy-paste fatigue** by providing a clean "Switchboard" UI to toggle files, estimate tokens, and format everything into a single prompt.

---

## ✨ Features

- **📂 Visual File Picker** — Recursively scans your directory, ignoring `node_modules` and `.git` automatically.
- **🔗 Linked Mode (Auto-Resolve)** — Click one file and it auto-selects all its imports.
- **⚡ Minify Mode** — Removes comments and whitespace to shrink tokens.
- **🛑 Smart .gitignore** — Respects your project's existing ignore rules.
- **💾 Presets** — Save groups like _Auth Stack_, _DB Schema_, etc.
- **💲 Cost Estimator** — Live token + price estimation for GPT-4o / Claude Sonnet.
- **🔒 Secure & Local** — Runs only on your machine; nothing is uploaded.

---

## 🚀 Quick Start

You don't need to install anything. Just run it inside any project folder:

```bash
npx promptex
```

Your dashboard opens at:
**[http://localhost:3456](http://localhost:3456)**

### Global Installation (Optional)

```bash
npm install -g promptex
```

Then run:

```
promptex
```

---

## 🛠 Usage & Options

### Start Normally

```bash
promptex
```

### Custom Port

```bash
promptex -p 8080
```

### Headless (No Browser Auto-Open)

```bash
promptex --no-open
```

### Help

```bash
promptex --help
```

---

## 💡 Pro Tips

1. **Linked Mode saves time**
   Select one file (like a React component) → Promptex auto-grabs all imported utilities and sub-components.

2. **XML vs Markdown Output**

   - **XML** (`<file path="...">...</file>`) is best for **Claude**.
   - **Markdown** (` ```js `) works well with ChatGPT.

3. **Use Presets**
   Working on a big feature?
   Select the files → Name it in the header → **Save Preset** → Load anytime.

---

## 📦 Troubleshooting

### **Permission Denied on Linux/Mac?**

Try:

```bash
sudo npx promptex
```

Or fix global npm permissions (recommended).

### **Port Already in Use?**

```bash
promptex -p 4000
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch
3. Commit changes
4. Open a Pull Request

---

## 📄 License

MIT © **Your Name**

---

## ✅ Final Check: How to Publish

1. Make sure the following exist:

   - `package.json`
   - `README.md`
   - `bin/cli.js`
   - `server.js`
   - `public/`

2. Login:

```bash
npm login
```

3. Publish:

```bash
npm publish --access public
```

---
