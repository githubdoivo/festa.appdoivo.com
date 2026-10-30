import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("counts down to the Friday of the party weekend, with no errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.clock.setFixedTime(new Date("2026-10-30T12:00:00"));
  await page.goto("/?lang=en");
  await expect(page.locator("h1")).toHaveText("Festa");
  await expect(page.locator(".when")).toHaveText("Friday, 17 September 2027");
  await expect(page.locator(".count li")).toHaveCount(4);
  await expect(page.locator(".demo")).toHaveAttribute("href", "https://festa-demo.appdoivo.com");
  expect(errors).toEqual([]);
});

test("the party rule: the weekend of 15 September, or the next one", async ({ page }) => {
  await page.goto("/");
  const days = await page.evaluate(() => [2026, 2027, 2028, 2029, 2030, 2031].map((y) => partyDay(y).toDateString()));
  expect(days).toEqual(["Fri Sep 18 2026", "Fri Sep 17 2027", "Fri Sep 15 2028", "Fri Sep 14 2029", "Fri Sep 13 2030", "Fri Sep 19 2031"]);
});

test("during the party weekend it says it's party time, then moves on to next year", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2027-09-18T15:00:00"));
  await page.goto("/?lang=en");
  await expect(page.locator(".tba")).toHaveText("It's party time");
  await page.clock.setFixedTime(new Date("2027-09-21T12:00:00"));
  await page.goto("/?lang=en");
  await expect(page.locator(".when")).toContainText("2028");
});

test("Portuguese from the browser", async ({ browser }) => {
  const ctx = await browser.newContext({ locale: "pt-PT" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator(".see")).toHaveText("Até para o ano");
  await expect(page.locator(".demo")).toHaveText("Experimentar a demo");
  await ctx.close();
});

test("no sideways scroll, 44px targets, no serious accessibility problems", async ({ page }) => {
  await page.goto("/?lang=en");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  for (const sel of ["#lang", ".demo"]) expect((await page.locator(sel).boundingBox()).height, sel).toBeGreaterThanOrEqual(44);
  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations.filter((v) => ["serious", "critical"].includes(v.impact)).map((v) => v.id)).toEqual([]);
});
