/**
 * Shopify Product Crawler - printworksmarket.com
 * 
 * Sử dụng Shopify public endpoint /products.json (không cần auth)
 * Output: products.json với format tương tự mẫu
 * 
 * Cài đặt: npm install node-fetch
 * Chạy:    node crawl-printworks.js
 */

import fs from "fs";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const BASE_URL  = "https://printworksmarket.com";
const PAGE_SIZE = 250;          // max của Shopify public API
const DELAY_MS  = 500;          // delay giữa các request (ms) để tránh bị block
const OUTPUT    = "products.json";
// ──────────────────────────────────────────────────────────────────────────────

// Dynamic import fetch (tương thích cả Node 18+ built-in lẫn node-fetch)
async function fetchJSON(url) {
  const fetch = globalThis.fetch ?? (await import("node-fetch")).default;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; ProductCrawler/1.0; +https://github.com)",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${url}`);
  return res.json();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── TRANSFORM ────────────────────────────────────────────────────────────────
// Chuyển raw product từ Shopify API → format mong muốn
function transformProduct(p) {
  const firstVariant = p.variants?.[0] ?? {};

  // Options: flatten thành [{name, value}]
  const options = (p.options ?? []).flatMap((opt) =>
    (opt.values ?? []).map((v) => ({ name: opt.name, value: v }))
  );

  // Metafields: Shopify public API không trả metafields trực tiếp.
  // Những gì có thể lấy từ product.json được map vào đây;
  // các field null cần storefront/admin API hoặc scrape trang product riêng.
  const metafields = {
    color_variants:          null,
    product_information:     extractProductInfo(p),
    board_game_mechanics:    null,
    color:                   null,
    dexterity_skills:        null,
    game_features:           null,
    gameplay_skills:         null,
    stationery_binding_type: null,
    toy_game_material:       null,
  };

  return {
    handle:           p.handle,
    title:            p.title,
    description_html: p.body_html ?? null,
    vendor:           p.vendor ?? null,
    category:         p.product_type ?? null,   // public API không có category chuẩn
    type:             p.product_type ?? null,
    tags:             p.tags ?? [],
    published:        p.published_at != null,
    options,
    variant: {
      sku:                firstVariant.sku      ?? null,
      weight_grams:       firstVariant.grams    ?? null,
      inventory_tracker:  firstVariant.inventory_management ?? null,
      inventory_policy:   firstVariant.inventory_policy     ?? null,
      fulfillment_service:firstVariant.fulfillment_service  ?? null,
      price:              parseFloat(firstVariant.price)    ?? null,
      requires_shipping:  firstVariant.requires_shipping    ?? null,
      taxable:            firstVariant.taxable              ?? null,
    },
    metafields,
    images: (p.images ?? []).map((img) => img.src),
  };
}

// Cố gắng tổng hợp product_information từ tags/metafields/body nếu có
function extractProductInfo(p) {
  const lines = [];
  if (p.vendor)       lines.push(`Vendor: ${p.vendor}`);
  if (p.product_type) lines.push(`Type: ${p.product_type}`);
  // Weight từ variant đầu
  const w = p.variants?.[0]?.grams;
  if (w)              lines.push(`Weight: ${w}g`);
  return lines.length ? lines.join("\n") : null;
}

// ─── CRAWLER ──────────────────────────────────────────────────────────────────
async function crawlAllProducts() {
  const allProducts = [];
  let page = 1;

  console.log(`🚀 Bắt đầu crawl: ${BASE_URL}`);

  while (true) {
    const url = `${BASE_URL}/products.json?limit=${PAGE_SIZE}&page=${page}`;
    console.log(`  → Trang ${page}: ${url}`);

    let data;
    try {
      data = await fetchJSON(url);
    } catch (err) {
      console.error(`  ✗ Lỗi trang ${page}:`, err.message);
      break;
    }

    const products = data.products ?? [];
    if (products.length === 0) {
      console.log(`  ✓ Hết dữ liệu ở trang ${page}`);
      break;
    }

    const transformed = products.map(transformProduct);
    allProducts.push(...transformed);
    console.log(`  ✓ Đã lấy ${products.length} sản phẩm (tổng: ${allProducts.length})`);

    // Nếu ít hơn PAGE_SIZE → đây là trang cuối
    if (products.length < PAGE_SIZE) break;

    page++;
    await sleep(DELAY_MS);
  }

  return allProducts;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
(async () => {
  try {
    const products = await crawlAllProducts();

    fs.writeFileSync(OUTPUT, JSON.stringify(products, null, 2), "utf-8");
    console.log(`\n✅ Xong! ${products.length} sản phẩm → ${OUTPUT}`);
  } catch (err) {
    console.error("❌ Lỗi không mong đợi:", err);
    process.exit(1);
  }
})();