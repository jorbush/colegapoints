import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import PointsModal from '../../src/components/PointsModal.astro';

describe('PointsModal component', () => {
  const members = [
    { id: '1', name: 'Alice', avatarEmoji: '😎' },
    { id: '2', name: 'Bob', avatarEmoji: '🤓' },
  ];

  it('renders points modal with member data', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PointsModal, {
      props: {
        groupId: 'g1',
        members,
      },
    });

    expect(result).toContain('Points');
    expect(result).toContain('data-group-id="g1"');
    // The members data is JSON-stringified in a data attribute
    expect(result).toContain('data-members');
    expect(result).toContain('Alice');
    expect(result).toContain('Bob');
  });

  it('renders all delta buttons', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PointsModal, {
      props: {
        groupId: 'g1',
        members,
      },
    });

    expect(result).toContain('data-delta="-5"');
    expect(result).toContain('data-delta="-3"');
    expect(result).toContain('data-delta="-1"');
    expect(result).toContain('data-delta="1"');
    expect(result).toContain('data-delta="3"');
    expect(result).toContain('data-delta="5"');
  });

  it('renders with scrollable and center alignment classes', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PointsModal, {
      props: {
        groupId: 'g1',
        members,
      },
    });

    expect(result).toContain('id="points-modal"');
    expect(result).toContain('overflow-y-auto');
    expect(result).toContain('flex-col');
    expect(result).toContain('min-h-screen');
    expect(result).toContain('sm:min-h-0');
    expect(result).toContain('rounded-none');
    expect(result).toContain('sm:rounded-lg');
    expect(result).toContain('border-0');
    expect(result).toContain('sm:border-4');
  });
});
