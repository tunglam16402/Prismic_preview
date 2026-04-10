import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  answerHtml?: string;
};

type FAQSection = {
  id: string;
  title: string;
  items: FAQItem[];
};

const URL = "https://printworksmarket.com/pages/faq";

function normalizeText(input: string): string {
  return input
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanQuestion(input: string): string {
  return normalizeText(input)
    .replace(/\s+/g, " ")
    .trim();
}

function cleanAnswerText(input: string): string {
  return normalizeText(input);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function extractAnswerHtml($content: cheerio.Cheerio<any>): string {
  // lấy inner HTML thực tế bên trong content
  // ưu tiên vùng inner nếu có
  const inner = $content.find(".DropdownContent__Inner").first();

  if (inner.length) {
    return (inner.html() || "").trim();
  }

  return ($content.html() || "").trim();
}

function extractAnswerText($content: cheerio.Cheerio<any>): string {
  const inner = $content.find(".DropdownContent__Inner").first();

  if (inner.length) {
    return cleanAnswerText(inner.text());
  }

  return cleanAnswerText($content.text());
}

async function ensureOutputDir() {
  const dir = path.resolve(process.cwd(), "scripts", "output");
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

async function main() {
  console.log("Fetching FAQ page...");

  const { data: html } = await axios.get<string>(URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    timeout: 20000,
  });

  const $ = cheerio.load(html);

  // Root chuẩn theo cấu trúc bạn inspect
  const faqRoot = $(".faq_questioner").first();

  if (!faqRoot.length) {
    throw new Error("Không tìm thấy .faq_questioner");
  }

  const sections: FAQSection[] = [];

  faqRoot.find(".faq_block").each((_, blockEl) => {
    const $block = $(blockEl);

    const sectionTitle =
      cleanQuestion($block.find(".faq_block-heading p").first().text()) ||
      cleanQuestion($block.find(".faq_block-heading").first().text());

    if (!sectionTitle) return;

    const items: FAQItem[] = [];

    $block.find("> .faq_block-content").each((index, itemEl) => {
      const $item = $(itemEl);

      const question =
        cleanQuestion($item.find(".Dropdown--Button").first().clone().children().remove().end().text()) ||
        cleanQuestion($item.find(".Dropdown--Button").first().text());

      const $answerContent = $item.find(".Dropdown--Content").first();

      const answerText = extractAnswerText($answerContent);
      const answerHtml = extractAnswerHtml($answerContent);

      if (!question || !answerText) return;

      items.push({
        id: slugify(question || `${sectionTitle}-${index + 1}`),
        question,
        answer: answerText,
        answerHtml,
      });
    });

    if (!items.length) return;

    sections.push({
      id: slugify(sectionTitle),
      title: sectionTitle,
      items,
    });
  });

  if (!sections.length) {
    throw new Error("Không extract được section nào từ FAQ.");
  }

  const outputDir = await ensureOutputDir();

  const jsonPath = path.join(outputDir, "faq.cleaned.json");
  const textOnlyPath = path.join(outputDir, "faq.text-only.json");

  // bản đầy đủ: có cả answerHtml để sau này nếu bạn muốn render rich text
  await fs.writeFile(jsonPath, JSON.stringify(sections, null, 2), "utf-8");

  // bản nhẹ: chỉ giữ text
  const textOnly = sections.map((section) => ({
    id: section.id,
    title: section.title,
    items: section.items.map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
    })),
  }));

  await fs.writeFile(textOnlyPath, JSON.stringify(textOnly, null, 2), "utf-8");

  console.log("\n✅ Done");
  console.log(`- Full JSON     : ${jsonPath}`);
  console.log(`- Text-only JSON: ${textOnlyPath}`);
  console.log("\nPreview:\n");
  console.log(JSON.stringify(textOnly.slice(0, 2), null, 2));
}

main().catch((error) => {
  console.error("\n❌ Extract failed");
  console.error(error);
  process.exit(1);
});