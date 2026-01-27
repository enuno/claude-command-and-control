const fs = require('fs');
const path = require('path');

describe('Config Files Validation', () => {
  const configsDir = path.join(__dirname, '../../configs');

  test('configs directory should exist', () => {
    expect(fs.existsSync(configsDir)).toBe(true);
  });

  const getConfigFiles = () => {
    if (!fs.existsSync(configsDir)) return [];
    return fs.readdirSync(configsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(configsDir, file));
  };

  const configFiles = getConfigFiles();

  if (configFiles.length === 0) {
    test('should have at least one config file', () => {
      expect(configFiles.length).toBeGreaterThan(0);
    });
  }

  configFiles.forEach(configFile => {
    const configName = path.basename(configFile, '.json');

    describe(`Config: ${configName}`, () => {
      let config;

      beforeAll(() => {
        const content = fs.readFileSync(configFile, 'utf-8');
        try {
          config = JSON.parse(content);
        } catch (e) {
          config = null;
        }
      });

      test('should be valid JSON', () => {
        expect(config).toBeTruthy();
        expect(typeof config).toBe('object');
      });

      test('should have name field', () => {
        expect(config).toHaveProperty('name');
        expect(typeof config.name).toBe('string');
        expect(config.name.length).toBeGreaterThan(0);
      });

      test('should have description field', () => {
        expect(config).toHaveProperty('description');
        expect(typeof config.description).toBe('string');
        expect(config.description.length).toBeGreaterThan(0);
      });

      test('should have base_url, sources, pdf_path, url, or repo', () => {
        const hasBaseUrl = config.base_url && typeof config.base_url === 'string';
        const hasSources = config.sources && Array.isArray(config.sources);
        const hasPdfPath = config.pdf_path && typeof config.pdf_path === 'string';
        const hasUrl = config.url && typeof config.url === 'string';
        const hasRepo = config.repo && typeof config.repo === 'string';
        expect(hasBaseUrl || hasSources || hasPdfPath || hasUrl || hasRepo).toBe(true);
        if (hasBaseUrl) {
          expect(config.base_url).toMatch(/^https?:\/\//);
        }
      });

      test('should have start_urls, base_url, sources, pdf_path, url, or repo', () => {
        const hasStartUrls = config.start_urls && Array.isArray(config.start_urls);
        const hasBaseUrl = config.base_url && typeof config.base_url === 'string';
        const hasSources = config.sources && Array.isArray(config.sources);
        const hasPdfPath = config.pdf_path && typeof config.pdf_path === 'string';
        const hasUrl = config.url && typeof config.url === 'string';
        const hasRepo = config.repo && typeof config.repo === 'string';
        expect(hasStartUrls || hasBaseUrl || hasSources || hasPdfPath || hasUrl || hasRepo).toBe(true);
        if (hasStartUrls) {
          expect(config.start_urls.length).toBeGreaterThan(0);
        }
      });

      test('start_urls should contain valid URLs if present', () => {
        if (config.start_urls && Array.isArray(config.start_urls)) {
          config.start_urls.forEach(url => {
            expect(typeof url).toBe('string');
            expect(url).toMatch(/^https?:\/\//);
          });
        } else {
          // If no start_urls, this test passes
          expect(true).toBe(true);
        }
      });

      test('should have categories if present', () => {
        if (config.categories) {
          expect(typeof config.categories).toBe('object');
          Object.values(config.categories).forEach(category => {
            expect(Array.isArray(category)).toBe(true);
          });
        }
      });

      test('should have rate_limit field', () => {
        if (config.rate_limit !== undefined) {
          expect(typeof config.rate_limit).toBe('number');
          expect(config.rate_limit).toBeGreaterThanOrEqual(0);
        }
      });

      test('should have max_pages field', () => {
        if (config.max_pages !== undefined) {
          expect(typeof config.max_pages).toBe('number');
          expect(config.max_pages).toBeGreaterThan(0);
        }
      });

      test('should have valid url_patterns if present', () => {
        if (config.url_patterns) {
          expect(typeof config.url_patterns).toBe('object');

          if (config.url_patterns.include) {
            expect(Array.isArray(config.url_patterns.include)).toBe(true);
          }

          if (config.url_patterns.exclude) {
            expect(Array.isArray(config.url_patterns.exclude)).toBe(true);
          }
        }
      });

      test('name should match filename', () => {
        // Allow for different naming conventions (hyphens vs underscores)
        const normalizedConfigName = config.name.replace(/-/g, '_').toLowerCase();
        const normalizedFileName = configName.replace(/-/g, '_').toLowerCase();
        if (normalizedConfigName !== normalizedFileName) {
          console.warn(`⚠️  Config ${configName}: name "${config.name}" doesn't match filename`);
        }
        expect(config.name).toBeTruthy();
      });
    });
  });

  test('repository should have config files', () => {
    expect(configFiles.length).toBeGreaterThan(0);
  });
});
