import 五减二 from '@/test-support/audio/characters/五减二.mp3';
import 二加二 from '@/test-support/audio/characters/二加二.mp3';
import 三 from '@/test-support/audio/characters/三.mp3';
import 四 from '@/test-support/audio/characters/四.mp3';
import ExerciseProvider from '@/Lessons/ExerciseProvider';
import { MatchingItem } from '../MatchingTypes';

export default function MatchingExplanationTestData(): Array<MatchingItem> {
  return [
    {
      wordOrIcons: '五减二',
      audio: ExerciseProvider.createAudio(五减二),
      match: 2,
      color: 'primary',
      isWord: false,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: '四',
      audio: ExerciseProvider.createAudio(四),
      match: 3,
      color: '',
      isWord: true,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: '三',
      audio: ExerciseProvider.createAudio(三),
      match: 0,
      color: '',
      isWord: true,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: '二加二',
      audio: ExerciseProvider.createAudio(二加二),
      match: 1,
      color: 'primary',
      isWord: false,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
  ];
}
