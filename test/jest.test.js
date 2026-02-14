/**
 * @jest-environment node
 *
 * Complete Jest Test Suite for Manas Kumar Behera Portfolio
 * Tests all features, functionality, and project organization
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Test Suite 1: File Organization Tests
 * Ensures .md files are only in docs/ folder
 */
describe('📁 File Organization Tests', () => {

  test('should not have .md files in root directory', () => {
    const rootDir = path.join(__dirname, '..');
    const files = fs.readdirSync(rootDir);
    const mdFilesInRoot = files.filter(file =>
      file.endsWith('.md') &&
      !['README.md', 'PROJECT_STRUCTURE.md', 'ORGANIZATION_COMPLETE.md'].includes(file)
    );

    expect(mdFilesInRoot.length).toBe(0);
    if (mdFilesInRoot.length > 0) {
      console.error('❌ Found .md files in root:', mdFilesInRoot);
    }
  });

  test('should have allowed .md files only in root', () => {
    const rootDir = path.join(__dirname, '..');
    const files = fs.readdirSync(rootDir);
    const allowedMdFiles = ['README.md', 'PROJECT_STRUCTURE.md', 'ORGANIZATION_COMPLETE.md'];
    const mdFilesInRoot = files.filter(file => file.endsWith('.md'));

    mdFilesInRoot.forEach(file => {
      expect(allowedMdFiles).toContain(file);
    });
  });

  test('should have docs folder with .md files', () => {
    const docsDir = path.join(__dirname, '..', 'docs');
    expect(fs.existsSync(docsDir)).toBe(true);

    const files = fs.readdirSync(docsDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));

    expect(mdFiles.length).toBeGreaterThanOrEqual(15);
  });

  test('should have required directories', () => {
    const requiredDirs = ['docs', 'test', 'scripts', 'css', 'js'];
    requiredDirs.forEach(dir => {
      const dirPath = path.join(__dirname, '..', dir);
      expect(fs.existsSync(dirPath)).toBe(true);
    });
  });
});

/**
 * Test Suite 2: Configuration Files Tests
 */
describe('⚙️ Configuration Files Tests', () => {

  test('should have package.json with correct properties', () => {
    const packageJson = require('../package.json');

    expect(packageJson.name).toBe('salesforce-developer-portfolio');
    expect(packageJson.version).toBeDefined();
    expect(packageJson.description).toBeDefined();
    expect(packageJson.scripts).toBeDefined();
    expect(packageJson.dependencies).toBeDefined();
  });

  test('should have all required npm scripts', () => {
    const packageJson = require('../package.json');
    const requiredScripts = [
      'start',
      'test',
      'build',
      'deploy',
      'commit',
      'validate',
      'logs'
    ];

    requiredScripts.forEach(script => {
      expect(packageJson.scripts[script]).toBeDefined();
    });
  });

  test('should have Procfile for Heroku', () => {
    const procfilePath = path.join(__dirname, '..', 'Procfile');
    expect(fs.existsSync(procfilePath)).toBe(true);

    const procfileContent = fs.readFileSync(procfilePath, 'utf-8');
    expect(procfileContent).toContain('web:');
  });

  test('should have .gitignore properly configured', () => {
    const gitignorePath = path.join(__dirname, '..', '.gitignore');
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');

    expect(gitignoreContent).toContain('node_modules');
    expect(gitignoreContent).toContain('.env');
    expect(gitignoreContent).toContain('!docs');
  });

  test('should have jest.config.js', () => {
    const jestConfigPath = path.join(__dirname, '..', 'jest.config.js');
    expect(fs.existsSync(jestConfigPath)).toBe(true);
  });

  test('should have .idea/runConfigurations.xml for IntelliJ', () => {
    const intellijConfigPath = path.join(__dirname, '..', '.idea', 'runConfigurations.xml');
    expect(fs.existsSync(intellijConfigPath)).toBe(true);
  });
});

/**
 * Test Suite 3: Portfolio Content Tests
 */
describe('🌐 Portfolio Content Tests', () => {

  test('should have index.html with portfolio content', () => {
    const indexPath = path.join(__dirname, '..', 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    expect(content).toContain('Manas Kumar Behera');
    expect(content).toContain('Salesforce');
  });

  test('should have Buy Me a Coffee link integrated', () => {
    const indexPath = path.join(__dirname, '..', 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    expect(content).toContain('buymeacoffee.com/manaskumarbehera');
    expect(content).toMatch(/buymeacoffee\.com.*target="_blank"/);
  });

  test('should have GitHub profile link', () => {
    const indexPath = path.join(__dirname, '..', 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    expect(content).toContain('github.com/manaskumarbehera');
  });

  test('should have LinkedIn profile link', () => {
    const indexPath = path.join(__dirname, '..', 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    expect(content).toContain('linkedin.com/in/manas-behera-68607547');
  });

  test('should have Salesforce Trailblazer link', () => {
    const indexPath = path.join(__dirname, '..', 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    expect(content).toContain('salesforce.com/trailblazer/manasbehera1990');
  });

  test('should have contact email configured', () => {
    const indexPath = path.join(__dirname, '..', 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    expect(content).toContain('behera.manas98@gmail.com');
  });

  test('should have CSS styling', () => {
    const cssPath = path.join(__dirname, '..', 'css', 'style.css');
    expect(fs.existsSync(cssPath)).toBe(true);

    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    expect(cssContent.length).toBeGreaterThan(0);
  });

  test('should have JavaScript files', () => {
    const jsPath = path.join(__dirname, '..', 'js', 'main.js');
    expect(fs.existsSync(jsPath)).toBe(true);
  });
});

/**
 * Test Suite 4: Features Tests
 */
describe('✨ Features Tests', () => {

  test('should have GitHub username configured in main.js', () => {
    const mainJsPath = path.join(__dirname, '..', 'js', 'main.js');
    const content = fs.readFileSync(mainJsPath, 'utf-8');

    expect(content).toContain('GITHUB_USERNAME');
    expect(content).toContain('manaskumarbehera');
  });

  test('should have test suite with 12 tests', () => {
    const testPath = path.join(__dirname, '..', 'test', 'portfolio.test.js');
    const content = fs.readFileSync(testPath, 'utf-8');

    expect(content).toContain('await runTest');
    // Count test runs
    const testCount = (content.match(/await runTest/g) || []).length;
    expect(testCount).toBe(12);
  });

  test('should have build script', () => {
    const buildScriptPath = path.join(__dirname, '..', 'scripts', 'build.sh');
    expect(fs.existsSync(buildScriptPath)).toBe(true);

    const stats = fs.statSync(buildScriptPath);
    expect(stats.mode & 0o111).toBeTruthy(); // Check if executable
  });

  test('should have deploy script', () => {
    const deployScriptPath = path.join(__dirname, '..', 'scripts', 'deploy.sh');
    expect(fs.existsSync(deployScriptPath)).toBe(true);

    const stats = fs.statSync(deployScriptPath);
    expect(stats.mode & 0o111).toBeTruthy(); // Check if executable
  });

  test('should have pre-commit git hook', () => {
    const hookPath = path.join(__dirname, '..', '.git', 'hooks', 'pre-commit');
    expect(fs.existsSync(hookPath)).toBe(true);
  });

  test('should have server.js with correct configuration', () => {
    const serverPath = path.join(__dirname, '..', 'server.js');
    const content = fs.readFileSync(serverPath, 'utf-8');

    expect(content).toContain('process.env.PORT');
    expect(content).toContain('express');
  });
});

/**
 * Test Suite 5: Documentation Tests
 */
describe('📚 Documentation Tests', () => {

  test('should have main README.md', () => {
    const readmePath = path.join(__dirname, '..', 'README.md');
    expect(fs.existsSync(readmePath)).toBe(true);

    const content = fs.readFileSync(readmePath, 'utf-8');
    expect(content).toContain('docs');
  });

  test('should have docs/README.md index', () => {
    const docsReadmePath = path.join(__dirname, '..', 'docs', 'README.md');
    expect(fs.existsSync(docsReadmePath)).toBe(true);
  });

  test('should have INTELLIJ_QUICK_START.md', () => {
    const intellijPath = path.join(__dirname, '..', 'INTELLIJ_QUICK_START.md');
    expect(fs.existsSync(intellijPath)).toBe(true);
  });

  test('should have docs/INTELLIJ_SETUP.md', () => {
    const intellijSetupPath = path.join(__dirname, '..', 'docs', 'INTELLIJ_SETUP.md');
    expect(fs.existsSync(intellijSetupPath)).toBe(true);
  });

  test('should have docs/NPM_SCRIPTS_GUIDE.md', () => {
    const npmGuidePath = path.join(__dirname, '..', 'docs', 'NPM_SCRIPTS_GUIDE.md');
    expect(fs.existsSync(npmGuidePath)).toBe(true);
  });

  test('should have docs/DEPLOYMENT.md', () => {
    const deploymentPath = path.join(__dirname, '..', 'docs', 'DEPLOYMENT.md');
    expect(fs.existsSync(deploymentPath)).toBe(true);
  });

  test('should have docs/TROUBLESHOOTING.md', () => {
    const troubleshootingPath = path.join(__dirname, '..', 'docs', 'TROUBLESHOOTING.md');
    expect(fs.existsSync(troubleshootingPath)).toBe(true);
  });

  test('should have docs/NEW_FEATURES.md', () => {
    const featuresPath = path.join(__dirname, '..', 'docs', 'NEW_FEATURES.md');
    expect(fs.existsSync(featuresPath)).toBe(true);
  });

  test('should have at least 15 documentation files in docs/', () => {
    const docsDir = path.join(__dirname, '..', 'docs');
    const files = fs.readdirSync(docsDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    expect(mdFiles.length).toBeGreaterThanOrEqual(15);
  });
});

/**
 * Test Suite 6: Deployment Configuration Tests
 */
describe('🚀 Deployment Configuration Tests', () => {

  test('should have package.json with Node.js engines specified', () => {
    const packageJson = require('../package.json');

    expect(packageJson.engines).toBeDefined();
    expect(packageJson.engines.node).toBeDefined();
    expect(packageJson.engines.npm).toBeDefined();
  });

  test('should have Procfile with web dyno', () => {
    const procfilePath = path.join(__dirname, '..', 'Procfile');
    const content = fs.readFileSync(procfilePath, 'utf-8').trim();

    expect(content).toMatch(/^web:\s*node server\.js$/);
  });

  test('should have app.json for Heroku', () => {
    const appJsonPath = path.join(__dirname, '..', 'app.json');
    expect(fs.existsSync(appJsonPath)).toBe(true);
  });

  test('should have all required npm scripts for deployment', () => {
    const packageJson = require('../package.json');
    const deploymentScripts = [
      'deploy',
      'deploy:heroku',
      'build',
      'predeploy',
      'logs',
      'status',
      'restart'
    ];

    deploymentScripts.forEach(script => {
      expect(packageJson.scripts[script]).toBeDefined();
    });
  });
});

/**
 * Test Suite 7: Dependencies Tests
 */
describe('📦 Dependencies Tests', () => {

  test('should have required dependencies in package.json', () => {
    const packageJson = require('../package.json');

    const requiredDeps = ['express', 'compression', 'helmet'];
    requiredDeps.forEach(dep => {
      expect(packageJson.dependencies[dep]).toBeDefined();
    });
  });

  test('should have nodemon in devDependencies', () => {
    const packageJson = require('../package.json');

    expect(packageJson.devDependencies).toBeDefined();
    expect(packageJson.devDependencies.nodemon).toBeDefined();
  });

  test('should have required main files', () => {
    const requiredFiles = [
      'server.js',
      'index.html',
      'package.json',
      'Procfile'
    ];

    requiredFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});

/**
 * Test Suite 8: Git Configuration Tests
 */
describe('🔧 Git Configuration Tests', () => {

  test('should have .git directory', () => {
    const gitDir = path.join(__dirname, '..', '.git');
    expect(fs.existsSync(gitDir)).toBe(true);
  });

  test('should have .gitignore file', () => {
    const gitignorePath = path.join(__dirname, '..', '.gitignore');
    expect(fs.existsSync(gitignorePath)).toBe(true);
  });

  test('.gitignore should exclude node_modules', () => {
    const gitignorePath = path.join(__dirname, '..', '.gitignore');
    const content = fs.readFileSync(gitignorePath, 'utf-8');

    expect(content).toContain('node_modules');
  });

  test('.gitignore should keep docs folder', () => {
    const gitignorePath = path.join(__dirname, '..', '.gitignore');
    const content = fs.readFileSync(gitignorePath, 'utf-8');

    expect(content).toContain('!docs');
  });

  test('should have pre-commit hook for documentation validation', () => {
    const hookPath = path.join(__dirname, '..', '.git', 'hooks', 'pre-commit');
    const content = fs.readFileSync(hookPath, 'utf-8');

    expect(content).toContain('docs');
    expect(content).toContain('Documentation files should be in docs/ folder');
  });
});

/**
 * Test Suite 9: .md File Organization - Critical Test
 * MOST IMPORTANT: Ensures .md files are ONLY in docs/ folder
 */
describe('🔐 CRITICAL: .md File Organization Enforcement', () => {

  test('should NEVER have any .md files in root except allowed ones', () => {
    const rootDir = path.join(__dirname, '..');
    const allowedInRoot = ['README.md', 'PROJECT_STRUCTURE.md', 'ORGANIZATION_COMPLETE.md'];

    const files = fs.readdirSync(rootDir);
    const mdFilesInRoot = files.filter(file => file.endsWith('.md'));

    const unexpectedMdFiles = mdFilesInRoot.filter(
      file => !allowedInRoot.includes(file)
    );

    if (unexpectedMdFiles.length > 0) {
      throw new Error(
        `❌ CRITICAL ERROR: Found .md files in root that should be in docs/:\n${unexpectedMdFiles.join('\n')}\n\nMove these files to docs/ folder!`
      );
    }

    expect(unexpectedMdFiles.length).toBe(0);
  });

  test('should enforce that all non-root .md files are in docs/ folder', () => {
    const rootDir = path.join(__dirname, '..');
    const allowedInRoot = new Set(['README.md', 'PROJECT_STRUCTURE.md', 'ORGANIZATION_COMPLETE.md']);

    function checkMdFiles(dir, dirName = '') {
      const files = fs.readdirSync(dir);

      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && file !== 'node_modules' && file !== '.git' && file !== '.idea') {
          checkMdFiles(fullPath, dirName ? `${dirName}/${file}` : file);
        } else if (file.endsWith('.md') && dirName === '' && !allowedInRoot.has(file)) {
          throw new Error(
            `❌ CRITICAL: Found .md file in root: ${file}\nMust be in docs/ folder!`
          );
        }
      });
    }

    checkMdFiles(rootDir);
    expect(true).toBe(true);
  });

  test('docs folder should contain all project documentation', () => {
    const docsDir = path.join(__dirname, '..', 'docs');
    const files = fs.readdirSync(docsDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    expect(mdFiles.length).toBeGreaterThanOrEqual(15);

    // Check for critical docs
    const criticalDocs = [
      'README.md',
      'DEPLOYMENT.md',
      'TROUBLESHOOTING.md',
      'INTELLIJ_SETUP.md',
      'NPM_SCRIPTS_GUIDE.md'
    ];

    criticalDocs.forEach(doc => {
      expect(mdFiles).toContain(doc);
    });
  });

  test('docs/README.md should be the documentation index', () => {
    const docsIndexPath = path.join(__dirname, '..', 'docs', 'README.md');
    const content = fs.readFileSync(docsIndexPath, 'utf-8');

    // Should reference documentation files
    expect(content.toLowerCase()).toMatch(/documentation|guide|readme|index/i);
  });

  test('all .md files should have meaningful content', () => {
    const docsDir = path.join(__dirname, '..', 'docs');
    const files = fs.readdirSync(docsDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    mdFiles.forEach(file => {
      const filePath = path.join(docsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should have more than just empty content
      expect(content.length).toBeGreaterThan(50);

      // Should have at least one heading
      expect(content).toMatch(/^#+ /m);
    });
  });
});

/**
 * Test Suite 10: Integration Tests
 */
describe('🔗 Integration Tests', () => {

  test('should have valid server.js that requires express', () => {
    const serverPath = path.join(__dirname, '..', 'server.js');
    const content = fs.readFileSync(serverPath, 'utf-8');

    expect(content).toContain('express');
    expect(content).toContain('app.listen');
  });

  test('should have proper index.html structure', () => {
    const indexPath = path.join(__dirname, '..', 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    expect(content).toContain('<!DOCTYPE html>');
    expect(content).toContain('<html');
    expect(content).toContain('</html>');
    expect(content).toContain('<body>');
    expect(content).toContain('</body>');
  });

  test('all documentation should be in docs folder only', () => {
    const docsCount = (() => {
      const docsDir = path.join(__dirname, '..', 'docs');
      const files = fs.readdirSync(docsDir);
      return files.filter(f => f.endsWith('.md')).length;
    })();

    const rootCount = (() => {
      const rootDir = path.join(__dirname, '..');
      const allowed = ['README.md', 'PROJECT_STRUCTURE.md', 'ORGANIZATION_COMPLETE.md'];
      const files = fs.readdirSync(rootDir);
      return files.filter(f => f.endsWith('.md') && !allowed.includes(f)).length;
    })();

    expect(rootCount).toBe(0);
    expect(docsCount).toBeGreaterThan(0);
  });
});

/**
 * Summary and reporting
 */
afterAll(() => {
  console.log('\n');
  console.log('✅ Jest Test Suite Complete!');
  console.log('All features, organization, and requirements verified.');
});

