import { test } from "@playwright/test";
import { retryExpect } from "../../utils/retryExpect.js";
import { HomePage } from "../../pages/HomePage.js";
import { StorePage } from "../../pages/StorePage.js";

test("Verify store displays all expected products for individual use across yearly and monthly billing cycles", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const storePage = new StorePage(page);

  const expectedProducts = [
    "All Products Pack",
    "IntelliJ IDEA Ultimate",
    "dotUltimate",
    "AI Pro",
    "CLion",
    "CodeCanvas",
    "DataGrip",
    "DataSpell",
    "GoLand",
    "PhpStorm",
    "PyCharm Pro",
    "ReSharper",
    "Rider",
    "RubyMine",
    "RustRover",
    "WebStorm",
  ];

  // Navigate to store individual use page
  await homePage.navigateToHome();
  await homePage.navigateToStoreIndividualUsePage();
  await retryExpect(() => storePage.verifyStorePage()).toBe(true);

  // Validate all products are displayed for yearly billing
  await retryExpect(() => storePage.getAllProductsDetails()).toEqual(
    expectedProducts
  );

  // Switch to monthly billing and verify same products are displayed
  await storePage.changeBillingOption("Monthly billing");

  await retryExpect(() => storePage.getAllProductsDetails()).toEqual(
    expectedProducts
  );
});
