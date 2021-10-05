const app = '[data-test="app"]';
const loader = '[data-test="loader"]';
const getInstructionComponent = '[data-test="get-instruction-component"]';
const errorColor = 'rgb(229, 57, 53)';
const successColor = 'rgb(0, 150, 136)';

describe('马丽 interacts with the "multiple-choice" system', () => {
  it(
    'Displays the multiple-choice screen with ' +
      'vibrating loudspeaker/mouth talking, ' +
      'and 4 selectable options',
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
      cy.get(loader).should('not.be.visible');
      cy.get(app).should('be.visible');
      cy.get(getInstructionComponent).should('not.exist');
      cy.get('[data-test="item-under-test-button"]').should('be.visible');
      // 3 ani.animate called: 1 toggle-instructions, 2 item-under-test--button
      cy.get('@animation.animate').should('have.callCount', 3);
      // 2 ani.cancel called: 2 item-under-test-button mount
      cy.get('@animation.cancel').should('have.callCount', 2);
      // 1 audio.play called: item-under-test-button auto on load
      cy.get('@audio.play').should('have.callCount', 1);
      // 0 animation.play called (ani created on first play, no repeats)
      cy.get('@animation.play').should('have.callCount', 0);

      cy.log('**2. 马丽 sees 4 words**');
      cy.log('-- of which one is the correct match to the audio played.');
      cy.get('[data-test="option-button-1"]')
        .as('option1')
        .should('be.visible');
      cy.get('[data-test="option-button-2"]')
        .as('option2')
        .should('be.visible');
      cy.get('[data-test="option-button-3"]')
        .as('option3')
        .should('be.visible');
      cy.get('[data-test="option-button-4"]')
        .as('option4')
        .should('be.visible');

      cy.log('**3. 马丽 taps the loudspeaker to hear the audio again.**');
      cy.get('[data-test="item-under-test-button"]').click();
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
      // 一(option4),二(option2),三(option1),四(option3).
      cy.get('@option1')
        // click incorrect option
        .click()
        .wait(20)
        // item turned red
        .should('have.css', 'background-color', errorColor);
      // item audio plays
      cy.get('@audio.play').should('have.callCount', 3); // 2 + 1
      //   item buzzes
      cy.get('@animation.animate').should('have.callCount', 6); // 3 + 3
      cy.get('@animation.cancel').should('have.callCount', 6); // 4 + 2 (remount?)
      //   item is disabled
      cy.get('@option1').should('be.disabled');
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

describe('马丽 interacts with the "multiple-choice explanation" system', () => {
  it(
    'Displays the multiple-choice screen with ' +
      'an explanation, ' +
      'and 2-4 selectable options',
    () => {
      cy.log('**1. 马丽 sees an explanation**');
      cy.visit('/lesson/multiple-choice-explanation-test', {
        onBeforeLoad(window) {
          cy.spy(window.HTMLMediaElement.prototype, 'play').as('audio.play');
          cy.spy(window.Animation.prototype, 'play').as('animation.play');
          cy.spy(window.HTMLElement.prototype, 'animate').as(
            'animation.animate',
          );
          cy.spy(window.Animation.prototype, 'cancel').as('animation.cancel');
        },
      });
      cy.get(loader).should('not.be.visible');
      cy.get(app).should('be.visible');
      cy.get(getInstructionComponent).should('not.exist');
      cy.get('[data-test="item-under-test-button"]')
        .should('be.visible')
        .then((el) => {
          cy.contains('一加二').should('match', el);
        });
      // 0 audio.play called: 0 item-under-test-button auto on load
      cy.get('@audio.play').should('have.callCount', 0);
      // 3 ani.animate called: 1 toggle-instructions
      cy.get('@animation.animate').should('have.callCount', 1);
      // 0 ani.cancel called: 0 item-under-test-button audio
      cy.get('@animation.cancel').should('have.callCount', 0);
      // 0 animation.play called (ani created on first play, no repeats)
      cy.get('@animation.play').should('have.callCount', 0);

      cy.log('**2. 马丽 sees 3 words**');
      cy.log('-- of which one is the correct match to the explanation.');
      cy.get('[data-test="option-button-1"]')
        .as('option1')
        .should('be.visible')
        .should('contain', '一');
      cy.get('[data-test="option-button-2"]')
        .as('option2')
        .should('be.visible')
        .should('contain', '四');
      cy.get('[data-test="option-button-3"]')
        .as('option3')
        .should('be.visible')
        .should('contain', '三');
      cy.get('[data-test="option-button-4"]').should('not.exist');

      cy.log('**3. 马丽 taps wrong word/non-corresponding word**');
      cy.log('-- sees the word vibrate, flash red');
      cy.log('-- hears the audio for the incorrect word');
      cy.log('-- sees the word become disabled and non-interactive');

      // Normally, we would set up the data here. I'm going to go with
      // foreknowledge for now. At the time of writing this test, the data-set
      // is limited to one exercise session testing the explanation 一加二 with
      // options 一(option1),四(option2),三(option3)
      cy.get('@option1')
        // click incorrect option
        .click()
        .wait(20)
        .should('have.css', 'background-color', errorColor);
      // item audio plays
      cy.get('@audio.play').should('have.callCount', 1); // 0 + 1
      //   item buzzes
      cy.get('@animation.animate').should('have.callCount', 4); // 1 + 3
      cy.get('@animation.cancel').should('have.callCount', 2); // 0 + 2
      // 0 animation.play called (ani created on first play, no repeats)
      cy.get('@animation.play').should('have.callCount', 0);

      //   item is disabled
      cy.get('@option1').should('be.disabled');
      // there's no itemUnderTest audio to play
      cy.get('@audio.play').should('have.callCount', 1); // 1 + 0

      cy.log('**4. 马丽 taps correct word/corresponding word**');
      cy.log('-- sees the word turn green');
      cy.log('-- hears the audio for the correct word');
      cy.log('-- sees the other words become disabled and non-interactive');
      cy.log('-- sees the continue button available');
      cy.get('[data-test="continue-button"').should('not.exist');
      cy.get('@option3')
        .click()
        .should('have.css', 'background-color', successColor);
      cy.get('@option2').should('be.disabled');
      cy.get('[data-test="continue-button"').should('be.visible');
      // end
    },
  );
});
