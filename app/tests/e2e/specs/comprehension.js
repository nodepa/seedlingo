const app = '[data-test="app"]';
const loader = '[data-test="loader"]';
const instructionsExplainerComponent =
  '[data-test="instructions-explainer-component"]';

/*
Text (highlight new words?):
我家里有六个人，爸爸，妈妈，姐姐，两个哥哥，和我。我的爸爸今年四十四岁，我的妈妈四十八岁，我的姐姐二十六岁，我的大哥二十岁，我的小哥十七岁。我今年十岁。
Instruction:
Read the text silently. Then click the arrow and answer some questions about it. Don’t worry about any new words right now. You will learn those later.
请默读这段短文。然后点击屏幕上的箭头，回答问题。遇到不认识的词语可以跳过，后面我们会学习相关的新词。

Audio multiple choice comprehension questions with full text still visible:
谁是最小的？ Who is the youngest? (我|巴巴,妈妈,姐姐,大哥,二哥,我)
谁是最大的？ Who is the oldest? (妈妈|巴巴,妈妈,姐姐,大哥,二哥,我)
“我”有几个姐妹？ How many sisters does she have? (1|1-10)
“我”有几个兄弟？ How many brothers does she have? (2|1-10)
爸爸和妈妈谁的年龄大？ Who is older, mom or dad? (妈妈|巴巴,妈妈)

Audio instruction:
Read the text again and try to guess the meaning of any new words you see (in pink). Then click the arrow and answer some questions about them.
请再次阅读短文，猜猜短文中一些新词语（粉色字体）的意思。然后点击箭头回答问题。
Matching exercise:
Matching characters to audio (with full text still visible if possible)?

Read the full text again. This time you can listen to the audio by tapping on any word. Then, try to read the text aloud on your own.
最后，请跟随录音朗读短文，边读边用手指指着每一个字。然后自己再试着朗读短文。
*/
describe('马丽 interacts with the "text comprehension" system', () => {
  beforeEach(() => {
    // Avoid dealing with "instructions explainer" side effects.
    localStorage.setItem('InstructionsExplainerShownCount', 5);
  });

  it(
    'Displays the text comprehension screen with ' +
      'a text and an instruction to sentence with a blank for a missing word and 4 "word" cards',
    () => {
      // *****
      // * 1 *
      // *****
      cy.log('**1. 马丽 sees a sentence with a blank for a missing word**,');
      cy.log('-- sees a list of words from the same unit,');
      cy.log('&nbsp;&nbsp; of which 1 word is the missing word, and');
      cy.log('-- sees 3 words that are unsuitable substitutes.');
      cy.visit('/unit/single-cloze-test', {
        onBeforeLoad(window) {
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
      // Expected test-data:
      // 0: option1 术
      // 1: option2 两 (correct option)
      // 2: option3 二
      // 3: option4 五减二
      cy.get('[data-test="option-button-1"]')
        .as('option1')
        .should('be.visible')
        .contains('术');
    },
  );
});
