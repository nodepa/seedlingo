describe('马丽 interacts with the "multiple-choice" system', () => {
  it(
    'Displays the multiple-choice screen with ' +
      'vibrating loudspeaker/mouth talking, ' +
      'and 4 alternative selectable answers',
    () => {
      cy.log('**1. 马丽 sees a vibrating loudspeaker/mouth talking**');
      cy.log('-- hears the audio of a corresponding word');
      cy.visit('/lesson/multiple-choice-test', {
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
      cy.get('[data-test="item-under-test-audio-button"]').should('be.visible');
      // 3 ani.animate called: 1 toggle-instructions, 2 item-under-test-audio-button
      cy.get('@animation.animate').should('have.callCount', 3);
      // 2 ani.cancel called: 2 item-under-test-audio-button mount
      cy.get('@animation.cancel').should('have.callCount', 2);
      // 1 audio.play called: item-under-test-audio-button auto on load
      cy.get('@audio.play').should('have.callCount', 1);
      // 0 animation.play called (ani created on first play, no repeats)
      cy.get('@animation.play').should('have.callCount', 0);

      cy.log('**2. 马丽 sees 4 words**');
      cy.log('-- of which one is the correct match to the audio played.');
      cy.get('[data-test="choice-1-button"]').should('be.visible');
      cy.get('[data-test="choice-2-button"]').should('be.visible');
      cy.get('[data-test="choice-3-button"]').should('be.visible');
      cy.get('[data-test="choice-4-button"]').should('be.visible');

      cy.log('**3. 马丽 taps the loudspeaker to hear the audio again.**');
      cy.get('[data-test="item-under-test-audio-button"]').click();
      cy.get('@audio.play').should('have.callCount', 2); // 1 + 1
      cy.get('@animation.play').should('have.callCount', 2); // 0 + 2
      cy.get('@animation.animate').should('have.callCount', 3); // 3 + 0
      cy.get('@animation.cancel').should('have.callCount', 4); // 2 + 2

      // ###############
      // ### pending ###
      // ###############
      cy.log('**4. 马丽 taps wrong word/non-corresponding word**');
      cy.log('-- sees the word vibrate, flash red');
      cy.log('-- hears the audio for the incorrect word');
      cy.log('-- sees the word become disabled and non-interactive');
      cy.log('-- hears the "item under test" audio plays again');
      cy.log('马丽 can interrupt this by tapping another option');
      cy.log('-- upon which currently playing audio stops');
      cy.log('-- animations stop');
      cy.log('-- previous incorrect entry is immediately rendered disabled.');
      // Normally, we would set up the data here. I'm going to go with
      // foreknowledge for now. At the time of writing this test, the data-set
      // is limited to one exercise session testing the word 二 among
      // 一(choice-4),二(choice-2),三(choice-1),四(choice-3).
      cy.get('[data-test="choice-1-button"]')
        // click incorrect answer
        .click()
        // item turned red
        .should('have.css', 'background-color', 'rgb(255, 82, 82)');
      // item audio plays
      cy.get('@audio.play').should('have.callCount', 3); // 2 + 1
      //   item buzzes
      cy.get('@animation.animate').should('have.callCount', 6); // 3 + 3
      cy.get('@animation.cancel').should('have.callCount', 6); // 4 + 2 (remount?)
      //   item is disabled
      cy.get('[data-test="choice-1-button"]').should('be.disabled');
      //   itemUnderTest audio plays
      cy.get('@audio.play').should('have.callCount', 4); // 3 + 1
      // end

      // the above can be interrupted, i.e. redo, tap other, verify
      //   item audio stops
      //   item animation stops
      //   item end state achieved
      //   alt. item plays audio+ani., or show instructions overlay, or go home

      // ###############
      // ### pending ###
      // ###############
      // cy.log(
      //   '5. 马丽 taps the right word/the corresponding word, and sees the word expand to fill the screen, flash green or display fireworks, audio is re-played (?), then screen transitions to the next exercise.',
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
