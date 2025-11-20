const express = require("express");
const path = require("path");
const fs = require("fs");
const open = require("open");
const ignore = require("ignore");
const { parseArgs } = require("node:util");

// Binary file extensions to exclude
const BINARY_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".ico",
  ".pdf",
  ".exe",
  ".bin",
  ".zip",
  ".tar",
  ".gz",
  ".mp3",
  ".mp4",
  ".mov",
  ".woff",
  ".woff2",
  ".ttf",
]);

// --- CLI ARGS ---
const options = {
  port: { type: "string", short: "p", default: "3456" },
  open: { type: "boolean", short: "o", default: true },
  help: { type: "boolean", short: "h" },
};
let args;
try {
  const { values } = parseArgs({ args: process.argv.slice(2), options });
  args = values;
} catch (e) {
  process.exit(1);
}

if (args.help) {
  console.log(`
  🚀 CONTEXTOR // ULTIMATE
  Usage: contextor [options]
  
  Options:
    -p, --port <number>   Port (default: 3456)
    -o, --no-open         Don't open browser
    -h, --help            Show help
  `);
  process.exit(0);
}

const app = express();
const PORT = parseInt(args.port, 10) || 3456;
const CWD = process.cwd();
const PRESET_FILE = path.join(CWD, ".contextor.presets.json");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// --- IGNORE LOGIC ---
function getIgnoreFilter() {
  const ig = ignore();
  ig.add([".git", "node_modules", ".DS_Store"]); // Defaults

  const gitignorePath = path.join(CWD, ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    ig.add(fs.readFileSync(gitignorePath, "utf-8"));
  }
  return ig;
}

// Minification helper function
function minifyContent(content, ext) {
  // Simple regex-based minification for common languages
  if ([".js", ".ts", ".jsx", ".tsx", ".json", ".css"].includes(ext)) {
    return content
      .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "$1") // Strip comments
      .replace(/^\s*[\r\n]/gm, "") // Remove empty lines
      .replace(/\s+/g, " "); // Collapse whitespace (aggressive)
  }
  return content; // Return raw for others (md, txt, etc)
}

function getAllFiles(
  dir,
  allFiles = [],
  baseDir = CWD,
  ig = getIgnoreFilter()
) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(baseDir, fullPath);
    const ext = path.extname(file).toLowerCase();

    // Check ignore rules and binary files
    if (
      ig.ignores(relPath) ||
      relPath.includes(".git/") ||
      BINARY_EXTENSIONS.has(ext)
    )
      return;

    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, allFiles, baseDir, ig);
    } else {
      allFiles.push(relPath);
    }
  });
  return allFiles;
}
// We use simple polling for "Watch Mode" to avoid complex deps like chokidar for a single-file tool
// In a real prod app, use Chokidar. Here we just re-read on demand.

// --- API ---

app.get("/api/files", (req, res) => {
  try {
    res.json(getAllFiles(CWD));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/bundle", (req, res) => {
  const { files, format, minify } = req.body; // format: 'xml' | 'markdown', minify: boolean
  let bundle = "";

  try {
    files.forEach((filePath) => {
      const fullPath = path.join(CWD, filePath);
      if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, "utf-8");
        const ext = path.extname(filePath).toLowerCase();

        if (minify) {
          content = minifyContent(content, ext);
        }

        if (format === "markdown") {
          const lang = ext.substring(1);
          bundle += `\n### ${filePath}\n\`\`\`${lang}\n${content}\n\`\`\`\n`;
        } else {
          // Default XML (Claude preferred)
          bundle += `\n<file path="${filePath}">\n${content}\n</file>\n`;
        }
      }
    });
    res.json({ content: bundle });
  } catch (e) {
    res.status(500).json({ error: "Read error" });
  }
});

// --- PRESETS API ---
app.get("/api/presets", (req, res) => {
  if (!fs.existsSync(PRESET_FILE)) return res.json({});
  try {
    const data = fs.readFileSync(PRESET_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch {
    res.json({});
  }
});

app.post("/api/presets", (req, res) => {
  const { name, files } = req.body;
  let presets = {};
  if (fs.existsSync(PRESET_FILE)) {
    try {
      presets = JSON.parse(fs.readFileSync(PRESET_FILE, "utf-8"));
    } catch {}
  }
  presets[name] = files;
  fs.writeFileSync(PRESET_FILE, JSON.stringify(presets, null, 2));
  res.json({ success: true, presets });
});

app.delete("/api/presets/:name", (req, res) => {
  const { name } = req.params;
  if (fs.existsSync(PRESET_FILE)) {
    let presets = JSON.parse(fs.readFileSync(PRESET_FILE, "utf-8"));
    delete presets[name];
    fs.writeFileSync(PRESET_FILE, JSON.stringify(presets, null, 2));
    return res.json({ success: true, presets });
  }
  res.json({ success: false });
});

app.listen(PORT, async () => {
  console.log(`\n🚀 Contextor running: http://localhost:${PORT}`);
  console.log(`📂 Root: ${CWD}`);
  if (args.open) await open(`http://localhost:${PORT}`);
});
