'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');

const game = path.resolve(__dirname, '..');
const oldHtml = path.join(game, 'play/CaribbeanMerchant_v1.1.html');
const newHtml = path.join(game, 'releases/CaribbeanMerchant_v1.2.1_QA.html');
const server = http.createServer((req, res) => {
  const file = new URL(req.url, 'http://localhost').pathname === '/v1.1' ? oldHtml : newHtml;
  res.setHeader('content-type', 'text/html; charset=utf-8');
  fs.createReadStream(file).pipe(res);
});

const snapshot = page => page.evaluate(() => CaribbeanGame.getSnapshot());
const loadState = (page, key) => page.evaluate(k => JSON.parse(localStorage.getItem(k)), key);

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({headless: true, channel: process.env.CHESS_CHROME_CHANNEL || 'chromium'});
  const checks = [];
  const errors = [];
  const record = name => {checks.push(name); console.log('PASS', name);};
  try {
    const local = await browser.newContext();
    const filePage = await local.newPage();
    filePage.on('pageerror', e => errors.push(`file: ${e.message}`));
    await filePage.goto(pathToFileURL(newHtml).href);
    assert.match(await filePage.title(), /v1\.2\.1/);
    const fileKey = await filePage.evaluate(() => CaribbeanGame.getSaveKey());
    await filePage.locator('[data-tab="adventure"]').click();
    assert.match(await filePage.locator('#tabContent').innerText(), /Живой мир/);
    await filePage.locator('#waitBtn').click();
    assert.equal((await snapshot(filePage)).day, 2);
    await filePage.reload();
    assert.equal((await loadState(filePage, fileKey)).day, 2);
    assert.equal((await snapshot(filePage)).day, 2);
    record('real file:// launch, v1.2.1 title, adventure UI and saved day survive reload');
    await local.close();

    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`http: ${e.message}`));
    const base = `http://127.0.0.1:${server.address().port}`;
    assert.equal((await page.goto(base + '/v1.1')).status(), 200);
    const key = await page.evaluate(() => CaribbeanGame.getSaveKey());
    // A rich historical save is a test fixture; game progress below uses real UI clicks.
    await page.evaluate(k => {const s = JSON.parse(localStorage.getItem(k)); s.gold = 300000; localStorage.setItem(k, JSON.stringify(s));}, key);
    await page.reload();
    await page.locator('[data-tab="estate"]').click();
    await page.locator('[data-build-industry]:not([disabled])').first().click();
    const before = await snapshot(page);
    assert.equal(Object.keys(before.empire.industries.havana).length, 1);
    assert.equal((await page.goto(base + '/v1.2')).status(), 200);
    const migrated = await snapshot(page);
    for (const field of ['day', 'gold', 'current', 'ship', 'reputation', 'winCount']) assert.deepEqual(migrated[field], before[field], field);
    assert.deepEqual(migrated.empire.industries.havana, before.empire.industries.havana);
    assert.equal(migrated.empire.living.version, 1);
    record('v1.1 save migration to repaired v1.2.1 preserves economy, ship, progress and factory');

    await page.locator('[data-tab="adventure"]').click();
    for (let i = 0; i < 2; i++) await page.locator('#waitBtn').click();
    let world = (await snapshot(page)).empire.living;
    assert.equal(world.outposts.length, 1, 'outpost must spawn in live time');
    const target = world.outposts[0];
    assert.equal(await page.locator(`[data-living-outpost="${target.id}"]`).isDisabled(), true);
    const selectedBefore = (await snapshot(page)).current;
    await page.locator(`[data-living-outpost="${target.id}"]`).dispatchEvent('click');
    assert.equal((await snapshot(page)).current, selectedBefore, 'remote raid must not teleport ship');
    record('outpost spawns and remote attack cannot teleport the ship');

    await page.locator('#portPicker').selectOption(target.city);
    await page.evaluate(() => {Math.random = () => 0.99;}); // deterministic safe route, no state injection
    await page.locator('#sailBtn').click();
    assert.equal((await snapshot(page)).current, target.city);
    await page.locator('[data-tab="adventure"]').click();
    const gold = (await snapshot(page)).gold;
    await page.locator(`[data-living-outpost="${target.id}"]`).click();
    assert.equal((await snapshot(page)).combat.raidRef, target.id);
    assert.equal(await page.locator('.tactical-board').count(), 1);
    await page.reload();
    assert.equal((await snapshot(page)).combat.raidRef, target.id, 'battle must survive reload');
    assert.equal(await page.locator('.tactical-board').count(), 1);
    await page.evaluate(() => {Math.random = () => 0;}); // deterministic success for reward accounting
    await page.locator('[data-tactical-act="auto"]').click();
    let after = await snapshot(page);
    assert.equal(after.combat, null);
    assert.equal(after.empire.living.outposts.some(o => o.id === target.id), false);
    assert.equal(after.empire.living.cleared, 1);
    assert.ok(after.gold > gold, 'victory reward must be credited');
    record('travel, combat persistence, auto-win, outpost removal and reward');

    for (let i = 0; i < 31; i++) await page.locator('#waitBtn').click();
    after = await snapshot(page);
    assert.ok(after.empire.living.outposts.length > 0, 'cleared outposts should recur');
    assert.ok(after.empire.living.threats.havana, 'unvisited owned city should become threatened');
    assert.ok(after.empire.living.threats.havana.control < 100, 'city control should decay');
    assert.ok(after.empire.industries.havana, 'threat must not delete an industry');
    record('recurring outposts, city raids and non-destructive control decay');

    const beforeTravel = after.current;
    await page.locator('[data-tab="adventure"]').click();
    assert.equal(await page.locator('[data-living-defend="havana"]').isDisabled(), true);
    await page.locator('#portPicker').selectOption('havana');
    await page.evaluate(() => {Math.random = () => 0.99;});
    await page.locator('#sailBtn').click();
    assert.notEqual(beforeTravel, 'havana');
    after = await snapshot(page);
    assert.equal(after.current, 'havana');
    await page.locator('[data-tab="adventure"]').click();
    await page.locator('[data-living-defend="havana"]').click();
    assert.equal((await snapshot(page)).combat.raidKind, 'threat');
    await page.evaluate(() => {Math.random = () => 0;});
    await page.locator('[data-tactical-act="auto"]').click();
    after = await snapshot(page);
    assert.equal(after.empire.living.threats.havana, undefined);
    assert.ok(after.empire.industries.havana);
    assert.equal(after.empire.living.cleared, 2);
    record('city defense clears raid without losing factory');

    await page.reload();
    assert.equal((await snapshot(page)).empire.living.cleared, 2);
    for (const lang of ['en', 'az', 'ru']) {
      await page.locator(`[data-lang="${lang}"]`).click();
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      await page.locator('[data-tab="adventure"]').click();
      assert.ok((await page.locator('#tabContent').innerText()).length > 100);
    }
    record('reloaded world state and three-language adventure UI');
    assert.deepEqual(errors, [], 'no uncaught browser errors');
    record('no uncaught browser errors');
    await ctx.close();
  } finally {await browser.close(); server.close();}
  console.log(`${checks.length}/${checks.length} v1.2 browser scenarios PASS`);
})().catch(e => {server.close(); console.error(e); process.exitCode = 1;});
