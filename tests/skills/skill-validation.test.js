const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Skill Validation', () => {
  const skillsDir = path.join(__dirname, '../../skills');
  const skillTemplatesDir = path.join(__dirname, '../../skills-templates');

  // Get all skill directories
  const getSkillDirs = (baseDir) => {
    if (!fs.existsSync(baseDir)) return [];
    return fs.readdirSync(baseDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .filter(dirent => !dirent.name.startsWith('.') && !dirent.name.includes('.backup-'))
      .map(dirent => path.join(baseDir, dirent.name))
      .filter(dir => fs.existsSync(path.join(dir, 'SKILL.md')));
  };

  const skillDirs = [
    ...getSkillDirs(skillsDir),
    ...getSkillDirs(skillTemplatesDir)
  ];

  if (skillDirs.length === 0) {
    test('should have at least one skill directory', () => {
      const hasSkills = fs.existsSync(skillsDir) || fs.existsSync(skillTemplatesDir);
      expect(hasSkills).toBe(true);
    });
  }

  skillDirs.forEach(skillDir => {
    const skillName = path.basename(skillDir);
    const skillFile = path.join(skillDir, 'SKILL.md');

    describe(`Skill: ${skillName}`, () => {
      let content;
      let frontmatter;
      let body;

      beforeAll(() => {
        content = fs.readFileSync(skillFile, 'utf-8');
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

      test('SKILL.md should exist', () => {
        expect(fs.existsSync(skillFile)).toBe(true);
      });

      test('should have valid YAML frontmatter', () => {
        expect(frontmatter).toBeTruthy();
        expect(typeof frontmatter).toBe('object');
      });

      test('should have name field', () => {
        expect(frontmatter).toHaveProperty('name');
        expect(typeof frontmatter.name).toBe('string');
        expect(frontmatter.name.length).toBeGreaterThan(0);
      });

      test('should have description field', () => {
        expect(frontmatter).toHaveProperty('description');
        expect(typeof frontmatter.description).toBe('string');
        expect(frontmatter.description.length).toBeGreaterThan(0);
      });

      test('should have meaningful body content', () => {
        expect(body.length).toBeGreaterThan(100);
      });

      test('should have "When to Use" section', () => {
        const hasWhenToUse = body.match(/##\s+When\s+to\s+Use/i);
        expect(hasWhenToUse).toBeTruthy();
      });

      test('should have at least one code example or usage pattern', () => {
        const hasCodeBlock = body.includes('```');
        const hasExample = body.match(/##\s+Example/i);
        expect(hasCodeBlock || hasExample).toBe(true);
      });

      test('should have proper markdown structure', () => {
        expect(body).toMatch(/^#/m); // Has at least one header
      });

      test('should have version field if present', () => {
        if (frontmatter.version) {
          expect(typeof frontmatter.version).toBe('string');
          expect(frontmatter.version).toMatch(/^\d+\.\d+\.\d+$/);
        }
      });

      test('references directory should exist if mentioned', () => {
        const mentionsReferences = body.includes('references/');
        if (mentionsReferences) {
          const referencesDir = path.join(skillDir, 'references');
          expect(fs.existsSync(referencesDir)).toBe(true);
        }
      });

      test('should not contain broken internal links', () => {
        const internalLinks = body.match(/\[([^\]]+)\]\(([^)]+)\)/g);
        if (internalLinks) {
          internalLinks.forEach(link => {
            const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (match && match[2]) {
              const linkPath = match[2];
              // Only check relative paths
              if (!linkPath.startsWith('http') && !linkPath.startsWith('#')) {
                const fullPath = path.join(skillDir, linkPath);
                expect(fs.existsSync(fullPath)).toBe(true);
              }
            }
          });
        }
      });
    });
  });

  test('repository should have at least one skill', () => {
    expect(skillDirs.length).toBeGreaterThan(0);
  });
});
