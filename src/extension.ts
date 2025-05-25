import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

let isWordPressProject = false;

export function activate(context: vscode.ExtensionContext) {
    
    // Check if this is a WordPress project on activation
    checkWordPressProject();
    
    // Watch for workspace changes
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
        checkWordPressProject();
    });
    
    // Register command to run entire file with wp eval
    let runFileCommand = vscode.commands.registerCommand('wp-runner.runFile', () => {
        if (!isWordPressProject) {
            vscode.window.showErrorMessage('WordPress Runner: This doesn\'t appear to be a WordPress project');
            return;
        }
        
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        
        const document = editor.document;
        if (document.languageId !== 'php') {
            vscode.window.showErrorMessage('This command only works with PHP files');
            return;
        }
        
        const code = document.getText();
        runPHPCode(code, 'eval');
    });
    
    // Register command to run selected text with wp eval
    let runSelectionCommand = vscode.commands.registerCommand('wp-runner.runSelection', () => {
        if (!isWordPressProject) {
            vscode.window.showErrorMessage('WordPress Runner: This doesn\'t appear to be a WordPress project');
            return;
        }
        
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        
        if (!selectedText.trim()) {
            vscode.window.showErrorMessage('No text selected');
            return;
        }
        
        runPHPCode(selectedText, 'eval');
    });

    // Register command to run entire file in wp shell
    let runFileInShellCommand = vscode.commands.registerCommand('wp-runner.runFileInShell', () => {
        if (!isWordPressProject) {
            vscode.window.showErrorMessage('WordPress Runner: This doesn\'t appear to be a WordPress project');
            return;
        }
        
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        
        const document = editor.document;
        if (document.languageId !== 'php') {
            vscode.window.showErrorMessage('This command only works with PHP files');
            return;
        }
        
        const code = document.getText();
        runPHPCode(code, 'shell');
    });
    
    // Register command to run selected text in wp shell
    let runSelectionInShellCommand = vscode.commands.registerCommand('wp-runner.runSelectionInShell', () => {
        if (!isWordPressProject) {
            vscode.window.showErrorMessage('WordPress Runner: This doesn\'t appear to be a WordPress project');
            return;
        }
        
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        
        if (!selectedText.trim()) {
            vscode.window.showErrorMessage('No text selected');
            return;
        }
        
        runPHPCode(selectedText, 'shell');
    });

    // Register command to open wp shell
    let openShellCommand = vscode.commands.registerCommand('wp-runner.openShell', () => {
        if (!isWordPressProject) {
            vscode.window.showErrorMessage('WordPress Runner: This doesn\'t appear to be a WordPress project');
            return;
        }
        
        openWordPressShell();
    });
    
    context.subscriptions.push(
        runFileCommand, 
        runSelectionCommand, 
        runFileInShellCommand, 
        runSelectionInShellCommand, 
        openShellCommand
    );
}

function checkWordPressProject() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        isWordPressProject = false;
        updateContext();
        return;
    }
    
    const workspacePath = workspaceFolder.uri.fsPath;
    
    // Check for WordPress indicators
    const wpIndicators = [
        'wp-config.php',
        'wp-config-sample.php',
        'wp-load.php',
        'wp-blog-header.php'
    ];
    
    // Check for wp-content directory
    const wpContentPath = path.join(workspacePath, 'wp-content');
    const hasWpContent = fs.existsSync(wpContentPath);
    
    // Check for any WordPress core files
    const hasWpFiles = wpIndicators.some(file => 
        fs.existsSync(path.join(workspacePath, file))
    );
    
    // Check for composer.json with WordPress dependencies
    const composerPath = path.join(workspacePath, 'composer.json');
    let hasWpComposer = false;
    if (fs.existsSync(composerPath)) {
        try {
            const composerContent = fs.readFileSync(composerPath, 'utf8');
            const composer = JSON.parse(composerContent);
            const deps = { ...composer.dependencies, ...composer['require-dev'] };
            hasWpComposer = Object.keys(deps).some(dep => 
                dep.includes('wordpress') || dep.includes('wp-')
            );
        } catch (e) {
            // Ignore JSON parse errors
        }
    }
    
    // Check if wp-cli is available (additional verification)
    isWordPressProject = hasWpContent || hasWpFiles || hasWpComposer;
    
    updateContext();
    
    if (isWordPressProject) {
        vscode.window.showInformationMessage('WordPress Runner: WordPress project detected!');
    }
}

function updateContext() {
    vscode.commands.executeCommand('setContext', 'wp-runner.isWordPressProject', isWordPressProject);
}

function runPHPCode(code: string, mode: 'eval' | 'shell') {
    // Remove <?php tag if present
    const cleanCode = code.replace(/^<\?php\s*\n?/i, '').trim();
    
    if (!cleanCode) {
        vscode.window.showErrorMessage('No PHP code to execute');
        return;
    }
    
    // Get workspace folder to run wp command from correct directory
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder found');
        return;
    }
    
    if (mode === 'eval') {
        // Check if we're running a full file or just a selection
        const editor = vscode.window.activeTextEditor;
        const isFullFile = editor && editor.document.getText().replace(/^<\?php\s*\n?/i, '').trim() === cleanCode;
        
        if (isFullFile && editor?.document.fileName.endsWith('.php')) {
            // Use wp eval-file for full file execution (cleaner output)
            const terminal = vscode.window.createTerminal({
                name: 'WordPress Runner (eval-file)',
                cwd: workspaceFolder.uri.fsPath
            });
            
            terminal.show();
            terminal.sendText(`wp eval-file "${editor.document.fileName}"`);
        } else {
            // Use wp eval for selections or non-file content
            const terminal = vscode.window.createTerminal({
                name: 'WordPress Runner (eval)',
                cwd: workspaceFolder.uri.fsPath
            });
            
            // Create a temporary file for the code
            const tempDir = os.tmpdir();
            const tempFile = path.join(tempDir, `wp-runner-${Date.now()}.php`);
            const phpCode = `<?php\n${cleanCode}`;
            
            try {
                fs.writeFileSync(tempFile, phpCode);
                
                terminal.show();
                terminal.sendText(`wp eval-file "${tempFile}" && rm "${tempFile}"`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to create temporary file: ${error}`);
                // Fallback to wp eval
                const escapedCode = cleanCode.replace(/'/g, "'\"'\"'");
                terminal.show();
                terminal.sendText(`wp eval '${escapedCode}'`);
            }
        }
    } else {
        // Use wp shell for interactive execution
        runInWordPressShell(cleanCode, workspaceFolder.uri.fsPath);
    }
}

function runInWordPressShell(code: string, workspacePath: string) {
    // Find existing WordPress shell terminal or create new one
    let shellTerminal = vscode.window.terminals.find(terminal => 
        terminal.name === 'WordPress Shell (Interactive)'
    );
    
    if (!shellTerminal) {
        // Create new shell terminal
        shellTerminal = vscode.window.createTerminal({
            name: 'WordPress Shell (Interactive)',
            cwd: workspacePath
        });
        
        // Start wp shell
        shellTerminal.show();
        shellTerminal.sendText('wp shell');
        
        // Wait a moment for shell to initialize, then send code
        setTimeout(() => {
            if (shellTerminal) {
                sendCodeToShell(shellTerminal, code);
            }
        }, 2000);
    } else {
        // Use existing shell
        shellTerminal.show();
        sendCodeToShell(shellTerminal, code);
    }
}

function sendCodeToShell(terminal: vscode.Terminal, code: string) {
    // Split code into lines and send each line separately
    // This works better with PsySH's interactive nature
    const lines = code.split('\n').filter(line => line.trim() !== '');
    
    lines.forEach((line, index) => {
        // Add a small delay between lines to ensure proper execution
        setTimeout(() => {
            terminal.sendText(line.trim());
        }, index * 100);
    });
}

function openWordPressShell() {
    // Get workspace folder
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder found');
        return;
    }
    
    // Check if WordPress shell is already open
    let shellTerminal = vscode.window.terminals.find(terminal => 
        terminal.name === 'WordPress Shell (Interactive)'
    );
    
    if (shellTerminal) {
        // Focus existing shell
        shellTerminal.show();
        vscode.window.showInformationMessage('WordPress Shell is already open');
    } else {
        // Create new shell
        shellTerminal = vscode.window.createTerminal({
            name: 'WordPress Shell (Interactive)',
            cwd: workspaceFolder.uri.fsPath
        });
        
        shellTerminal.show();
        shellTerminal.sendText('wp shell');
        vscode.window.showInformationMessage('WordPress Shell opened. You can now interact with WordPress directly!');
    }
}

export function deactivate() {} 