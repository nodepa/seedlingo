describe('马丽 interacts with the "multiple-choice" system', () => {
  const app = '[data-test="app"]';
  const loader = '[data-test="loader"]';
  const instructionsExplainerComponent =
    '[data-test="instructions-explainer-component"]';
  const itemUnderTestButton = '[data-test="item-under-test-button"]';
  const errorColor = 'ion-color-danger'; // 'rgb(229, 115, 115)';

  it(
    'Displays the multiple-choice screen with ' +
      'vibrating loudspeaker/mouth talking, ' +
      'and 4 selectable options',
    () => {
      cy.log('**1. 马丽 sees a vibrating loudspeaker/mouth talking**');
      cy.log('-- hears the audio of a corresponding word');
      cy.visit('/about', {
        onBeforeLoad(window) {
          delete Object.getPrototypeOf(window.navigator).serviceWorker;
        },
      })
        .get('h1')
        .contains('Seedlingo')
        .click();
      cy.visit('/unit/multiple-choice-test', {
        onBeforeLoad(window) {
          delete Object.getPrototypeOf(window.navigator).serviceWorker;
          cy.spy(window.HTMLMediaElement.prototype, 'play').as('audio.play');
          cy.spy(window.Animation.prototype, 'play').as('animation.play');
          cy.spy(window.HTMLElement.prototype, 'animate').as(
            'animation.animate',
          );
          // avoid dark mode
          cy.stub(window, 'matchMedia', () => {
            return {
              matches: false,
              addEventListener() {
                /**/
              },
            };
          });
        },
      });
      cy.get(loader).should('not.be.visible');
      cy.get(app).should('be.visible');
      cy.get(instructionsExplainerComponent).should('not.exist');
      cy.get(itemUnderTestButton).should('be.visible');
      // 1 item audio auto-played
      cy.get('@audio.play').should('have.callCount', 1).invoke('resetHistory');
      // 2 audio ripples played
      cy.get('@animation.play')
        .should('have.callCount', 2)
        .invoke('resetHistory');
      // 2 audio ripples created + 0 button buzz
      cy.get('@animation.animate')
        .should('have.callCount', 2)
        .invoke('resetHistory');

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
      cy.wait(600).get(itemUnderTestButton).click();
      // 1 item audio played
      cy.get('@audio.play').should('have.callCount', 1).invoke('resetHistory');

      // 2 audio ripples played
      cy.get('@animation.play')
        .should('have.callCount', 2)
        .invoke('resetHistory');
      // 2 audio ripples created + 0 button buzz
      cy.get('@animation.animate')
        .should('have.callCount', 2)
        .invoke('resetHistory');

      cy.log('**4. 马丽 taps wrong word/non-corresponding word**');
      cy.log('-- sees the word vibrate, flash red');
      cy.log('-- hears the audio for the incorrect word');
      cy.log('-- sees the word become disabled and non-interactive');
      cy.log('-- hears the "item under test" audio plays again');
      cy.log('马丽 can interrupt this by tapping another option');
      cy.log('-- upon which currently playing audio stops');
      cy.log('-- animations stop');
      cy.log('-- previous incorrect entry is immediately rendered disabled.');
      // click incorrect option
      cy.get('@option1').click().should('have.class', errorColor);
      cy.get('@option1').should('have.class', 'button-disabled');
      // 2 item audio played
      cy.get('@audio.play').should('have.callCount', 2).invoke('resetHistory');
      // 4 audio ripples played
      cy.get('@animation.play')
        .should('have.callCount', 4)
        .invoke('resetHistory');
      // 4 audio ripples created + 1 button buzz
      cy.get('@animation.animate')
        .should('have.callCount', 5)
        .invoke('resetHistory');

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
      // - click instructions toggle
      // - click home button
      // - ensure plays audio
      // - ensure plays animation
      // - ensure overlay disappears after audio done (wire up short audio or
      //   mock play)
    },
  );
});

describe('马丽 interacts with the "multiple-choice explanation" system', () => {
  const app = '[data-test="app"]';
  const loader = '[data-test="loader"]';
  const instructionsExplainerComponent =
    '[data-test="instructions-explainer-component"]';
  const itemUnderTestButton = '[data-test="item-under-test-button"]';
  const errorColor = 'ion-color-danger'; // 'rgb(229, 115, 115)';
  const successColor = 'ion-color-success'; // 'rgb(0, 150, 136)';

  it(
    'Displays the multiple-choice screen with ' +
      'an explanation, ' +
      'and 2-4 selectable options',
    () => {
      cy.log('**1. 马丽 sees an explanation**');
      cy.visit('/unit/explanation-multiple-choice-test', {
        onBeforeLoad(window) {
          delete Object.getPrototypeOf(window.navigator).serviceWorker;
          cy.spy(window.HTMLMediaElement.prototype, 'play').as('audio.play');
          cy.spy(window.Animation.prototype, 'play').as('animation.play');
          cy.spy(window.HTMLElement.prototype, 'animate').as(
            'animation.animate',
          );
          // avoid dark mode
          cy.stub(window, 'matchMedia', () => {
            return {
              matches: false,
              addEventListener() {
                /**/
              },
            };
          });
        },
      });
      cy.get(loader).should('not.be.visible');
      cy.get(app).should('be.visible');
      cy.get(instructionsExplainerComponent).should('not.exist');
      cy.get(itemUnderTestButton)
        .should('be.visible')
        .should('contain', "My parent's brother");
      // 0 item audio played
      cy.get('@audio.play').should('have.callCount', 0);
      // 0 audio ripples played
      cy.get('@animation.play').should('have.callCount', 0);
      // 0 audio ripples created + 0 button buzz
      cy.get('@animation.animate').should('have.callCount', 0);

      cy.log('**2. 马丽 sees 3 words**');
      cy.log('-- of which one is the correct match to the explanation.');
      cy.get('[data-test="option-button-1"]')
        .as('option1')
        .should('be.visible')
        .should('contain', 'Uncle');
      cy.get('[data-test="option-button-2"]')
        .as('option2')
        .should('be.visible')
        .should('contain', 'Cousin');
      cy.get('[data-test="option-button-3"]')
        .as('option3')
        .should('be.visible')
        .should('contain', 'Aunt');
      cy.get('[data-test="option-button-4"]')
        .as('option4')
        .should('be.visible')
        .should('contain', 'Grandma');
      cy.get('[data-test="option-button-5"]').should('not.exist');

      cy.log('**3. 马丽 taps wrong word/non-corresponding word**');
      cy.log('-- sees the word vibrate, flash red');
      cy.log('-- hears the audio for the incorrect word');
      cy.log('-- sees the word become disabled and non-interactive');

      // explanation: My parent's brother
      // option 1: Uncle, option 2: Cousin, option 3: Aunt, option 4: Grandma
      // click incorrect option 2
      cy.get('@option2').click().should('have.class', errorColor);
      // 1 item audio played
      cy.get('@audio.play').should('have.callCount', 1).invoke('resetHistory');
      // 2 audio ripples played
      cy.get('@animation.play')
        .should('have.callCount', 2)
        .invoke('resetHistory');
      // 2 audio ripples created + 1 button buzz
      cy.get('@animation.animate')
        .should('have.callCount', 3)
        .invoke('resetHistory');

      cy.get('@option2').should('have.class', 'button-disabled');
      // there's no itemUnderTest audio to play
      cy.get('@audio.play').should('have.callCount', 0);

      cy.log('**4. 马丽 taps correct word/corresponding word**');
      cy.log('-- sees the word turn green');
      cy.log('-- hears the audio for the correct word');
      cy.log('-- sees the other words become disabled and non-interactive');
      cy.log('-- sees the continue button available');
      cy.get('[data-test="continue-button"').should('not.exist');
      cy.get('@option1').click().should('have.class', successColor);
      cy.get('@option3').should('have.class', 'button-disabled');
      cy.get('@option4').should('have.class', 'button-disabled');
      cy.get('[data-test="continue-button"').should('be.visible');
    },
  );
});

export {};
