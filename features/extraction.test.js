import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import assert from "assert";

// 🧠 Fungsi bantu (untuk membuat URL file lokal)
function getFileURL(filename) {
  const base = "C:/Users/ASUS/Documents/Semester 4/Tugas PPL TEO BDD/manual/";
  return `file:///${base}${filename}?v=${Date.now()}-${Math.random()}`;
}

describe("🧩 User Story Extraction (Manual)", function () {
  this.timeout(60000);
  let driver;

  // Setup ChromeDriver
  before(async function () {
    console.log("🚀 Menyiapkan ChromeDriver...");
    const chromePath =
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

    const options = new chrome.Options()
      .setChromeBinaryPath(chromePath)
      .addArguments("--disable-gpu", "--no-sandbox")
      .addArguments("--disable-dev-shm-usage", "--window-size=1280,800");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .usingServer("http://localhost:9515")
      .build();

    console.log("✅ Browser berhasil dijalankan!\n");
  });

  // Tutup browser setelah semua tes
  after(async function () {
    if (driver) await driver.quit();
    console.log("\n✅ Semua pengujian selesai!");
  });

  // Fungsi umum menjalankan pengujian aspek
  async function testAspect(aspectValue, expectedKeyword, aspectLabel) {
    const url = getFileURL("extractionuserstory_v2.html");
    console.log(`🔍 Membuka file: ${url}`);
    await driver.get(url);
    await driver.sleep(1000);

    const input = await driver.findElement(By.id("teks_berita"));
    await input.sendKeys(
      "Earthquakes hit Indonesia, including 7.5 magnitude tremor near Palu"
    );

    // pilih dropdown sesuai value
    const option = await driver.findElement(
      By.css(`#id_aspect option[value="${aspectValue}"]`)
    );
    await option.click();

    const extractButton = await driver.findElement(By.id("btnExtract"));
    await extractButton.click();

    // tunggu hasil
    const result = await driver.wait(
      until.elementLocated(By.id("berita")),
      5000
    );
    const text = await result.getText();

    console.log(`📄 Hasil Ekstraksi ${aspectLabel}:`, text);
    assert.ok(
      text.toLowerCase().includes(expectedKeyword.toLowerCase()),
      `Hasil untuk aspek ${aspectLabel} tidak sesuai: ${text}`
    );
    console.log(`✅ ${aspectLabel} Aspect berhasil diuji!\n`);
  }

  // ======== TEST CASES ========

  it("SCENARIO 1: WHO Aspect Extraction", async function () {
    await testAspect("1", "Who", "WHO");
  });

  it("SCENARIO 2: WHY Aspect Extraction", async function () {
    await testAspect("2", "Why", "WHY");
  });
});
