import usePromise from "@/hooks/usePromise";

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

export default function useAudio(audioPath: string) {
  const buffer = usePromise(audioPath, () => fetchAudio(audioPath));
  return () => playSfx(buffer);
}

function playSfx(buffer: AudioBuffer) {
  const sampleSource = new AudioBufferSourceNode(audioContext, {
    buffer,
    playbackRate: 1,
  });
  sampleSource.connect(audioContext.destination);
  sampleSource.start();
}

async function fetchAudio(audioPath: string) {
  const response = await fetch(audioPath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}
