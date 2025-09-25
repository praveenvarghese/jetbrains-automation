// Import test fixture and page objects
import { test } from "@playwright/test";
import { retryExpect } from "../../utils/retryExpect.js";
import { HomePage } from "../../pages/HomePage.js";
import { StorePage } from "../../pages/StorePage.js";

test("User is navigated to pricing page from home page", async ({ page }) => {
  // Arrange
  const homePage = new HomePage(page);
  const storePage = new StorePage(page);

  // Act
  await homePage.navigateToHome();
  await homePage.navigateToStoreIndividualUsePage();
  await retryExpect(() => storePage.verifyStorePage()).toBe(true);

  await retryExpect(() => storePage.getAllProductsDetails()).toEqual([
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
  ]);

  await storePage.changeBillingOption("Monthly billing");

  await retryExpect(() => storePage.getAllProductsDetails()).toEqual([
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
  ]);
});
