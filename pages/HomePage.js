// pages/HomePage
export class HomePage {
  constructor(page) {
    this.page = page;
  }

  async navigateToHome() {
    await this.page.goto("https://www.jetbrains.com");
    const accept = this.page.getByRole("button", { name: "Accept All" });
    try {
      await accept.waitFor({ state: "visible", timeout: 5000 });
      await accept.click();
    } catch {
      // banner didn’t appear → safely continue
    }
  }

  async clickDeveloperTools() {
    await this.page
      .getByRole("button", { name: "Developer Tools: Open submenu" })
      .click();
  }

  async navigateToIntelliJIDEAPage() {
    await this.clickDeveloperTools();
    await this.page
      .locator('[data-test="main-menu"]')
      .getByRole("link", { name: "IntelliJ IDEA" })
      .click();
  }

  async openStoreSubMenu() {
    await this.page
      .getByRole("button", { name: "Store: Open submenu" })
      .click();
  }

  async navigateToStoreIndividualUsePage() {
    await this.openStoreSubMenu();
    await this.page.locator('a[href="/store/#personal"]').first().click();
  }

  async navigateToStoreOrganizationPage() {
    await this.openStoreSubMenu();
    await this.page.locator('a[href="/store/#commercial"]').first().click();
  }

  async navigateToMarketplacePluginsPage() {
    await this.openStoreSubMenu();
    await this.page.locator('a[href="/store/plugins/"]').first().click();
  }
}
