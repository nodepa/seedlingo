import placeholder from '../../test-support/audio/placeholder-audio.mp3.audio?raw';
import 二加二 from '../../test-support/audio/characters/二加二.mp3.audio?raw';
import 四 from '../../test-support/audio/characters/四.mp3.audio?raw';
import ExerciseProvider from '../../Lessons/ExerciseProvider';
import { MatchingItem } from '../MatchingTypes';

export default function ExplanationMatchingTestData(): Array<MatchingItem> {
  return [
    {
      wordOrIcons: "My parent's brother",
      audio: ExerciseProvider.createAudio(
        `data:audio/mpeg;base64,${placeholder}`,
      ),
      match: 2,
      isWord: false,
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
    {
      wordOrIcons: 'Uncle',
      audio: ExerciseProvider.createAudio(
        `data:audio/mpeg;base64,${placeholder}`,
      ),
      match: 0,
      isWord: true,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: '二加二',
      audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${二加二}`),
      match: 1,
      isWord: false,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: '8*3',
      audio: ExerciseProvider.createAudio(
        `data:audio/mpeg;base64,${placeholder}`,
      ),
      match: 5,
      isWord: true,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      wordOrIcons: '24',
      audio: ExerciseProvider.createAudio(
        `data:audio/mpeg;base64,${placeholder}`,
      ),
      match: 4,
      isWord: false,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
  ];
}
