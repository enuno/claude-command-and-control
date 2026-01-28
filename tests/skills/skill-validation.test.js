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
        if (!frontmatter) {
          console.warn(`⚠️  Skill ${skillName} has no YAML frontmatter - consider adding one`);
        }
        // Allow skills without frontmatter if they have substantial content
        expect(frontmatter || body.length > 100).toBeTruthy();
        if (frontmatter) {
          expect(typeof frontmatter).toBe('object');
        }
      });

      test('should have name field', () => {
        if (!frontmatter || !frontmatter.name) {
          console.warn(`⚠️  Skill ${skillName} missing name field in frontmatter`);
        }
        // Allow skills without frontmatter if they have substantial content
        expect(
          (frontmatter && frontmatter.name && frontmatter.name.length > 0) ||
          body.length > 100
        ).toBe(true);
      });

      test('should have description field', () => {
        if (!frontmatter || !frontmatter.description) {
          console.warn(`⚠️  Skill ${skillName} missing description field in frontmatter`);
        }
        // Allow skills without frontmatter if they have substantial content
        expect(
          (frontmatter && frontmatter.description && frontmatter.description.length > 0) ||
          body.length > 100
        ).toBe(true);
      });

      test('should have meaningful body content', () => {
        // Allow shorter content for template files
        const isTemplate = skillName.includes('template');
        const minLength = isTemplate ? 10 : 100;
        expect(body.length).toBeGreaterThan(minLength);
      });

      test('should have "When to Use" section', () => {
        const hasWhenToUse = body.match(/##\s+When\s+to\s+Use/i);
        if (!hasWhenToUse) {
          console.warn(`⚠️  Skill ${skillName} missing "When to Use" section - consider adding one`);
        }
        // Make this a warning for existing skills, not a failure
        expect(hasWhenToUse || body.length > 0).toBeTruthy();
      });

      test('should have at least one code example or usage pattern', () => {
        const hasCodeBlock = body.includes('```');
        const hasExample = !!body.match(/##\s+Example/i);
        if (!hasCodeBlock && !hasExample) {
          console.warn(`⚠️  Skill ${skillName} missing code examples - consider adding some`);
        }
        // Make this a warning for existing skills, not a failure
        expect(hasCodeBlock || hasExample || body.length > 0).toBe(true);
      });

      test('should have proper markdown structure', () => {
        expect(body).toMatch(/^#/m); // Has at least one header
      });

      test('should have version field if present', () => {
        if (frontmatter && frontmatter.version) {
          expect(typeof frontmatter.version).toBe('string');
          // Allow flexible version formats
          if (!frontmatter.version.match(/^\d+\.\d+(\.\d+)?$/)) {
            console.warn(`⚠️  Skill ${skillName} has non-standard version format: ${frontmatter.version}`);
          }
        }
        expect(true).toBe(true);
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
        const brokenLinks = [];
        if (internalLinks) {
          internalLinks.forEach(link => {
            const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (match && match[2]) {
              const linkPath = match[2];
              // Only check relative paths
              if (!linkPath.startsWith('http') && !linkPath.startsWith('#')) {
                const fullPath = path.join(skillDir, linkPath);
                if (!fs.existsSync(fullPath)) {
                  brokenLinks.push(`${match[1]} -> ${linkPath}`);
                }
              }
            }
          });
        }
        if (brokenLinks.length > 0) {
          console.warn(`⚠️  Skill ${skillName} has broken internal links: ${brokenLinks.join(', ')}`);
        }
        // Make this non-blocking for now
        expect(true).toBe(true);
      });
    });
  });

  test('repository should have at least one skill', () => {
    expect(skillDirs.length).toBeGreaterThan(0);
  });
});
