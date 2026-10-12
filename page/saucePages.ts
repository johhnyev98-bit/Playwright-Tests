import { Page, expect } from '@playwright/test';

export class SauceStorePage {
  constructor(private page: Page) {}

  // Navegação
  async acessarSite() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  // Interação de Login (reutilizável)
  async fazerLogin(usuario: string, senha: string) {
    await this.page.fill('#user-name', usuario);
    await this.page.fill('#password', senha);
    await this.page.click('#login-button');
  }

  // Validação de redirecionamento após login
  async validarLoginComSucesso() {
    await expect(this.page).toHaveURL(/.*inventory.html/);
    await expect(this.page.locator('.title')).toHaveText('Products');
  }

  // Adicionar produto ao carrinho
  async adicionarPrimeiroProdutoAoCarrinho() {
    await this.page.click('#add-to-cart-sauce-labs-backpack');
  }

  // Validação do carrinho
  async acessarCarrinhoEVerificarItem() {
    await this.page.click('.shopping_cart_link');
    await expect(this.page).toHaveURL(/.*cart.html/);
    await expect(this.page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
  }
}