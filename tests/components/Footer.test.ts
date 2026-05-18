import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Footer from '../../src/components/Footer.astro';
import pkg from '../../package.json';

describe('Footer component', () => {
  it('renders "Created by jorbush" with correct GitHub URL', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Footer, {
      props: {},
    });

    expect(result).toContain('Created by');
    expect(result).toContain('href="https://github.com/jorbush"');
    expect(result).toContain('jorbush');
  });

  it('renders correct dynamic version and redirect link from package.json', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Footer, {
      props: {},
    });

    const expectedVersion = pkg.version;
    expect(result).toContain(`v${expectedVersion}`);
    expect(result).toContain(
      `href="https://github.com/jorbush/colegapoints/releases/tag/v${expectedVersion}"`
    );
  });
});
