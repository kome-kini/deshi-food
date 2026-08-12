import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    DB: undefined,
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the DESHIJAAT storefront", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /DESHIJAAT/);
  assert.match(html, /দেশের স্বাদ/);
  assert.match(html, /Authentic Bangladeshi Food/);
  assert.match(html, /স্টেজিং ডেমো/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/);
});

test("server-renders catalog and dashboard", async () => {
  const catalog = await render("/catalog");
  assert.equal(catalog.status, 200);
  assert.match(await catalog.text(), /বাংলার pantry/);
  const admin = await render("/admin");
  assert.equal(admin.status, 200);
  const adminHtml = await admin.text();
  assert.match(adminHtml, /Control room/);
  assert.match(adminHtml, /Synthetic analytics demo/);
});
