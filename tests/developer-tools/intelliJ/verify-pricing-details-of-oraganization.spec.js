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

  // Assertions with retryExpect
  await retryExpect(() => pricingPage.getSelectedSubscriptionOptions()).toEqual(
    "For Organizations"
  );
  await retryExpect(() => pricingPage.getSelectedBillingCycle()).toContain(
    "Yearly billing"
  );

  let pricing = await pricingPage.getPricingDetails();
  await retryExpect(() => pricing).toEqual({
    price: "€599.00",
    period: "per user, per year",
    vatPrice: "incl. VAT €736.77",
  });

  await pricingPage.navigateToMonthlyBilling();
  pricing = await pricingPage.getPricingDetails();
  await retryExpect(() => pricing).toEqual({
    period: "per user, per month",
    price: "€59.90",
    vatPrice: "incl. VAT €73.68",
  });
});
