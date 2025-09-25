// Import test fixture and page objects
import { test } from "@playwright/test";
import { retryExpect } from "../../../utils/retryExpect.js";
import { HomePage } from "../../../pages/HomePage.js";
import { IntelliJPage } from "../../../pages/IntelliJPage.js";
import { PricingPage } from "../../../pages/PricingPage.js";

test("User is navigated to pricing page from home page", async ({ page }) => {
  // Arrange
  const homePage = new HomePage(page);
  const intelliJPage = new IntelliJPage(page);
  const pricingPage = new PricingPage(page);

  // Act
  await homePage.navigateToHome();
  await homePage.navigateToIntelliJIDEAPage();
  await intelliJPage.verifyIntelliJPage();
  await intelliJPage.navigateToPricingPage();
  await pricingPage.verifyPricingPage();
  await pricingPage.navigateToIndividualUseTab();

  // Assertions with retryExpect
  await retryExpect(() => pricingPage.getSelectedSubscriptionOptions()).toEqual(
    "For Individual Use"
  );
  await retryExpect(() => pricingPage.getSelectedBillingCycle()).toContain(
    "Yearly billing"
  );

  let pricing = await pricingPage.getPricingDetails();
  await retryExpect(() => pricing).toEqual({
    period: "first year",
    price: "€169.00",
    vatPrice: "incl. VAT €207.87",
  });

  await pricingPage.navigateToMonthlyBilling();
  pricing = await pricingPage.getPricingDetails();

  await retryExpect(() => pricing).toEqual({
    period: "per month",
    price: "€16.90",
    vatPrice: "incl. VAT €20.79",
  });
});

async function validateAppAndCategory(page, categoryName, appName) {
  // Find the category container that has our category name
  const categoryContainer = page
    .locator(".applications-list__category")
    .filter({
      has: page.locator(".application-category__name-label", {
        hasText: categoryName,
      }),
    });

  // Within this category container, find the app
  const appHeading = categoryContainer.locator(".application__name", {
    hasText: appName,
  });

  // Assert the app is visible in this category
  await expect(appHeading).toBeVisible();
}
