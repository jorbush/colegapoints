import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import JoinPrompt from '../../src/components/JoinPrompt.astro';

describe('JoinPrompt component', () => {
  it('renders the join prompt with group details', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(JoinPrompt, {
      props: {
        groupId: 'g1',
        groupName: 'The Squad',
        groupDescription: 'A cool group',
      },
    });

    expect(result).toContain('Join the squad');
    expect(result).toContain('data-group-id="g1"');
    expect(result).toContain('data-group-name="The Squad"');
    expect(result).toContain('Pick your emoji');
  });

  it('renders all default emojis', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(JoinPrompt, {
      props: {
        groupId: 'g1',
        groupName: 'The Squad',
        groupDescription: 'A cool group',
      },
    });

    expect(result).toContain('data-emoji="😎"');
    expect(result).toContain('data-emoji="🚀"');
    expect(result).toContain('data-emoji="🍕"');
    expect(result).toContain('data-emoji="🍍"');
  });
});
