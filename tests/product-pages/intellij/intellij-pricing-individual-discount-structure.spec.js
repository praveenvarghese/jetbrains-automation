import { test } from "@playwright/test";
import { retryExpect } from "../../../utils/retryExpect.js";
import { HomePage } from "../../../pages/HomePage.js";
import { IntelliJPage } from "../../../pages/IntelliJPage.js";
import { PricingPage } from "../../../pages/PricingPage.js";

test("Verify IntelliJ individual pricing displays correct rates for yearly and monthly billing cycles", async ({
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
  await pricingPage.navigateToIndividualUseTab();

  // Verify individual use is selected and yearly billing is default
  await retryExpect(() => pricingPage.getSelectedSubscriptionOption()).toEqual(
    "For Individual Use"
  );
  await retryExpect(() => pricingPage.getSelectedBillingCycle()).toContain(
    "Yearly billing"
  );

  // Validate first-year pricing structure
  await retryExpect(() => pricingPage.getPricingDetails()).toEqual({
    period: "first year",
    price: "€169.00",
    vatPrice: "incl. VAT €207.87",
  });

  // Switch to monthly billing and verify pricing updates
  await pricingPage.navigateToMonthlyBilling();

  // Validate monthly pricing matches expected rates
  await retryExpect(() => pricingPage.getPricingDetails()).toEqual({
    period: "per month",
    price: "€16.90",
    vatPrice: "incl. VAT €20.79",
  });
});
