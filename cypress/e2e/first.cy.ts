describe('Login / Register Page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
    });

    it('should have a "Logowanie" text', () => {
        cy.contains('Logowanie');
    });

    it('should go to "Rejestracja" Tab', () => {
        cy.contains('Rejestracja').click();
        cy.contains('Zarejestruj się');
    });
});
