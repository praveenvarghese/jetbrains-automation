export class HomePage {
  constructor(page) {
    this.page = page;
  }

  /** Navigates to JetBrains homepage and handles cookie consent */
  async navigateToHome() {
    await this.page.goto("/");
    await this._handleCookieBanner();
  }

  /** Navigates to IntelliJ IDEA product page via Developer Tools menu */
  async navigateToIntelliJPage() {
    await this._openDeveloperToolsMenu();
    await this.page
      .locator('[data-test="main-menu"]')
      .getByRole("link", { name: "IntelliJ IDEA" })
      .click();
  }

  /** Navigates to store page for individual users */
  async navigateToStoreIndividualUsePage() {
    await this._openStoreMenu();
    await this.page.locator('a[href="/store/#personal"]').first().click();
  }

  /** Navigates to store page for teams and organizations */
  async navigateToStoreTeamsAndOrganizationsPage() {
    await this._openStoreMenu();
    await this.page.locator('a[href="/store/#commercial"]').first().click();
  }

  /** Navigates to marketplace plugins page */
  async navigateToMarketplacePluginsPage() {
    await this._openStoreMenu();
    await this.page.locator('a[href="/store/plugins/"]').first().click();
  }

  /** Handles optional cookie consent banner with 5 second timeout @private */
  async _handleCookieBanner() {
    const acceptButton = this.page.getByRole("button", { name: "Accept All" });
    try {
      await acceptButton.waitFor({ state: "visible", timeout: 5000 });
      await acceptButton.click();
    } catch {
      // Banner may not appear - continue silently
    }
  }

  /** Opens the Developer Tools submenu from main navigation @private */
  async _openDeveloperToolsMenu() {
    await this.page
      .getByRole("button", { name: "Developer Tools: Open submenu" })
      .click();
  }

  /** Opens the Store submenu from main navigation @private */
  async _openStoreMenu() {
    await this.page
      .getByRole("button", { name: "Store: Open submenu" })
      .click();
  }
}
