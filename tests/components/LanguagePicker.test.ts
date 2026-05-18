import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import LanguagePicker from '../../src/components/LanguagePicker.astro';

describe('LanguagePicker component', () => {
  it('renders all three language options (EN, ES, CA)', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(LanguagePicker, {
      props: {},
    });

    expect(result).toContain('EN');
    expect(result).toContain('ES');
    expect(result).toContain('CA');
    expect(result).toContain('aria-label="Change language to English"');
    expect(result).toContain('aria-label="Change language to Español"');
    expect(result).toContain('aria-label="Change language to Català"');
  });

  it('defaults to English when no cookie or header is present', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(LanguagePicker, {
      props: {},
    });

    // In English, EN button should be active
    // Active class matches tag-brand and aria-pressed="true"
    expect(result).toContain(
      'data-lang="en" class="lang-btn tag transition-all duration-100 tag-brand'
    );
    expect(result).toContain('aria-pressed="true"');
  });

  it('highlights Spanish as active if cookie is es', async () => {
    const container = await AstroContainer.create();
    const request = new Request('http://localhost/', {
      headers: {
        cookie: 'lang=es',
      },
    });

    const result = await container.renderToString(LanguagePicker, {
      props: {},
      request,
    });

    // ES button should be active
    expect(result).toContain(
      'data-lang="es" class="lang-btn tag transition-all duration-100 tag-brand'
    );
  });

  it('highlights Catalan as active if Accept-Language header is ca', async () => {
    const container = await AstroContainer.create();
    const request = new Request('http://localhost/', {
      headers: {
        'accept-language': 'ca-ES,ca;q=0.9',
      },
    });

    const result = await container.renderToString(LanguagePicker, {
      props: {},
      request,
    });

    // CA button should be active
    expect(result).toContain(
      'data-lang="ca" class="lang-btn tag transition-all duration-100 tag-brand'
    );
  });
});
