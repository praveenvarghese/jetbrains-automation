// Import test fixture and page objects
import { test } from "@playwright/test";
import { retryExpect } from "../../../utils/retryExpect.js";
import { HomePage } from "../../../pages/HomePage.js";
import { StorePage } from "../../../pages/StorePage.js";

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

  await retryExpect(() =>
    storePage.getPriceDetails("IntelliJ IDEA Ultimate")
  ).toEqual({
    basePrice: "€59.90",
    vatPrice: "incl. VAT €73.68",
    period: "per user, per month",
  });

  await storePage.changeBillingOption("Yearly billing");

  await retryExpect(() => storePage.getSelectedBillingCycle()).toContain(
    "Yearly billing"
  );

  await retryExpect(() =>
    storePage.getPriceDetails("IntelliJ IDEA Ultimate")
  ).toEqual({
    basePrice: "€599.00",
    vatPrice: "incl. VAT €736.77",
    period: "per user, per year",
  });
});
