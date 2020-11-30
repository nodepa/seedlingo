import placeholderAudio from '@/assets/audio/placeholder-audio.mp3';
import er from '@/assets/audio/characters/er.mp3';
import san from '@/assets/audio/characters/san.mp3';
import si from '@/assets/audio/characters/si.mp3';
import {
  mdiDice3,
  mdiNumeric2Circle,
  mdiNumeric4Circle,
  mdiPalmTree,
} from '@mdi/js';
import ExerciseProvider from '@/Lessons/ExerciseProvider';
import { MatchingItem } from '../MatchingTypes';

export default function(): Array<MatchingItem> {
  return [
    {
      value: [mdiNumeric2Circle],
      audio: ExerciseProvider.createAudio(er),
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
      audio: ExerciseProvider.createAudio(placeholderAudio),
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
      audio: ExerciseProvider.createAudio(er),
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
      audio: ExerciseProvider.createAudio(si),
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
      audio: ExerciseProvider.createAudio(placeholderAudio),
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
      audio: ExerciseProvider.createAudio(san),
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
      audio: ExerciseProvider.createAudio(san),
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
      audio: ExerciseProvider.createAudio(si),
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
