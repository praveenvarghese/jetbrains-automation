import { test } from "@playwright/test";
import { retryExpect } from "../../../utils/retryExpect.js";
import { HomePage } from "../../../pages/HomePage.js";
import { IntelliJPage } from "../../../pages/IntelliJPage.js";
import { PricingPage } from "../../../pages/PricingPage.js";

test("Verify IntelliJ organization pricing displays correct rates for yearly and monthly billing cycles", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const intelliJPage = new IntelliJPage(page);
  const pricingPage = new PricingPage(page);

  // Navigate to IntelliJ pricing page
  await homePage.navigateToHome();
  await homePage.navigateToIntelliJPage();
  await retryExpect(() => intelliJPage.verifyIntelliJPage()).toBe(true);
  await intelliJPage.navigateToPricingPage();
  await pricingPage.verifyPricingPage();

  // Verify organization use is selected and yearly billing is default
  await retryExpect(() => pricingPage.getSelectedSubscriptionOption()).toEqual(
    "For Organizations"
  );
  await retryExpect(() => pricingPage.getSelectedBillingCycle()).toContain(
    "Yearly billing"
  );

  // Validate yearly organization pricing structure
  await retryExpect(() => pricingPage.getPricingDetails()).toEqual({
    price: "€599.00",
    period: "per user, per year",
    vatPrice: "incl. VAT €736.77",
  });

  // Switch to monthly billing and verify pricing updates
  await pricingPage.navigateToMonthlyBilling();

  // Validate monthly organization pricing matches expected rates
  await retryExpect(() => pricingPage.getPricingDetails()).toEqual({
    period: "per user, per month",
    price: "€59.90",
    vatPrice: "incl. VAT €73.68",
  });
});
