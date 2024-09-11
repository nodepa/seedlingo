import placeholder from '@/test-support/audio/placeholder-audio.mp3.audio?raw';
import 二加二 from '@/test-support/audio/characters/二加二.mp3.audio?raw';
import 四 from '@/test-support/audio/characters/四.mp3.audio?raw';
import type { MatchingExercise } from '../MatchingTypes';
import AudioProvider from '@/Content/AudioProvider';
const audio2b64 = (rawMp3: string) => `data:audio/mpeg;base64,${rawMp3}`;

export default function ExplanationMatchingTestData(): MatchingExercise {
  return {
    items: [
      {
        wordOrIcons: "My parent's brother",
        audio: AudioProvider.createAudioFromData(audio2b64(placeholder)),
        match: 2,
        isWord: false,
        isIcon: false,
        matched: false,
        selected: false,
        buzzing: false,
      },
      {
        wordOrIcons: '四',
        audio: AudioProvider.createAudioFromData(audio2b64(四)),
        match: 3,
        isWord: true,
        isIcon: false,
        matched: false,
        selected: false,
        buzzing: false,
      },
      {
        wordOrIcons: 'Uncle',
        audio: AudioProvider.createAudioFromData(audio2b64(placeholder)),
        match: 0,
        isWord: true,
        isIcon: false,
        matched: false,
        selected: false,
        buzzing: false,
      },
      {
        wordOrIcons: '二加二',
        audio: AudioProvider.createAudioFromData(audio2b64(二加二)),
        match: 1,
        isWord: false,
        isIcon: false,
        matched: false,
        selected: false,
        buzzing: false,
      },
      {
        wordOrIcons: '8*3',
        audio: AudioProvider.createAudioFromData(audio2b64(placeholder)),
        match: 5,
        isWord: true,
        isIcon: false,
        matched: false,
        selected: false,
        buzzing: false,
      },
      {
        wordOrIcons: '24',
        audio: AudioProvider.createAudioFromData(audio2b64(placeholder)),
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
