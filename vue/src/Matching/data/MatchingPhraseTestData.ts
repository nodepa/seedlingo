import placeholderAudio from '@/assets/audio/placeholder-audio.mp3';
import san from '@/assets/audio/characters/san.mp3';
import si from '@/assets/audio/characters/si.mp3';
import ExerciseProvider from '@/Lessons/ExerciseProvider';

export default function() {
  return [
    {
      value: '五件二',
      audio: ExerciseProvider.createAudio(placeholderAudio),
      match: 2,
      color: 'primary',
      isWord: false,
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
    {
      value: '三',
      audio: ExerciseProvider.createAudio(san),
      match: 0,
      color: '',
      isWord: true,
      isIcon: false,
      matched: false,
      selected: false,
      buzzing: false,
    },
    {
      value: '二加二',
      audio: ExerciseProvider.createAudio(placeholderAudio),
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
