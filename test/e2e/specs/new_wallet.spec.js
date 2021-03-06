describe('New Wallet Page', () => {
  it('should generate a new wallet and display seed phrase', () => {
    cy.visit('#/new');
    cy.get('#jsonKeystorePassword').type('12341234');
    cy.contains('New Wallet').click();
    cy.get('[data-test=seed-phrase]').contains(/(\w+\s*){12}/); // 12 word seed phrase
  });
});
