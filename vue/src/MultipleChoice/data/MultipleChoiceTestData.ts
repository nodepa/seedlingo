import yi from '@/assets/audio/characters/yi.mp3';
import er from '@/assets/audio/characters/er.mp3';
import san from '@/assets/audio/characters/san.mp3';
import si from '@/assets/audio/characters/si.mp3';
import { mdiCellphoneWireless } from '@mdi/js';

export default function() {
  return {
    itemUnderTestAudio: new Audio(er),
    itemUnderTestAudioIsPlaying: false,
    itemUnderTestIcon: [mdiCellphoneWireless],
    answers: [
      {
        char: '三',
        audio: new Audio(san),
        correct: false,
        disabled: false,
        playing: false,
        isBuzzing: false,
      },
      {
        char: '二',
        audio: new Audio(er),
        correct: true,
        disabled: false,
        playing: false,
        isBuzzing: false,
      },
      {
        char: '四',
        audio: new Audio(si),
        correct: false,
        disabled: false,
        playing: false,
        isBuzzing: false,
      },
      {
        char: '一',
        audio: new Audio(yi),
        correct: false,
        disabled: false,
        playing: false,
        isBuzzing: false,
      },
    ],
  };
}
