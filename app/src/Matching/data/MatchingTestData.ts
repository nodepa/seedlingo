import Content from '@/Content/Content';
import 术 from '@/test-support/audio/characters/术.mp3.audio?raw';
import 二 from '@/test-support/audio/characters/二.mp3.audio?raw';
import 三 from '@/test-support/audio/characters/三.mp3.audio?raw';
import 四 from '@/test-support/audio/characters/四.mp3.audio?raw';
import pic from '@/test-support/pics/两.jpg';
import ExerciseProvider from '@/Content/ExerciseProvider';
import type { MatchingExercise } from '../MatchingTypes';

export default function MatchingTestData(
  dataSet: 'mixed' | 'allPics' = 'mixed',
): MatchingExercise {
  if (dataSet === 'mixed') {
    return {
      items: [
        {
          wordOrIcons: [Content.getIcon('mdiNumeric2Circle')],
          audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${二}`),
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
      ],
    };
  } else if (dataSet === 'allPics') {
    return {
      items: [
        {
          wordOrIcons: [Content.getIcon('mdiNumeric2Circle')],
          audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${二}`),
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
          picture: pic,
          match: 7,
          isWord: false,
          isIcon: false,
          matched: false,
          selected: false,
          buzzing: false,
        },
        {
          wordOrIcons: [Content.getIcon('mdiPalmTree')],
          audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${术}`),
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
          audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${三}`),
          match: 6,
          isWord: true,
          isIcon: false,
          matched: false,
          selected: false,
          buzzing: false,
        },
        {
          wordOrIcons: [Content.getIcon('mdiDice3')],
          audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${三}`),
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
          audio: ExerciseProvider.createAudio(`data:audio/mpeg;base64,${四}`),
          match: 3,
          isWord: true,
          isIcon: false,
          matched: false,
          selected: false,
          buzzing: false,
        },
      ],
      unsuppressWordAudio: true,
    };
  } else {
    return { items: [] };
  }
}
