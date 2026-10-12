import { test, expect } from '@playwright/test';
import { SauceStorePage } from '../page/saucePages';

test.describe('Automação de Testes - SauceDemo com Playwright', () => {
  let saucePage: SauceStorePage;

  test.beforeEach(async ({ page }) => {
    saucePage = new SauceStorePage(page);
    await saucePage.acessarSite();
  });

  // --- Caso de Teste 1: Teste Positivo de Login ---
  test('CT001: Deve realizar login com sucesso usando credenciais válidas', async ({ page }) => {
    await saucePage.fazerLogin('standard_user', 'secret_sauce');
    await saucePage.validarLoginComSucesso();
  });

  // --- Caso de Teste 2: Teste Negativo de Login (Erro) ---
  test('CT002: Deve exibir mensagem de erro ao tentar logar com senha incorreta', async ({ page }) => {
    await saucePage.fazerLogin('standard_user', 'senha_errada');
    
    const elementoErro = page.locator('[data-test="error"]');
    await expect(elementoErro).toBeVisible();
    await expect(elementoErro).toContainText('Epic sadface: Username and password do not match any user in this service');
  });

  // --- Caso de Teste 3: Navegação e Detalhes do Produto ---
  test('CT003: Deve abrir a página de detalhes ao clicar em um produto', async ({ page }) => {
    await saucePage.fazerLogin('standard_user', 'secret_sauce');
    
    // Clica no título do primeiro produto
    await page.click('#item_4_title_link');
    
    // Valida navegação para a página de detalhes
    await expect(page).toHaveURL(/.*inventory-item.html\?id=4/);
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.inventory_details_price')).toBeVisible();
  });

  // --- Caso de Teste 4: Adicionar produto ao Carrinho ---
  test('CT004: Deve adicionar um produto ao carrinho com sucesso', async ({ page }) => {
    await saucePage.fazerLogin('standard_user', 'secret_sauce');
    await saucePage.adicionarPrimeiroProdutoAoCarrinho();
    
    // Valida se o badge do carrinho exibe o número 1
    const badgeCarrinho = page.locator('.shopping_cart_badge');
    await expect(badgeCarrinho).toHaveText('1');

    await saucePage.acessarCarrinhoEVerificarItem();
  });

  // --- Caso de Teste 5: Fluxo de Checkout (Preenchimento e Validação) ---
  test('CT005: Deve preencher informações de envio no checkout', async ({ page }) => {
    await saucePage.fazerLogin('standard_user', 'secret_sauce');
    await saucePage.adicionarPrimeiroProdutoAoCarrinho();
    
    // Vai para o carrinho e inicia o checkout
    await page.click('.shopping_cart_link');
    await page.click('#checkout');
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    // Preenche dados de envio
    await page.fill('#first-name', 'João');
    await page.fill('#last-name', 'Silva');
    await page.fill('#postal-code', '51020-000');
    await page.click('#continue');

    // Valida que chegou na página de resumo (Checkout Step Two)
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await expect(page.locator('.summary_total_label')).toBeVisible();

    // Finaliza a compra
    await page.click('#finish');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });
});