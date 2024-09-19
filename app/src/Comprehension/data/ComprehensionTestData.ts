import type { ComprehensionExercise } from '@/Comprehension/ComprehensionTypes';
import AudioProvider from '@/Content/AudioProvider';
import placeholderAudio from '@/test-support/audio/placeholder-audio.mp3.audio?raw';
import pic from '@/test-support/pics/两.jpg';
const audio2b64 = (rawMp3: string) => `data:audio/mpeg;base64,${rawMp3}`;

export default function ComprehensionTestData(): ComprehensionExercise {
  return {
    comprehensionText: [
      // 我家里有六个人，爸爸，妈妈，姐姐，两个哥哥，和我。我的爸爸今年四十四岁，我的妈妈四十八岁，我的姐姐二十六岁，我的大哥二十岁，我的小哥十七岁。我今年十岁。
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '我',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '家里',
        isNew: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '有',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '六',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '个',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '人',
        isNew: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '，',
        isPunctuation: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '爸爸',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '，',
        isPunctuation: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '妈妈',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '，',
        isPunctuation: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '姐姐',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '，',
        isPunctuation: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '两',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '个',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '哥哥',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '，',
        isPunctuation: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '和',
        isNew: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '我',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '。',
        isPunctuation: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '我',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '的',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '爸爸',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '今年',
        isNew: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '四十四',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '岁',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '，',
        isPunctuation: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '我',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '的',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '妈妈',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '四十八',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '岁',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '，',
        isPunctuation: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '我',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '的',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '姐姐',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '二十六',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '岁',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '，',
        isPunctuation: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '我',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '的',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '大哥',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '二十',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '岁',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '，',
        isPunctuation: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '我',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '的',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '小哥',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '十七',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '岁',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '。',
        isPunctuation: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '我',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '今年',
        isNew: true,
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '十',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '岁',
      },
      {
        audio: AudioProvider.createAudioFromData(audio2b64(placeholderAudio)),
        suppressComprehensionAudio: false,
        word: '。',
        isPunctuation: true,
      },
    ],

    questions: [
      {
        // 谁是最小的？ Who is the youngest?
        questionText: '谁是最小的？',
        options: [
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: true,
            disabled: false,
            suppressOptionAudio: true,
            word: '我',
          },
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: false,
            disabled: false,
            suppressOptionAudio: true,
            word: '姐姐',
          },
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: false,
            disabled: false,
            suppressOptionAudio: true,
            word: '大哥',
          },
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: false,
            disabled: false,
            suppressOptionAudio: true,
            word: '小哥',
          },
        ],
      },
      {
        // 谁是最大的？ Who is the oldest?
        questionText: '谁是最大的？',
        options: [
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: false,
            disabled: false,
            suppressOptionAudio: true,
            word: '我',
          },
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: true,
            disabled: false,
            suppressOptionAudio: true,
            word: '姐姐',
          },
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: false,
            disabled: false,
            suppressOptionAudio: true,
            word: '大哥',
          },
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: false,
            disabled: false,
            suppressOptionAudio: true,
            word: '小哥',
          },
        ],
      },
      {
        // “我”有几个姐妹？ How many sisters does she have?
        questionText: '“我”有几个姐妹？',
        options: [
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: true,
            disabled: false,
            suppressOptionAudio: true,
            word: '一',
          },
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: false,
            disabled: false,
            suppressOptionAudio: true,
            word: '二',
          },
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: false,
            disabled: false,
            suppressOptionAudio: true,
            word: '三',
          },
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: false,
            disabled: false,
            suppressOptionAudio: true,
            word: '二十八',
          },
        ],
      },
      {
        // “我”有几个兄弟？ How many brothers does she have?
        questionText: '“我”有几个兄弟？',
        options: [
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: false,
            disabled: false,
            suppressOptionAudio: true,
            word: '一',
          },
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: true,
            disabled: false,
            suppressOptionAudio: true,
            word: '二',
          },
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: false,
            disabled: false,
            suppressOptionAudio: true,
            word: '三',
          },
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: false,
            disabled: false,
            suppressOptionAudio: true,
            word: '二十八',
          },
        ],
      },
      {
        // 爸爸和妈妈谁的年龄大？ Who is older, mom or dad?
        questionText: '爸爸和妈妈谁的年龄大？',
        options: [
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: true,
            disabled: false,
            suppressOptionAudio: true,
            word: '妈妈',
          },
          {
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            buzzing: false,
            correct: false,
            disabled: false,
            suppressOptionAudio: true,
            word: '爸爸',
          },
        ],
      },
    ],

    newWordsExercises: [
      {
        itemUnderTestAudio: AudioProvider.createAudioFromData(
          audio2b64(placeholderAudio),
        ),
        itemUnderTestAudioPlaying: false,
        pictureToMatch: pic,
        options: [
          {
            word: '今年',
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            correct: false,
            disabled: false,
            playing: false,
          },
          {
            word: '和',
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            correct: true,
            disabled: false,
            playing: false,
          },
          {
            word: '家里',
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            correct: false,
            disabled: false,
            playing: false,
          },
          {
            word: '人',
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            correct: false,
            disabled: false,
            playing: false,
          },
        ],
      },
      {
        items: [
          {
            wordOrIcons: 'item-2-二',
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            picture: pic,
            match: 2,
            isWord: false,
            isIcon: false,
            matched: false,
            selected: false,
            buzzing: false,
          },
          {
            wordOrIcons: '术',
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            match: 4,
            isWord: true,
            isIcon: false,
            matched: false,
            selected: false,
            buzzing: false,
          },
          {
            wordOrIcons: '二',
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            match: 0,
            isWord: true,
            isIcon: false,
            matched: false,
            selected: false,
            buzzing: false,
          },
          {
            wordOrIcons: 'item-7-四',
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            picture: pic,
            match: 7,
            isWord: false,
            isIcon: false,
            matched: false,
            selected: false,
            buzzing: false,
          },
          {
            wordOrIcons: 'item-1-术',
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            picture: pic,
            match: 1,
            isWord: false,
            isIcon: false,
            matched: false,
            selected: false,
            buzzing: false,
          },
          {
            wordOrIcons: '三',
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            match: 6,
            isWord: true,
            isIcon: false,
            matched: false,
            selected: false,
            buzzing: false,
          },
          {
            wordOrIcons: 'item-5-三',
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            picture: pic,
            match: 5,
            isWord: false,
            isIcon: false,
            matched: false,
            selected: false,
            buzzing: false,
          },
          {
            wordOrIcons: '四',
            audio: AudioProvider.createAudioFromData(
              audio2b64(placeholderAudio),
            ),
            match: 3,
            isWord: true,
            isIcon: false,
            matched: false,
            selected: false,
            buzzing: false,
          },
        ],
        unsuppressWordAudio: false,
      },
    ],

    stages: [
      // 1. [ReadText] Read the text silently. Then press the arrow and answer some questions about it. Don’t worry about any new words right now. You will learn those later.
      {
        instructionText:
          '请默读这段短文。然后点击屏幕上的箭头，回答问题。遇到不认识的词语可以跳过，后面我们会学习相关的新词。',
        instructionAudio: AudioProvider.createAudioFromData(
          audio2b64(placeholderAudio),
        ),
      },
      // 2. [AnswerQuestions] Audio multiple choice comprehension questions with full text still visible. (Audio instruction)
      {
        questionnaire: true,
      },
      // 3. [FocusNewWords] Read the text again and try to guess the meaning of any new words you see (in pink). Then press the arrow and answer some questions about them.: a matching exercise, matching characters to audio (with full text still visible if possible)?
      {
        instructionText:
          '请再次阅读短文，猜猜短文中一些新词语（粉色字体）的意思。然后点击箭头回答问题。',
      },
      // 4. [PracticeNewWords] Answer some questions about [the new words].
      //      (full text still visible if possible)
      //      - multiple choice exercise
      //      - matching exercise
      {
        instructionText:
          '请回答以下问题。答案不清楚的请重新阅读短文，根据短文猜出答案。',
      },
      // 5. [Review] Read the full text again. This time you can listen to the audio by tapping on any word. Then, try to read the text aloud on your own.
      {
        instructionText:
          '最后，请跟随录音朗读短文，边读边用手指指着每一个字。然后自己再试着朗读短文。',
      },
    ],
  };
}
