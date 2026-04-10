/**
 * Convert products.json → Shopify Admin import CSV
 * Format: multi-row per product (1 row per image, dòng đầu chứa full data)
 *
 * Chạy: node json-to-shopify-csv.js [input.json] [output.csv]
 */

import { readFileSync, writeFileSync } from "fs";
import path from "path";

// ─── HEADERS (đúng thứ tự Shopify) ───────────────────────────────────────────
const HEADERS = [
  "Handle",
  "Title",
  "Body (HTML)",
  "Vendor",
  "Product Category",
  "Type",
  "Tags",
  "Published",
  "Option1 Name",
  "Option1 Value",
  "Option1 Linked To",
  "Option2 Name",
  "Option2 Value",
  "Option2 Linked To",
  "Option3 Name",
  "Option3 Value",
  "Option3 Linked To",
  "Variant SKU",
  "Variant Grams",
  "Variant Inventory Tracker",
  "Variant Inventory Policy",
  "Variant Fulfillment Service",
  "Variant Price",
  "Variant Compare At Price",
  "Variant Requires Shipping",
  "Variant Taxable",
  "Unit Price Total Measure",
  "Unit Price Total Measure Unit",
  "Unit Price Base Measure",
  "Unit Price Base Measure Unit",
  "Variant Barcode",
  "Image Src",
  "Image Position",
  "Image Alt Text",
  "Gift Card",
  "SEO Title",
  "SEO Description",
  "Color Variants (product.metafields.custom.color_variants)",
  "Product Information (product.metafields.custom.product_information)",
  "Board game mechanics (product.metafields.shopify.board-game-mechanics)",
  "Color (product.metafields.shopify.color-pattern)",
  "Dexterity skills (product.metafields.shopify.dexterity-skills)",
  "Game features (product.metafields.shopify.game-features)",
  "Gameplay skills (product.metafields.shopify.gameplay-skills)",
  "Recommended age group (product.metafields.shopify.recommended-age-group)",
  "Stationery binding type (product.metafields.shopify.stationery-binding-type)",
  "Toy/Game material (product.metafields.shopify.toy-game-material)",
  "Complementary products (product.metafields.shopify--discovery--product_recommendation.complementary_products)",
  "Related products (product.metafields.shopify--discovery--product_recommendation.related_products)",
  "Related products settings (product.metafields.shopify--discovery--product_recommendation.related_products_display)",
  "Search product boosts (product.metafields.shopify--discovery--product_search_boost.queries)",
  "Variant Image",
  "Variant Weight Unit",
  "Variant Tax Code",
  "Cost per item",
  "Status",
];

// ─── CSV HELPERS ──────────────────────────────────────────────────────────────
function escapeCell(val) {
  if (val === null || val === undefined) return "";
  const str = String(val);
  // Bọc trong quotes nếu có dấu phẩy, xuống dòng, hoặc dấu ngoặc kép
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowToCSV(row) {
  return HEADERS.map((h) => escapeCell(row[h])).join(",");
}

// ─── TRANSFORM ────────────────────────────────────────────────────────────────
function productToRows(p) {
  const rows   = [];
  const images = p.images ?? [];
  const opts   = p.options ?? [];
  const v      = p.variant ?? {};
  const mf     = p.metafields ?? {};

  // Option columns (hỗ trợ tối đa 3)
  const opt1 = opts[0] ?? {};
  const opt2 = opts[1] ?? {};
  const opt3 = opts[2] ?? {};

  // Dòng đầu: full product data + ảnh đầu tiên
  const firstRow = {
    "Handle":                    p.handle ?? "",
    "Title":                     p.title  ?? "",
    "Body (HTML)":               p.description_html ?? "",
    "Vendor":                    p.vendor ?? "",
    "Product Category":          p.category ?? "",
    "Type":                      p.type ?? "",
    "Tags":                      (p.tags ?? []).join(", "),
    "Published":                 p.published === true ? "true" : "false",

    "Option1 Name":              opt1.name  ?? "",
    "Option1 Value":             opt1.value ?? "",
    "Option1 Linked To":         "",
    "Option2 Name":              opt2.name  ?? "",
    "Option2 Value":             opt2.value ?? "",
    "Option2 Linked To":         "",
    "Option3 Name":              opt3.name  ?? "",
    "Option3 Value":             opt3.value ?? "",
    "Option3 Linked To":         "",

    "Variant SKU":               v.sku ?? "",
    "Variant Grams":             v.weight_grams != null ? v.weight_grams : "",
    "Variant Inventory Tracker": v.inventory_tracker ?? "shopify",
    "Variant Inventory Policy":  v.inventory_policy  ?? "deny",
    "Variant Fulfillment Service": v.fulfillment_service ?? "manual",
    "Variant Price":             v.price != null ? v.price : "",
    "Variant Compare At Price":  "",
    "Variant Requires Shipping": v.requires_shipping === true  ? "true"
                               : v.requires_shipping === false ? "false" : "",
    "Variant Taxable":           v.taxable === true  ? "true"
                               : v.taxable === false ? "false" : "",

    "Unit Price Total Measure":      "",
    "Unit Price Total Measure Unit": "",
    "Unit Price Base Measure":       "",
    "Unit Price Base Measure Unit":  "",
    "Variant Barcode":               "",

    "Image Src":      images[0] ?? "",
    "Image Position": images.length > 0 ? "1" : "",
    "Image Alt Text": "",

    "Gift Card":      "false",
    "SEO Title":      "",
    "SEO Description":"",

    "Color Variants (product.metafields.custom.color_variants)":
      mf.color_variants ?? "",
    "Product Information (product.metafields.custom.product_information)":
      mf.product_information ?? "",
    "Board game mechanics (product.metafields.shopify.board-game-mechanics)":
      mf.board_game_mechanics ?? "",
    "Color (product.metafields.shopify.color-pattern)":
      mf.color ?? "",
    "Dexterity skills (product.metafields.shopify.dexterity-skills)":
      mf.dexterity_skills ?? "",
    "Game features (product.metafields.shopify.game-features)":
      mf.game_features ?? "",
    "Gameplay skills (product.metafields.shopify.gameplay-skills)":
      mf.gameplay_skills ?? "",
    "Recommended age group (product.metafields.shopify.recommended-age-group)":
      mf.recommended_age_group ?? "",
    "Stationery binding type (product.metafields.shopify.stationery-binding-type)":
      mf.stationery_binding_type ?? "",
    "Toy/Game material (product.metafields.shopify.toy-game-material)":
      mf.toy_game_material ?? "",

    "Complementary products (product.metafields.shopify--discovery--product_recommendation.complementary_products)": "",
    "Related products (product.metafields.shopify--discovery--product_recommendation.related_products)":             "",
    "Related products settings (product.metafields.shopify--discovery--product_recommendation.related_products_display)": "",
    "Search product boosts (product.metafields.shopify--discovery--product_search_boost.queries)":                   "",

    "Variant Image":       "",
    "Variant Weight Unit": "kg",
    "Variant Tax Code":    "",
    "Cost per item":       "",
    "Status":              p.published ? "active" : "draft",
  };

  rows.push(firstRow);

  // Các dòng phụ: chỉ handle + image (đúng format Shopify)
  for (let i = 1; i < images.length; i++) {
    const imgRow = {};
    HEADERS.forEach((h) => (imgRow[h] = ""));
    imgRow["Handle"]         = p.handle ?? "";
    imgRow["Image Src"]      = images[i];
    imgRow["Image Position"] = String(i + 1);
    imgRow["Image Alt Text"] = "";
    rows.push(imgRow);
  }

  return rows;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const inputFile  = process.argv[2] || "products.json";
const outputFile = process.argv[3] || "products_shopify.csv";

console.log(`📥 Đọc: ${inputFile}`);
const products = JSON.parse(readFileSync(inputFile, "utf-8"));
console.log(`   → ${products.length} sản phẩm`);

const allRows = products.flatMap(productToRows);
console.log(`   → ${allRows.length} dòng CSV (bao gồm ảnh phụ)`);

const csvContent =
  HEADERS.map(escapeCell).join(",") +
  "\n" +
  allRows.map(rowToCSV).join("\n") +
  "\n";

writeFileSync(outputFile, csvContent, "utf-8");
console.log(`✅ Đã xuất: ${outputFile}`);