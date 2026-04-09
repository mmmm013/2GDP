import { test, expect } from '@playwright/test';

type Check = {
  path: string;
  expectedType: 'audio' | 'html';
};

const CHECKS: Check[] = [
  { path: '/audio/gpm_intro.m4a', expectedType: 'audio' },
  { path: '/audio/lcf_intro.m4a', expectedType: 'audio' },
  { path: '/audio/mc_bot_intro.m4a', expectedType: 'audio' },
  { path: '/audio/pixie_intro.m4a', expectedType: 'audio' },
  { path: '/demo1.mp3', expectedType: 'audio' },
  { path: '/assets/fly-again.mp3', expectedType: 'audio' },
  { path: '/pix/i-need-an-angel.mp3', expectedType: 'audio' },
  { path: '/pix/kleigh--reflections.mp3', expectedType: 'audio' },
  { path: '/mkut/swift1', expectedType: 'html' },
  { path: '/heroes', expectedType: 'html' },
  { path: '/singalongs', expectedType: 'html' },
  { path: '/mip', expectedType: 'html' },
];

test.describe('Audio endpoints and pages', () => {
  for (const check of CHECKS) {
    test(`${check.path} responds correctly`, async ({ request }) => {
      const res = await request.get(check.path, {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
      });

      expect(res.status(), `Unexpected status for ${check.path}`).toBe(200);
      const contentType = (res.headers()['content-type'] || '').toLowerCase();

      if (check.expectedType === 'audio') {
        expect(contentType, `Expected audio content-type for ${check.path}`).toContain('audio/');
      } else {
        expect(contentType, `Expected html content-type for ${check.path}`).toContain('text/html');
      }
    });
  }
});
