// Import test fixture and page objects
import { test } from "@playwright/test";
import { retryExpect } from "../../../utils/retryExpect.js";
import { HomePage } from "../../../pages/HomePage.js";
import { MarketplacePluginsPage } from "../../../pages/MarketplacePluginsPage.js";

test("User can navigate and interact with marketplace plugins page", async ({
  page,
}) => {
  // Arrange
  const homePage = new HomePage(page);
  const marketplacePluginsPage = new MarketplacePluginsPage(page);

  // Act
  await homePage.navigateToHome();
  // Add navigation method to marketplace plugins page
  await homePage.navigateToMarketplacePluginsPage();
  await retryExpect(() =>
    marketplacePluginsPage.verifyMarketplacePluginsPage()
  ).toBe(true);

  // Assertions with retryExpected - Test subscription option switching
  await retryExpect(() =>
    marketplacePluginsPage.getSelectedSubscriptionOption()
  ).toContain("For Organizations");

  await retryExpect(() =>
    marketplacePluginsPage.getSelectedBillingCycle()
  ).toContain("Yearly billing");

  await retryExpect(() =>
    marketplacePluginsPage.getPluginDetails("Actionate")
  ).toEqual({
    basePrice: "€20.00",
    vatPrice: "incl. VAT €24.60",
    period: "per user, per year",
  });

  await marketplacePluginsPage.changeBillingOption("Monthly billing");
  await retryExpect(() =>
    marketplacePluginsPage.getSelectedBillingCycle()
  ).toContain("Monthly billing");

  await retryExpect(() =>
    marketplacePluginsPage.getPluginDetails("Actionate")
  ).toEqual({
    basePrice: "€2.00",
    vatPrice: "incl. VAT €2.46",
    period: "per user, per month",
  });
});
