import {
  mdiDice3,
  mdiNumeric2Circle,
  mdiNumeric4Circle,
  mdiPalmTree,
} from '@mdi/js';
import 术 from '@/test-support/audio/characters/术.mp3.audio';
import 二 from '@/test-support/audio/characters/二.mp3.audio';
import 三 from '@/test-support/audio/characters/三.mp3.audio';
import 四 from '@/test-support/audio/characters/四.mp3.audio';
import ExerciseProvider from '@/Lessons/ExerciseProvider';
import { MatchingItem } from '../MatchingTypes';

export default function MatchingTestData(): Array<MatchingItem> {
  return [
    {
      wordOrIcons: [mdiNumeric2Circle],
      audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${二}`),
      match: 2,
      color: 'primary',
      isWord: false,
      isIcon: true,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: '术',
      audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${术}`),
      match: 4,
      color: '',
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
      color: '',
      isWord: true,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: [mdiNumeric4Circle],
      audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${四}`),
      match: 7,
      color: 'primary',
      isWord: false,
      isIcon: true,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: [mdiPalmTree],
      audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${术}`),
      match: 1,
      color: 'primary',
      isWord: false,
      isIcon: true,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: [mdiDice3],
      audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${三}`),
      match: 6,
      color: 'primary',
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
      color: '',
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
      color: '',
      isWord: true,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
  ];
}
