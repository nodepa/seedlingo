import yi from '@/assets/audio/characters/yi.mp3';
import san from '@/assets/audio/characters/san.mp3';
import si from '@/assets/audio/characters/si.mp3';
import { MultipleChoiceExercise } from '../MultipleChoiceTypes';

export default function(): MultipleChoiceExercise {
  return {
    itemUnderTestAudio: undefined,
    itemUnderTestAudioIsPlaying: undefined,
    iconToMatch: undefined,
    phraseToMatch: '一加二',
    options: [
      {
        word: '一',
        audio: new Audio(yi),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      },
      {
        word: '四',
        audio: new Audio(si),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      },
      {
        word: '三',
        audio: new Audio(san),
        correct: true,
        disabled: false,
        playing: false,
        buzzing: false,
      },
    ],
  };
}
