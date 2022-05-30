import Content from '@/Lessons/Content';
import 术 from '@/test-support/audio/characters/术.mp3.audio';
import 二 from '@/test-support/audio/characters/二.mp3.audio';
import 三 from '@/test-support/audio/characters/三.mp3.audio';
import 四 from '@/test-support/audio/characters/四.mp3.audio';
import pic from '@/test-support/pics/test-number2.png';
import ExerciseProvider from '@/Lessons/ExerciseProvider';
import { MatchingItem } from '../MatchingTypes';

export default function MatchingTestData(): Array<MatchingItem> {
  return [
    {
      wordOrIcons: [Content.getIcon('mdiNumeric2Circle')],
      audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${二}`),
      picture: pic,
      match: 2,
      isWord: false,
      isIcon: false, //true,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: '术',
      audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${术}`),
      match: 4,
      isWord: true,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: '二',
      audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${二}`),
      match: 0,
      isWord: true,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: [Content.getIcon('mdiNumeric4Circle')],
      audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${四}`),
      match: 7,
      isWord: false,
      isIcon: true,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: [Content.getIcon('mdiPalmTree')],
      audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${术}`),
      match: 1,
      isWord: false,
      isIcon: true,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: [Content.getIcon('mdiDice3')],
      audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${三}`),
      match: 6,
      isWord: false,
      isIcon: true,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: '三',
      audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${三}`),
      match: 5,
      isWord: true,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: '四',
      audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${四}`),
      match: 3,
      isWord: true,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
  ];
}
