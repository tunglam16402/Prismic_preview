// faq-crawler.js
// Script crawl FAQ data từ trang web có cấu trúc Dropdown như trong ảnh
// Chạy: node faq-crawler.js
// Hoặc dùng như API route trong Next.js
 
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cheerio = require("cheerio");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
 
// ========================================
// CẤU HÌNH - Thay URL của bạn vào đây
// ========================================
const TARGET_URL = "https://printworksmarket.com/pages/faq"; // <-- Đổi URL này
 
async function crawlFAQ(url) {
  console.log(`\n🔍 Đang crawl: ${url}\n`);
 
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
 
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
 
  const html = await res.text();
  return parseFAQ(html);
}
 
function parseFAQ(html) {
  const $ = cheerio.load(html);
  const result = [];
 
  // Duyệt qua từng faq__block (mỗi block là 1 nhóm câu hỏi)
  $(".faq__block").each((_, block) => {
    const $block = $(block);
    const blockId = $block.attr("id") || "";
 
    // Lấy tên category (heading)
    const category = $block.find(".faq__block--heading").text().trim();
 
    const questions = [];
 
    // Duyệt qua từng faq__block-content (mỗi content chứa 1 dropdown)
    $block.find(".faq__block-content").each((_, content) => {
      const $content = $(content);
 
      // Lấy câu hỏi từ button text (bỏ icon)
      const $btn = $content.find(".Dropdown--Button");
      // Clone button, remove icon span để lấy text sạch
      const $btnClone = $btn.clone();
      $btnClone.find(".Dropdown--Icon").remove();
      const question = $btnClone.text().trim();
 
      // Lấy nội dung trả lời
      const answer = $content.find(".DropdownContent__Inner").text().trim();
 
      if (question) {
        questions.push({ question, answer });
      }
    });
 
    if (category || questions.length > 0) {
      result.push({
        id: blockId,
        category: category || "Uncategorized",
        questions,
      });
    }
  });
 
  return result;
}
 
function printResult(data) {
  console.log("=".repeat(60));
  console.log(`✅ Tìm thấy ${data.length} nhóm câu hỏi\n`);
 
  data.forEach((group, i) => {
    console.log(`\n📂 [${i + 1}] ${group.category} (id: ${group.id})`);
    console.log("-".repeat(50));
    group.questions.forEach((q, j) => {
      console.log(`  ❓ Q${j + 1}: ${q.question}`);
      console.log(`  💬 A:  ${q.answer || "(Không có nội dung)"}`);
      console.log();
    });
  });
}
 
async function main() {
  try {
    const data = await crawlFAQ(TARGET_URL);
 
    printResult(data);
 
    // Lưu kết quả ra file JSON
    const outputPath = "./faq-data.json";
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`\n💾 Đã lưu dữ liệu vào: ${outputPath}`);
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
    process.exit(1);
  }
}
 
main();