import 术 from '@/test-support/audio/characters/术.mp3?url';
import 二 from '@/test-support/audio/characters/二.mp3?url';
import 三 from '@/test-support/audio/characters/三.mp3?url';
import 四 from '@/test-support/audio/characters/四.mp3?url';
import pic from '@/test-support/pics/两.jpg';
import type { MatchingExercise } from '../MatchingTypes';
import {
  mdiDice3,
  mdiNumeric2Circle,
  mdiNumeric4Circle,
  mdiPalmTree,
} from '@mdi/js';
import AudioProvider from '@/Content/AudioProvider';
const icon2Svg = (drawPath: string) =>
  `data:image/svg+xml,<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="${drawPath}"/></svg>`;

export default function MatchingTestData(
  dataSet: 'mixed' | 'allPics' = 'mixed',
): MatchingExercise {
  if (dataSet === 'mixed') {
    return {
      items: [
        {
          wordOrIcons: [icon2Svg(mdiNumeric2Circle)],
          audio: AudioProvider.createAudioFromUrl(二),
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
          audio: AudioProvider.createAudioFromUrl(术),
          match: 4,
          isWord: true,
          isIcon: false,
          matched: false,
          selected: false,
          buzzing: false,
        },
        {
          wordOrIcons: '二',
          audio: AudioProvider.createAudioFromUrl(二),
          match: 0,
          isWord: true,
          isIcon: false,
          matched: false,
          selected: false,
          buzzing: false,
        },
        {
          wordOrIcons: [icon2Svg(mdiNumeric4Circle)],
          audio: AudioProvider.createAudioFromUrl(四),
          match: 7,
          isWord: false,
          isIcon: true,
          matched: false,
          selected: false,
          buzzing: false,
        },
        {
          wordOrIcons: [icon2Svg(mdiPalmTree)],
          audio: AudioProvider.createAudioFromUrl(术),
          match: 1,
          isWord: false,
          isIcon: true,
          matched: false,
          selected: false,
          buzzing: false,
        },
        {
          wordOrIcons: [icon2Svg(mdiDice3)],
          audio: AudioProvider.createAudioFromUrl(三),
          match: 6,
          isWord: false,
          isIcon: true,
          matched: false,
          selected: false,
          buzzing: false,
        },
        {
          wordOrIcons: '三',
          audio: AudioProvider.createAudioFromUrl(三),
          match: 5,
          isWord: true,
          isIcon: false,
          matched: false,
          selected: false,
          buzzing: false,
        },
        {
          wordOrIcons: '四',
          audio: AudioProvider.createAudioFromUrl(四),
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
          wordOrIcons: [icon2Svg(mdiNumeric2Circle)],
          audio: AudioProvider.createAudioFromUrl(二),
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
          audio: AudioProvider.createAudioFromUrl(术),
          match: 4,
          isWord: true,
          isIcon: false,
          matched: false,
          selected: false,
          buzzing: false,
        },
        {
          wordOrIcons: '二',
          audio: AudioProvider.createAudioFromUrl(二),
          match: 0,
          isWord: true,
          isIcon: false,
          matched: false,
          selected: false,
          buzzing: false,
        },
        {
          wordOrIcons: [icon2Svg(mdiNumeric4Circle)],
          audio: AudioProvider.createAudioFromUrl(四),
          picture: pic,
          match: 7,
          isWord: false,
          isIcon: false,
          matched: false,
          selected: false,
          buzzing: false,
        },
        {
          wordOrIcons: [icon2Svg(mdiPalmTree)],
          audio: AudioProvider.createAudioFromUrl(术),
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
          audio: AudioProvider.createAudioFromUrl(三),
          match: 6,
          isWord: true,
          isIcon: false,
          matched: false,
          selected: false,
          buzzing: false,
        },
        {
          wordOrIcons: [icon2Svg(mdiDice3)],
          audio: AudioProvider.createAudioFromUrl(三),
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
          audio: AudioProvider.createAudioFromUrl(四),
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
