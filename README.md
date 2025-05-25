# WordPress Runner

A smart VSCode extension to run PHP code in WordPress context with both quick execution (`wp eval-file`/`wp eval`) and interactive shell (`wp shell`) support. **Only activates in WordPress projects** for a clean, focused development experience.

## Features

### 🎯 Smart WordPress Detection
- **Automatic project detection**: Only shows controls when working in actual WordPress projects
- **Multiple detection methods**: Recognizes WordPress core files, directory structure, and Composer dependencies
- **Clean interface**: No clutter in non-WordPress PHP projects

### ⚡ Quick Execution (wp eval-file/wp eval)
- **Run entire PHP file**: Click the play button (▶️) or use `Cmd+R` (Mac) / `Ctrl+R` (Windows/Linux)
  - Uses `wp eval-file` for **clean output** - only shows results, not the script content
- **Run selected code**: Select PHP code and use `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows/Linux)
  - Creates temporary file and uses `wp eval-file` for clean output
- **Fast execution**: Perfect for quick tests and one-off commands

### 🖥️ Interactive Shell (wp shell)
- **Run file in shell**: Click the terminal button or use `Cmd+Alt+R` (Mac) / `Ctrl+Alt+R` (Windows/Linux)
- **Run selection in shell**: Select code and use `Cmd+Alt+Shift+R` (Mac) / `Ctrl+Alt+Shift+R` (Windows/Linux)
- **Open WordPress shell**: Use `Cmd+Alt+S` (Mac) / `Ctrl+Alt+S` (Windows/Linux) to open an interactive PsySH shell
- **Persistent session**: The shell stays open for continued interaction and exploration
- **Interactive debugging**: Perfect for exploring WordPress objects, testing functions, and debugging

### 🎛️ Multiple Access Methods
- **Editor buttons**: Visual buttons in the editor title bar (only in WordPress projects)
- **Context menus**: Right-click options for selected code
- **Keyboard shortcuts**: Fast access via customizable key combinations
- **Command Palette**: Access via `Cmd+P` → `>WordPress Runner` for all commands

### 🔧 General Features
- **Clean output**: Uses `wp eval-file` to show only results, not script content
- **Automatic `<?php` tag handling**: The extension automatically strips PHP opening tags
- **WordPress context**: Code runs with full WordPress environment loaded
- **Smart terminal management**: Reuses existing shell sessions when appropriate
- **Error handling**: Clear feedback when commands can't run

## Requirements

- WordPress installation with WP-CLI available
- VSCode workspace should be in your WordPress project directory

## Development

### Prerequisites
- [Bun](https://bun.sh/) - Fast JavaScript runtime and package manager
- [VS Code](https://code.visualstudio.com/) with TypeScript support

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/eduwass/wp-runner-extension.git
   cd wp-runner-extension
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Compile TypeScript:
   ```bash
   bun run compile
   ```

### Development Workflow

#### VS Code Tasks
Use `Ctrl+Shift+P` → "Tasks: Run Task" to access these development tasks:

- **`compile`** - Compile TypeScript to JavaScript
- **`watch`** - Watch for changes and auto-compile
- **`package extension`** - Create a `.vsix` package file
- **`install extension locally`** - Install the extension in your local VS Code
- **`package and install`** - Package and install in one step (default build task: `Ctrl+Shift+B`)
- **`uninstall extension`** - Remove the extension from VS Code

#### Command Line Scripts
```bash
# Development
bun run compile              # Compile TypeScript
bun run watch               # Watch mode compilation

# Packaging & Installation
bun run package             # Package extension (.vsix)
bun run install-local       # Install in local VS Code
bun run package-and-install # Package and install (recommended)
```

#### Quick Development Cycle
1. Make changes to `src/extension.ts`
2. Run `Ctrl+Shift+B` (or "package and install" task)
3. Reload VS Code window (`Ctrl+R`) to test changes
4. Repeat

### Project Structure
```
wp-runner-extension/
├── src/
│   └── extension.ts        # Main extension code
├── out/                    # Compiled JavaScript (auto-generated)
├── .vscode/
│   └── tasks.json         # VS Code development tasks
├── package.json           # Extension manifest and dependencies
├── tsconfig.json          # TypeScript configuration
├── .vscodeignore         # Files excluded from extension package
└── README.md             # This file
```

### Why Bun?
- ⚡ **Much faster** than npm for package installation and script execution
- 🔧 **Better dependency resolution** - resolves TypeScript compilation issues
- 📦 **Smaller lockfile** (`bun.lockb` vs `package-lock.json`)
- 🚀 **Native TypeScript support** without additional configuration

## WordPress Project Detection

The extension automatically detects WordPress projects by checking for:

### Core Files
- `wp-config.php`
- `wp-config-sample.php`
- `wp-load.php`
- `wp-blog-header.php`

### Directory Structure
- `wp-content/` directory

### Composer Dependencies
- Any package containing "wordpress" or "wp-"

When a WordPress project is detected, you'll see a "WordPress project detected!" notification.

## Usage

### Quick Commands (wp eval-file/wp eval)
1. Open any PHP file in your WordPress project
2. Either:
   - Click the play button (▶️) in the editor title to run the entire file
   - Select some PHP code and use `Cmd+R` for quick execution
   - Use keyboard shortcuts for selection: `Cmd+Shift+R`

**Output**: Clean results only - no script content shown in terminal

### Interactive Shell (wp shell)
1. Open any PHP file in your WordPress project
2. Either:
   - Click the terminal button in the editor title to run code in shell
   - Use `Cmd+Alt+S` to open a persistent WordPress shell
   - Select code and use `Cmd+Alt+Shift+R` to run in shell
   - Continue typing commands directly in the shell for exploration

### Command Palette Access
1. Press `Cmd+P` (Mac) / `Ctrl+P` (Windows/Linux)
2. Type `>` to enter command mode
3. Type "WordPress Runner" to see all available commands:
   - **WordPress Runner: Run File (wp eval-file)**
   - **WordPress Runner: Run Selection (wp eval-file)**
   - **WordPress Runner: Run File in Shell (wp shell)**
   - **WordPress Runner: Run Selection in Shell (wp shell)**
   - **WordPress Runner: Open WordPress Shell**

### Keyboard Shortcuts

| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| Run file (eval-file) | `Cmd+R` | `Ctrl+R` |
| Run selection (eval-file) | `Cmd+Shift+R` | `Ctrl+Shift+R` |
| Run file (shell) | `Cmd+Alt+R` | `Ctrl+Alt+R` |
| Run selection (shell) | `Cmd+Alt+Shift+R` | `Ctrl+Alt+Shift+R` |
| Open WordPress shell | `Cmd+Alt+S` | `Ctrl+Alt+S` |

## When to Use Each Mode

### Use `wp eval-file` when:
- Testing quick snippets
- Running one-off commands
- Getting fast, clean results without interaction
- Checking WordPress configuration or data
- **You want clean output without seeing the script content**

### Use `wp shell` when:
- Exploring WordPress objects interactively
- Debugging complex issues
- Need to run multiple related commands
- Want to inspect variables and continue working
- Learning WordPress internals

## Example Usage

### Quick Testing with wp eval-file (Clean Output)
```php
<?php
// Test WordPress functionality
echo "Site URL: " . get_site_url() . "\n";
echo "User count: " . count(get_users()) . "\n";
```

**Terminal Output:**
```
Site URL: https://goldflower.local
User count: 3
```

### Interactive Exploration with wp shell
```php
<?php
// Start with this code, then continue in the shell
$posts = get_posts(['numberposts' => 5]);
```
Then in the shell, continue exploring:
```php
count($posts)
$posts[0]->post_title
get_post_meta($posts[0]->ID)
```

## How it works

The extension intelligently chooses the best WP-CLI command:

- **Full file execution**: Uses [`wp eval-file`](https://developer.wordpress.org/cli/commands/eval-file/) for clean output
- **Code selections**: Creates temporary files and uses `wp eval-file` for consistency
- **Interactive mode**: Uses `wp shell` (PsySH) for exploration and debugging

This approach gives you both the speed of direct execution and the interactivity of a full WordPress shell, all with clean, professional output.

## Benefits Over Other Tools

✅ **WordPress-specific** - Built specifically for WordPress, not adapted from Laravel tools  
✅ **Smart detection** - Only activates in WordPress projects  
✅ **Clean output** - Uses `wp eval-file` to show only results, not script content  
✅ **Dual modes** - Both quick and interactive execution  
✅ **Multiple access methods** - Buttons, shortcuts, Command Palette, context menus  
✅ **Native integration** - Uses VSCode's terminal API properly  
✅ **Persistent sessions** - Keep shell open for exploration  
✅ **Professional UX** - Clean interface with proper error handling  

---

**Happy WordPress development!** 🚀 