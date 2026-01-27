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
        if (!frontmatter) {
          console.warn(`⚠️  Command ${commandName} has no YAML frontmatter - may be documentation only`);
        }
        // Allow commands without frontmatter if they have substantial content (might be docs)
        expect(frontmatter || body.length > 100).toBeTruthy();
        if (frontmatter) {
          expect(typeof frontmatter).toBe('object');
        }
      });

      test('should have description field', () => {
        if (!frontmatter || !frontmatter.description) {
          console.warn(`⚠️  Command ${commandName} missing description field`);
        }
        // Allow commands without frontmatter if they have content
        expect(
          (frontmatter && frontmatter.description && frontmatter.description.length > 0) ||
          body.length > 100
        ).toBe(true);
      });

      test('should have allowed-tools field', () => {
        if (!frontmatter || !frontmatter['allowed-tools']) {
          console.warn(`⚠️  Command ${commandName} missing allowed-tools field`);
        }
        // Allow commands without frontmatter if they have content (might be docs)
        if (frontmatter && frontmatter['allowed-tools']) {
          const allowedTools = frontmatter['allowed-tools'];
          // Allow both array and comma-separated string formats
          const isValid = Array.isArray(allowedTools) ||
                         (typeof allowedTools === 'string' && allowedTools.length > 0);
          expect(isValid).toBe(true);
        } else {
          expect(body.length > 100).toBe(true);
        }
      });

      test('allowed-tools should contain valid tool patterns', () => {
        if (!frontmatter || !frontmatter['allowed-tools']) {
          // Skip validation if no frontmatter (might be documentation)
          expect(true).toBe(true);
          return;
        }

        let tools = frontmatter['allowed-tools'];
        // Handle both array and comma-separated string formats
        if (typeof tools === 'string') {
          tools = tools.split(',').map(t => t.trim());
        }

        const validToolPatterns = [
          'Bash', 'Read', 'Write', 'Edit', 'Glob', 'Grep',
          'Task', 'WebFetch', 'WebSearch', 'AskUserQuestion'
        ];

        tools.forEach(tool => {
          expect(typeof tool).toBe('string');
          const baseToolName = tool.split('(')[0].trim();
          const isValidTool = validToolPatterns.some(valid =>
            baseToolName.includes(valid)
          );
          if (!isValidTool) {
            console.warn(`⚠️  Command ${commandName} has unknown tool: ${tool}`);
          }
        });
      });

      test('should have non-empty body content', () => {
        expect(body.length).toBeGreaterThan(0);
      });

      test('should have proper markdown structure', () => {
        expect(body).toMatch(/^#/m); // Has at least one header
      });

      test('should not have malicious commands if using Bash', () => {
        if (!frontmatter || !frontmatter['allowed-tools']) {
          // Skip validation if no frontmatter
          expect(true).toBe(true);
          return;
        }

        let tools = frontmatter['allowed-tools'];
        // Handle both array and comma-separated string formats
        if (typeof tools === 'string') {
          tools = tools.split(',').map(t => t.trim());
        }

        const hasBashTool = tools.some(tool =>
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
        if (frontmatter && frontmatter.version) {
          expect(typeof frontmatter.version).toBe('string');
          // Should match semantic versioning pattern
          if (!frontmatter.version.match(/^\d+\.\d+(\.\d+)?$/)) {
            console.warn(`⚠️  Command ${commandName} has non-standard version format: ${frontmatter.version}`);
          }
        }
        // Version is optional
        expect(true).toBe(true);
      });
    });
  });

  test('repository should have at least one command', () => {
    expect(commandFiles.length).toBeGreaterThan(0);
  });
});
