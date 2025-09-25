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

  await marketplacePluginsPage.changeSubscriptionOption("For Individual Use");

  await retryExpect(() =>
    marketplacePluginsPage.getSelectedSubscriptionOption()
  ).toContain("For Individual Use");

  await retryExpect(() =>
    marketplacePluginsPage.getPluginDetails("Actionate")
  ).toEqual({
    basePrice: "€10.00",
    vatPrice: "incl. VAT €12.30",
    period: "per year",
  });

  // Test billing cycle switching

  await marketplacePluginsPage.changeBillingOption("Monthly billing");
  await retryExpect(() =>
    marketplacePluginsPage.getSelectedBillingCycle()
  ).toContain("Monthly billing");

  await retryExpect(() =>
    marketplacePluginsPage.getPluginDetails("Actionate")
  ).toEqual({
    basePrice: "€1.00",
    vatPrice: "incl. VAT €1.23",
    period: "per month",
  });
});
