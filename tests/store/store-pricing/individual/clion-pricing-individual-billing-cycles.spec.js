// Import test fixture and page objects
import { test } from "@playwright/test";
import { retryExpect } from "../../../../utils/retryExpect.js";
import { HomePage } from "../../../../pages/HomePage.js";
import { StorePage } from "../../../../pages/StorePage.js";
import { PricingPage } from "../../../../pages/PricingPage.js";

test("User is navigated to pricing page from home page", async ({ page }) => {
  // Arrange
  const homePage = new HomePage(page);
  const storePage = new StorePage(page);

  // Act
  await homePage.navigateToHome();
  await homePage.navigateToStoreIndividualUsePage();
  await retryExpect(() => storePage.verifyStorePage()).toBe(true);

  // Assertions with retryExpect
  await retryExpect(() => storePage.getSelectedSubscriptionOptions()).toEqual(
    "For Individual Use"
  );

  await storePage.changeSubscriptionOption("For Organizations");
  await retryExpect(() => storePage.getSelectedSubscriptionOptions()).toEqual(
    "For Organizations"
  );

  await retryExpect(() => storePage.getSelectedBillingCycle()).toContain(
    "Yearly billing"
  );

  await storePage.changeBillingOption("Monthly billing");

  await retryExpect(() => storePage.getSelectedBillingCycle()).toContain(
    "Monthly billing"
  );

  await retryExpect(() => storePage.getPriceDetails("CLion")).toEqual({
    basePrice: "€22.90",
    vatPrice: "incl. VAT €28.17",
    period: "per user, per month",
  });

  await storePage.changeBillingOption("Yearly billing");

  await retryExpect(() => storePage.getSelectedBillingCycle()).toContain(
    "Yearly billing"
  );

  await retryExpect(() => storePage.getPriceDetails("CLion")).toEqual({
    basePrice: "€229.00",
    vatPrice: "incl. VAT €281.67",
    period: "per user, per year",
  });
});
