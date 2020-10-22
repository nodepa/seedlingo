describe('马丽 interacts with the "matching" system', () => {
  it(
    'Displays the matching screen with ' +
      '4 "character" cards and 4 "symbol" cards',
    () => {
      cy.log(
        '1. 马丽 sees 4 symbol buttons, and 4 corresponding character buttons.',
      );
      cy.visit('/lesson/2', {
        onBeforeLoad(window) {
          cy.spy(window.HTMLMediaElement.prototype, 'play').as('audio.play');
          cy.spy(window.Animation.prototype, 'play').as('animation.play');
          cy.spy(window.HTMLElement.prototype, 'animate').as(
            'animation.animate',
          );
          cy.spy(window.Animation.prototype, 'cancel').as('animation.cancel');
        },
      });
      cy.get('[data-test="loader"]').should('not.be.visible');
      cy.get('[data-test="app"]').should('be.visible');
      cy.get('[data-test="get-instructions-component"]').should(
        'not.be.visible',
      );
      cy.get('[data-test="char-1-button"]').should('be.visible');
      cy.get('[data-test="char-2-button"]').should('be.visible');
      cy.get('[data-test="char-3-button"]').should('be.visible');
      cy.get('[data-test="char-4-button"]').should('be.visible');
      cy.get('[data-test="sym-5-button"]').should('be.visible');
      cy.get('[data-test="sym-6-button"]').should('be.visible');
      cy.get('[data-test="sym-7-button"]').should('be.visible');
      cy.get('[data-test="sym-8-button"]').should('be.visible');
      // 1 ani.animate called: 1 toggle-instructions
      cy.get('@animation.animate').should('have.callCount', 1);
      // 0 ani.cancel called:
      cy.get('@animation.cancel').should('have.callCount', 0);
      // 0 audio.play called:
      cy.get('@audio.play').should('have.callCount', 0);
      // 0 animation.play called (ani created on first play, no repeats)
      cy.get('@animation.play').should('have.callCount', 0);

      cy.log(
        '2. 马丽 taps a character button, hears corresponding audio, sees a ripple animation on the button until audio ends and sees the button is highlighted or colored',
      );
      cy.get('[data-test="char-1-button"]').click(); // character button
      // cy.get('@audio.play').should('have.callCount', 1); // 0 + 1
      // cy.get('@animation.play').should('have.callCount', 0); // 0 + 2
      // cy.get('@animation.animate').should('have.callCount', 3); // 1 + 2(*ripple)
      // cy.get('@animation.cancel').should('have.callCount', 2); // 0 + 2(*ripple)

      cy.log(
        '3. 马丽 taps a non-corresponding symbol button, hears corresponding audio, sees a ripple animation on the button until audio ends and sees the symbol button is highlighted or colored in a different color to the character button sees both highlighted buttons vibrate (and turn red?) sees both highlighted buttons return to normal state, i.e. is not highlighted',
      );

      cy.log(
        '4. 马丽 taps the same symbol button again, hears corresponding audio, sees a ripple animation on the button until audio ends and sees the button is highlighted or colored in the same color as the last time it was tapped',
      );

      // ###############
      // ### pending ###
      // ###############
      // cy.log(
      //   '马丽 taps the right character/the corresponding character, and sees the character expand to fill the screen, flash green or display fireworks, audio is re-played (?), then screen transitions to the next exercise.',
      // );

      // ###############
      // ### pending ###
      // ###############
      // ADDITIONAL DETAILS
      // ensure overlay disappears after audio
      // - click instruction toggle
      // - click home button
      // - ensure plays audio
      // - ensure plays animation
      // - ensure overlay disappears after audio done (wire up short audio or
      //   mock play)
    },
  );
});
