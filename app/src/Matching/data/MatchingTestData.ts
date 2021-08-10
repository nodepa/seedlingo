import {
  mdiDice3,
  mdiNumeric2Circle,
  mdiNumeric4Circle,
  mdiPalmTree,
} from '@mdi/js';
import 术 from '@/test-support/audio/characters/术.mp3';
import 二 from '@/test-support/audio/characters/二.mp3';
import 三 from '@/test-support/audio/characters/三.mp3';
import 四 from '@/test-support/audio/characters/四.mp3';
import ExerciseProvider from '@/Lessons/ExerciseProvider';
import { MatchingItem } from '../MatchingTypes';

export default function MatchingTestData(): Array<MatchingItem> {
  return [
    {
      value: [mdiNumeric2Circle],
      audio: ExerciseProvider.createAudio(二),
      match: 2,
      color: 'primary',
      isWord: false,
      isIcon: true,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      value: '术',
      audio: ExerciseProvider.createAudio(术),
      match: 4,
      color: '',
      isWord: true,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      value: '二',
      audio: ExerciseProvider.createAudio(二),
      match: 0,
      color: '',
      isWord: true,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      value: [mdiNumeric4Circle],
      audio: ExerciseProvider.createAudio(四),
      match: 7,
      color: 'primary',
      isWord: false,
      isIcon: true,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      value: [mdiPalmTree],
      audio: ExerciseProvider.createAudio(术),
      match: 1,
      color: 'primary',
      isWord: false,
      isIcon: true,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      value: [mdiDice3],
      audio: ExerciseProvider.createAudio(三),
      match: 6,
      color: 'primary',
      isWord: false,
      isIcon: true,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      value: '三',
      audio: ExerciseProvider.createAudio(三),
      match: 5,
      color: '',
      isWord: true,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      value: '四',
      audio: ExerciseProvider.createAudio(四),
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
