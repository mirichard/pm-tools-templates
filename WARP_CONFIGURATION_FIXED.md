# 🔧 WARP MCP CONFIGURATION - FIXED VERSION

## 🎯 Current Status: READY TO CONFIGURE
- ✅ Filesystem Server: Running (PID: 17666)
- ✅ GitHub Servers: Multiple containers running 
- ✅ All prerequisites met

## 🚨 ISSUE IDENTIFIED
Your JSON had syntax errors. Here's the fix:

### ❌ BROKEN (what you had):
```json
"args": []-y, @modelcontextprotocol/server-filesystem,
```

### ✅ FIXED (what you need):
```json
"args": [
  "-y",
  "@modelcontextprotocol/server-filesystem", 
  "/Users/michael/pm-tools-templates"
]
```

---

## 🎯 EXACT WARP CONFIGURATION STEPS

### Step 1: Open Warp MCP Settings
```
Press: Cmd + Shift + P
Type: MCP
Select: "Open MCP Servers"
```

### Step 2: Delete Any Broken Servers
- If you see "PM-Tools-Templates" with errors, delete it
- Start fresh with correct configuration

### Step 3: Add Filesystem Server
**Click "+ Add" button**

```
Server Name: PM-Tools-Templates
Command: npx
```

**Arguments (click "Add Argument" for EACH line):**
```
Argument 1: -y
Argument 2: @modelcontextprotocol/server-filesystem
Argument 3: /Users/michael/pm-tools-templates
```

**Environment Variables:** Leave empty

**Click "Save"**

### Step 4: Add GitHub Server  
**Click "+ Add" button again**

```
Server Name: GitHub
Command: docker
```

**Arguments (click "Add Argument" for EACH line):**
```
Argument 1: run
Argument 2: -i
Argument 3: --rm
Argument 4: -e
Argument 5: GITHUB_PERSONAL_ACCESS_TOKEN
Argument 6: ghcr.io/github/github-mcp-server
```

**Environment Variables:**
```
Key: GITHUB_PERSONAL_ACCESS_TOKEN
Value: YOUR_GITHUB_TOKEN_HERE
```

**Click "Save"**

### Step 5: Enable Both Servers
- Toggle both servers to "ON" (enabled)
- Check for green status indicators

---

## 🧪 IMMEDIATE TEST

After configuration, test with:

```
"List the files in the root of this repository"
```

Should show files like:
- README.md
- ROADMAP.md  
- package.json
- Agile/
- Hybrid/
- etc.

---

## 🔧 ALTERNATIVE: Use Corrected JSON File

If you prefer JSON configuration, use this corrected file:

**Location:** `warp-mcp-config-corrected.json`

**Content:**
```json
{
  "PM-Tools-Templates": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "/Users/michael/pm-tools-templates"
    ],
    "env": {}
  },
  "GitHub": {
    "command": "docker", 
    "args": [
      "run",
      "-i",
      "--rm", 
      "-e",
      "GITHUB_PERSONAL_ACCESS_TOKEN",
      "ghcr.io/github/github-mcp-server"
    ],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
    }
  }
}
```

---

## 🚨 KEY POINTS TO REMEMBER

1. **Each argument must be a separate string** in the JSON array
2. **Use quotes around all strings** in JSON
3. **No trailing commas** in JSON objects
4. **Environment variables go in "env" object**, not "args" array

---

## ✅ SUCCESS INDICATORS

Configuration is working when:
- Both servers show **green status** in Warp MCP settings
- Test command `"List files..."` returns actual file list  
- No error messages in Warp MCP logs

Your servers are running and ready - just follow the exact steps above! 🎉