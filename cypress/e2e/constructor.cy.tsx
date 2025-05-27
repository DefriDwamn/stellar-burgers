/// <reference types="cypress" />
const selectorIngredientsModule = '[data-cy="ingredients-module"]';
const selectorConstructorModule = '[data-cy="constructor-module"]';
const selectorModal = '[data-cy="modal"]';
const selectorButtonCloseModal = '[data-cy="modal-close"]';
const selectorOverlayModal = '[data-cy="modalOverlay"]';
const ingredientBun = 'Флюоресцентная булка R2-D3';
const ingredientFilling = 'Хрустящие минеральные кольца';

const NUTRITION_LABELS = {
  CALORIES: 'Калории',
  PROTEINS: 'Белки',
  FAT: 'Жиры',
  CARBOHYDRATES: 'Углеводы'
};

const PLACEHOLDER_TEXTS = {
  SELECT_BUN: 'Выберите булки',
  SELECT_FILLING: 'Выберите начинку'
};

describe('Burger Constructor Page Tests', () => {
  beforeEach(() => {
    cy.fixture('ingredients.json').as('ingredientsData');
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.fixture('post_order.json').as('orderData');
    cy.intercept('POST', '/api/orders', { fixture: 'post_order.json' }).as(
      'postOrder'
    );

    localStorage.setItem('refreshToken', 'fake-refresh-token');
    cy.setCookie('accessToken', 'fake-access-token');
    cy.visit('/');
  });

  afterEach(() => {
    localStorage.removeItem('refreshToken');
    cy.clearCookie('accessToken');
  });

  it('should add bun and filling to constructor when clicking add button', () => {
    cy.wait('@getIngredients');

    // Add bun
    cy.get(selectorIngredientsModule)
      .contains(ingredientBun)
      .parent()
      .find('button')
      .as('bunButton')
      .click();

    cy.get(selectorConstructorModule).should(
      'contain.text',
      ingredientBun
    );

    // Add filling
    cy.get(selectorIngredientsModule)
      .contains(ingredientFilling)
      .parent()
      .find('button')
      .as('fillingButton')
      .click();

    cy.get(selectorConstructorModule).should(
      'contain.text',
      ingredientFilling
    );
  });

  it('should open ingredient modal with correct data and close it via close button or overlay', function () {
    cy.wait('@getIngredients');
  
    // Get data from fixture
    cy.get('@ingredientsData').then((ingredientsData: any) => {
      const testIngredient = ingredientsData.data.find(
        (item: { name: string }) => item.name === ingredientBun
      );
  
      // Open modal by click
      cy.contains(ingredientBun).click();
      cy.get(selectorModal).should('be.visible');
  
      // Check if modal displays correct data
      cy.get(selectorModal).within(() => {
        cy.contains(testIngredient.name);
        cy.contains(NUTRITION_LABELS.CALORIES).should('be.visible');
        cy.contains(testIngredient.calories.toString()).should('be.visible');
        cy.contains(NUTRITION_LABELS.PROTEINS).should('be.visible');
        cy.contains(testIngredient.proteins.toString()).should('be.visible');
        cy.contains(NUTRITION_LABELS.FAT).should('be.visible');
        cy.contains(testIngredient.fat.toString()).should('be.visible');
        cy.contains(NUTRITION_LABELS.CARBOHYDRATES).should('be.visible');
        cy.contains(testIngredient.carbohydrates.toString()).should('be.visible');
      });
  
      // Close via button
      cy.get(selectorButtonCloseModal).click();
      cy.get(selectorModal).should('not.exist');
  
      // Open modal again
      cy.contains(ingredientBun).click();
      cy.get(selectorModal).should('be.visible');
  
      // Close via overlay
      cy.get(selectorOverlayModal).click({ force: true });
      cy.get(selectorModal).should('not.exist');
    });
  });

  it('should create order and clear constructor after successful order placement', () => {
    // Mock auth endpoints
    cy.intercept('POST', '/api/auth/login', { fixture: 'login.json' }).as(
      'login'
    );
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('user');

    cy.wait('@getIngredients');

    // Add ingredients to constructor
    cy.get(selectorIngredientsModule)
      .contains(ingredientBun)
      .parent()
      .find('button')
      .as('bunButton')
      .click({ force: true });

    cy.get(selectorIngredientsModule)
      .contains(ingredientFilling)
      .parent()
      .find('button')
      .as('fillingButton')
      .click({ force: true });

    // Place order
    cy.get(selectorConstructorModule)
      .children()
      .last()
      .find('button')
      .as('orderButton')
      .click({ force: true });

    // Verify order creation
    cy.wait('@postOrder').its('response.statusCode').should('eq', 200);

    // Check order modal
    cy.get(selectorModal).should('exist');
    cy.get(selectorModal).should('contain', '12345');

    // Close order modal
    cy.get(selectorButtonCloseModal).click();
    cy.get(selectorModal).should('not.exist');

    // Verify constructor is cleared
    cy.get(selectorConstructorModule)
      .children()
      .first()
      .should('contain.text', PLACEHOLDER_TEXTS.SELECT_BUN);
    cy.get(selectorConstructorModule)
      .children()
      .first()
      .next()
      .should('contain.text', PLACEHOLDER_TEXTS.SELECT_FILLING);
  });
});
