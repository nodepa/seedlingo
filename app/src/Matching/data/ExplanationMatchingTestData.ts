import placeholder from '@/test-support/audio/placeholder-audio.mp3?url';
import 二加二 from '@/test-support/audio/characters/二加二.mp3?url';
import 四 from '@/test-support/audio/characters/四.mp3?url';
import type { MatchingExercise } from '../MatchingTypes';
import AudioProvider from '@/Content/AudioProvider';

export default function ExplanationMatchingTestData(): MatchingExercise {
  return {
    items: [
      {
        wordOrIcons: "My parent's brother",
        audio: AudioProvider.createAudioFromUrl(placeholder),
        match: 2,
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
      {
        wordOrIcons: 'Uncle',
        audio: AudioProvider.createAudioFromUrl(placeholder),
        match: 0,
        isWord: true,
        isIcon: false,
        matched: false,
        selected: false,
        buzzing: false,
      },
      {
        wordOrIcons: '二加二',
        audio: AudioProvider.createAudioFromUrl(二加二),
        match: 1,
        isWord: false,
        isIcon: false,
        matched: false,
        selected: false,
        buzzing: false,
      },
      {
        wordOrIcons: '8*3',
        audio: AudioProvider.createAudioFromUrl(placeholder),
        match: 5,
        isWord: true,
        isIcon: false,
        matched: false,
        selected: false,
        buzzing: false,
      },
      {
        wordOrIcons: '24',
        audio: AudioProvider.createAudioFromUrl(placeholder),
        match: 4,
        isWord: false,
        isIcon: false,
        matched: false,
        selected: false,
        buzzing: false,
      },
    ],
    unsuppressWordAudio: false,
  };
}
