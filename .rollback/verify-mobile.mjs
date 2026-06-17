import pw from "/home/a/aseeb-restaurant/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright/index.js";
const { chromium } = pw;

const BASE = "http://localhost:3101";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function railInfo(page, sel) {
  return page.$eval(sel, (el) => {
    const cs = getComputedStyle(el);
    return {
      display: cs.display,
      overflowX: cs.overflowX,
      direction: cs.direction,
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      childCount: el.childElementCount,
    };
  });
}

async function autoDelta(page, sel, ms) {
  const before = await page.$eval(sel, (el) => el.scrollLeft);
  await sleep(ms);
  const after = await page.$eval(sel, (el) => el.scrollLeft);
  return { before, after, delta: after - before };
}

async function pageOverflow(page) {
  return page.evaluate(() => {
    const sh = document.querySelector(".scroll-shell") || document.documentElement;
    return {
      docScrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      shellScrollW: sh.scrollWidth,
      shellClientW: sh.clientWidth,
    };
  });
}

const results = [];
const log = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  ${detail ?? ""}`);
};

const browser = await chromium.launch();

// 1) Mobile AR 360px — marquee auto-scroll + RTL direction
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 780 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await sleep(400);
  const p = await railInfo(page, ".pillars.m-rail");
  log("AR pillars is horizontal flex rail @360", p.display === "flex" && p.overflowX === "auto", JSON.stringify(p));
  log("AR pillars has clones (marquee active)", p.childCount === 8, `children=${p.childCount}`);
  const pd = await autoDelta(page, ".pillars.m-rail", 1200);
  log("AR pillars auto-scroll moves (RTL → negative)", pd.delta < -2, JSON.stringify(pd));
  const c = await railInfo(page, ".cat-grid.m-rail");
  log("AR categories is horizontal flex rail @360", c.display === "flex" && c.overflowX === "auto", JSON.stringify(c));
  log("AR categories has 5 cards (no clones)", c.childCount === 5, `children=${c.childCount}`);
  const ov = await pageOverflow(page);
  log("AR no page-level horizontal overflow @360", ov.docScrollW <= ov.innerW + 1 && ov.shellScrollW <= ov.shellClientW + 1, JSON.stringify(ov));
  await ctx.close();
}

// 2) Mobile EN 390px — LTR direction
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
  await sleep(400);
  const p = await railInfo(page, ".pillars.m-rail");
  log("EN pillars rail direction is LTR", p.direction === "ltr", p.direction);
  const pd = await autoDelta(page, ".pillars.m-rail", 1200);
  log("EN pillars auto-scroll moves (LTR → positive)", pd.delta > 2, JSON.stringify(pd));
  const ov = await pageOverflow(page);
  log("EN no page-level horizontal overflow @390", ov.docScrollW <= ov.innerW + 1, JSON.stringify(ov));
  await ctx.close();
}

// 3) Reduced motion — no auto-scroll, still a rail
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await sleep(400);
  const p = await railInfo(page, ".pillars.m-rail");
  log("Reduced-motion: still a flex rail", p.display === "flex", p.display);
  log("Reduced-motion: no clones", p.childCount === 4, `children=${p.childCount}`);
  const pd = await autoDelta(page, ".pillars.m-rail", 1200);
  log("Reduced-motion: auto-scroll disabled", Math.abs(pd.delta) < 2, JSON.stringify(pd));
  await ctx.close();
}

// 4) Desktop 1280px — original grid, unchanged
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await sleep(300);
  const p = await railInfo(page, ".pillars.m-rail");
  log("Desktop pillars is CSS grid", p.display === "grid", p.display);
  log("Desktop pillars has exactly 4 items (no clones)", p.childCount === 4, `children=${p.childCount}`);
  const c = await railInfo(page, ".cat-grid.m-rail");
  log("Desktop categories is CSS grid", c.display === "grid", c.display);
  const pd = await autoDelta(page, ".pillars.m-rail", 800);
  log("Desktop: no auto-scroll", Math.abs(pd.delta) < 1, JSON.stringify(pd));
  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
