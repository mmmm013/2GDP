import { expect, test } from '@playwright/test';

type PerfCheck = {
  label: string;
  url: string;
  maxResponseStartMs: number;
  maxDomContentLoadedMs: number;
  maxLoadMs: number;
  expectedText?: string;
};

const CHECKS: PerfCheck[] = [
  {
    label: 'Flagship Home',
    url: 'https://www.gputnammusic.com/',
    maxResponseStartMs: 2000,
    maxDomContentLoadedMs: 4000,
    maxLoadMs: 8000,
    expectedText: 'BUY KK NOW',
  },
  {
    label: 'Flagship Join',
    url: 'https://www.gputnammusic.com/join',
    maxResponseStartMs: 2000,
    maxDomContentLoadedMs: 4500,
    maxLoadMs: 9000,
    expectedText: 'JOIN',
  },
  {
    label: 'Flagship Gift',
    url: 'https://www.gputnammusic.com/gift',
    maxResponseStartMs: 2000,
    maxDomContentLoadedMs: 4500,
    maxLoadMs: 9000,
    expectedText: 'Digital Mixed Bag',
  },
  {
    label: 'K-KUT Pricing',
    url: 'https://k-kut.com/pricing',
    maxResponseStartMs: 2000,
    maxDomContentLoadedMs: 4000,
    maxLoadMs: 8000,
    expectedText: 'Sovereign Pass',
  },
];

test.describe('Revenue funnel performance', () => {
  for (const check of CHECKS) {
    test(`${check.label} stays within budget`, async ({ page }) => {
      const pageErrors: string[] = [];

      page.on('pageerror', (error) => {
        pageErrors.push(error.message);
      });

      const response = await page.goto(check.url, { waitUntil: 'load' });

      expect(response, `${check.label} did not produce a document response`).not.toBeNull();
      expect(response?.ok(), `${check.label} returned a non-OK status`).toBeTruthy();

      if (check.expectedText) {
        await expect(page.getByText(check.expectedText, { exact: false }).first()).toBeVisible();
      }

      const nav = await page.evaluate(() => {
        const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
        if (!entry) {
          return null;
        }

        return {
          responseStart: Math.round(entry.responseStart),
          domContentLoaded: Math.round(entry.domContentLoadedEventEnd),
          loadEventEnd: Math.round(entry.loadEventEnd),
        };
      });

      expect(nav, `${check.label} is missing navigation timing data`).not.toBeNull();
      expect(nav!.responseStart, `${check.label} responseStart budget missed`).toBeLessThanOrEqual(check.maxResponseStartMs);
      expect(nav!.domContentLoaded, `${check.label} DOMContentLoaded budget missed`).toBeLessThanOrEqual(
        check.maxDomContentLoadedMs
      );
      expect(nav!.loadEventEnd, `${check.label} load budget missed`).toBeLessThanOrEqual(check.maxLoadMs);
      expect(pageErrors, `${check.label} emitted runtime page errors`).toEqual([]);

      console.log(
        `${check.label} | responseStart=${nav!.responseStart}ms | domContentLoaded=${nav!.domContentLoaded}ms | load=${nav!.loadEventEnd}ms`
      );
    });
  }
});