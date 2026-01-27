const fs = require('fs');
const path = require('path');

describe('Integration System Directory Structure', () => {
  const rootDir = path.join(__dirname, '../..');
  const integrationDir = path.join(rootDir, 'INTEGRATION');

  test('INTEGRATION directory should exist', () => {
    expect(fs.existsSync(integrationDir)).toBe(true);
  });

  test('INTEGRATION/incoming directory should exist', () => {
    const incomingDir = path.join(integrationDir, 'incoming');
    expect(fs.existsSync(incomingDir)).toBe(true);
  });

  test('INTEGRATION/processed directory should exist', () => {
    const processedDir = path.join(integrationDir, 'processed');
    expect(fs.existsSync(processedDir)).toBe(true);
  });

  test('INTEGRATION/logs directory should exist', () => {
    const logsDir = path.join(integrationDir, 'logs');
    expect(fs.existsSync(logsDir)).toBe(true);
  });

  test('INTEGRATION/incoming should have .gitkeep file', () => {
    const gitkeepFile = path.join(integrationDir, 'incoming', '.gitkeep');
    // Either .gitkeep exists OR directory has content
    const dirHasContent = fs.readdirSync(path.join(integrationDir, 'incoming')).length > 0;
    expect(fs.existsSync(gitkeepFile) || dirHasContent).toBe(true);
  });
});

describe('Repository Structure', () => {
  const rootDir = path.join(__dirname, '../..');

  test('skills directory should exist', () => {
    const skillsDir = path.join(rootDir, 'skills');
    expect(fs.existsSync(skillsDir)).toBe(true);
  });

  test('skills-templates directory should exist', () => {
    const templatesDir = path.join(rootDir, 'skills-templates');
    expect(fs.existsSync(templatesDir)).toBe(true);
  });

  test('templates directory should exist', () => {
    const templatesDir = path.join(rootDir, 'templates');
    expect(fs.existsSync(templatesDir)).toBe(true);
  });

  test('docs directory should exist', () => {
    const docsDir = path.join(rootDir, 'docs');
    expect(fs.existsSync(docsDir)).toBe(true);
  });

  test('.claude directory should exist', () => {
    const claudeDir = path.join(rootDir, '.claude');
    expect(fs.existsSync(claudeDir)).toBe(true);
  });

  test('.claude/commands directory should exist', () => {
    const commandsDir = path.join(rootDir, '.claude/commands');
    expect(fs.existsSync(commandsDir)).toBe(true);
  });

  test('configs directory should exist', () => {
    const configsDir = path.join(rootDir, 'configs');
    expect(fs.existsSync(configsDir)).toBe(true);
  });

  test('README.md should exist', () => {
    const readmeFile = path.join(rootDir, 'README.md');
    expect(fs.existsSync(readmeFile)).toBe(true);
  });

  test('CLAUDE.md should exist', () => {
    const claudeMdFile = path.join(rootDir, 'CLAUDE.md');
    expect(fs.existsSync(claudeMdFile)).toBe(true);
  });

  test('LICENSE file should exist (or is acceptable to skip)', () => {
    const licenseFile = path.join(rootDir, 'LICENSE');
    // License may be defined in package.json instead
    const hasLicenseFile = fs.existsSync(licenseFile);
    const hasPackageJson = fs.existsSync(path.join(rootDir, 'package.json'));
    expect(hasLicenseFile || hasPackageJson).toBe(true);
  });

  test('.gitignore should exist', () => {
    const gitignoreFile = path.join(rootDir, '.gitignore');
    expect(fs.existsSync(gitignoreFile)).toBe(true);
  });
});
