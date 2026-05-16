import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Base from '../../src/layouts/Base.astro';

describe('Base layout', () => {
  it('renders default title and description', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Base, {
      props: {},
    });

    expect(result).toContain('<title>ColegaPoints</title>');
    expect(result).toContain(
      'meta name="description" content="Track friend points with your crew. Give points, take points, see who\'s the best colega."'
    );
  });

  it('renders custom title and description', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Base, {
      props: {
        title: 'Custom Page',
        description: 'A very special page',
      },
    });

    expect(result).toContain('<title>Custom Page — ColegaPoints</title>');
    expect(result).toContain('meta name="description" content="A very special page"');
  });

  it('renders slot content', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Base, {
      slots: {
        default: '<h1>Hello World</h1>',
      },
    });

    expect(result).toContain('<h1>Hello World</h1>');
  });
});
