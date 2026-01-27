const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Command Validation', () => {
  const commandsDir = path.join(__dirname, '../../.claude/commands');

  // Get all .md files in commands directory (excluding CLAUDE.md context files)
  const getCommandFiles = () => {
    if (!fs.existsSync(commandsDir)) return [];
    return fs.readdirSync(commandsDir)
      .filter(file => file.endsWith('.md') && file !== 'CLAUDE.md')
      .map(file => path.join(commandsDir, file));
  };

  const commandFiles = getCommandFiles();

  if (commandFiles.length === 0) {
    test('commands directory should exist', () => {
      expect(fs.existsSync(commandsDir)).toBe(true);
    });
  }

  commandFiles.forEach(commandFile => {
    const commandName = path.basename(commandFile, '.md');

    describe(`Command: ${commandName}`, () => {
      let content;
      let frontmatter;
      let body;

      beforeAll(() => {
        content = fs.readFileSync(commandFile, 'utf-8');
        const parts = content.split('---');

        if (parts.length >= 3) {
          try {
            frontmatter = yaml.load(parts[1]);
            body = parts.slice(2).join('---').trim();
          } catch (e) {
            frontmatter = null;
            body = content;
          }
        } else {
          frontmatter = null;
          body = content;
        }
      });

      test('should have valid YAML frontmatter', () => {
        expect(frontmatter).toBeTruthy();
        expect(typeof frontmatter).toBe('object');
      });

      test('should have description field', () => {
        expect(frontmatter).toHaveProperty('description');
        expect(typeof frontmatter.description).toBe('string');
        expect(frontmatter.description.length).toBeGreaterThan(0);
      });

      test('should have allowed-tools field', () => {
        expect(frontmatter).toHaveProperty('allowed-tools');
        expect(Array.isArray(frontmatter['allowed-tools'])).toBe(true);
      });

      test('allowed-tools should contain valid tool patterns', () => {
        const tools = frontmatter['allowed-tools'];
        const validToolPatterns = [
          'Bash', 'Read', 'Write', 'Edit', 'Glob', 'Grep',
          'Task', 'WebFetch', 'WebSearch', 'AskUserQuestion'
        ];

        tools.forEach(tool => {
          expect(typeof tool).toBe('string');
          const baseToolName = tool.split('(')[0];
          const isValidTool = validToolPatterns.some(valid =>
            baseToolName.includes(valid)
          );
          expect(isValidTool).toBe(true);
        });
      });

      test('should have non-empty body content', () => {
        expect(body.length).toBeGreaterThan(0);
      });

      test('should have proper markdown structure', () => {
        expect(body).toMatch(/^#/m); // Has at least one header
      });

      test('should not have malicious commands if using Bash', () => {
        const hasBashTool = frontmatter['allowed-tools'].some(tool =>
          tool.includes('Bash')
        );

        if (hasBashTool) {
          // Check for dangerous patterns in body
          const dangerousPatterns = [
            /rm\s+-rf\s+\//,  // rm -rf /
            /:\(\)\{.*\}.*:/,  // Fork bombs
            /eval.*\$/,        // Eval with variables
          ];

          dangerousPatterns.forEach(pattern => {
            expect(body).not.toMatch(pattern);
          });
        }
      });

      test('should have version field if present', () => {
        if (frontmatter.version) {
          expect(typeof frontmatter.version).toBe('string');
          // Should match semantic versioning pattern
          expect(frontmatter.version).toMatch(/^\d+\.\d+\.\d+$/);
        }
      });
    });
  });

  test('repository should have at least one command', () => {
    expect(commandFiles.length).toBeGreaterThan(0);
  });
});
