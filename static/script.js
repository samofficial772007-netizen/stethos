const recordBtn = document.getElementById('recordBtn');
const recordLabel = document.getElementById('recordLabel');
const audioFile = document.getElementById('audioFile');
const analyzeBtn = document.getElementById('analyzeBtn');
const statusText = document.getElementById('statusText');
const ready = document.querySelector('.ready');
const message = document.getElementById('message');
const audioPreview = document.getElementById('audioPreview');
const audioName = document.getElementById('audioName');
const audioMeta = document.getElementById('audioMeta');
const audioPlayer = document.getElementById('audioPlayer');
const clearAudio = document.getElementById('clearAudio');
const results = document.getElementById('results');
let selectedAudio = null;
let mediaRecorder = null;
let recordedChunks = [];
let recordingStream = null;
let startedAt = 0;

// Decorative waveform similar to the reference mock-up.
const wave = document.querySelector('.decorative-wave');
for (let i = 0; i < 115; i++) {
  const bar = document.createElement('span');
  const noise = Math.abs(Math.sin(i * 1.71) * Math.cos(i * .23));
  const height = 5 + Math.pow(noise, 1.6) * 20;
  bar.style.setProperty('--h', `${height}px`);
  wave.appendChild(bar);
}

function setStatus(label, recording = false) {
  statusText.textContent = label;
  ready.classList.toggle('recording', recording);
}
function setMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? '#ff7777' : 'var(--color-accent)';
}
function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
function showAudio(file, url, duration = null) {
  selectedAudio = file;
  audioName.textContent = file.name;
  audioMeta.textContent = `${humanSize(file.size)} · Ready for demo analysis`;
  audioPreview.hidden = false;
  audioPlayer.src = url;
  audioPlayer.hidden = false;
  analyzeBtn.disabled = false;
  results.hidden = true;
  setStatus('AUDIO LOADED');
  setMessage(duration ? `Recording captured (${duration.toFixed(1)} seconds). Ready to analyze.` : 'Audio loaded. Select “Analyze sound” to continue.');
}

recordBtn.addEventListener('click', async () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    recordBtn.disabled = true;
    recordLabel.textContent = 'Finishing recording…';
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
    setMessage('Audio recording is not supported by this browser. Try a current version of Chrome or upload an audio file.', true);
    return;
  }
  try {
    recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(recordingStream);
    mediaRecorder.addEventListener('dataavailable', event => {
      if (event.data.size) recordedChunks.push(event.data);
    });
    mediaRecorder.addEventListener('stop', () => {
      const type = mediaRecorder.mimeType || 'audio/webm';
      const blob = new Blob(recordedChunks, { type });
      const extension = type.includes('ogg') ? 'ogg' : type.includes('mp4') ? 'm4a' : 'webm';
      const file = new File([blob], `machine-recording-${Date.now()}.${extension}`, { type });
      const duration = (Date.now() - startedAt) / 1000;
      const url = URL.createObjectURL(blob);
      showAudio(file, url, duration);
      recordingStream?.getTracks().forEach(track => track.stop());
      recordingStream = null;
      mediaRecorder = null;
      recordBtn.disabled = false;
      recordLabel.textContent = 'Record machine sound';
    });
    mediaRecorder.start();
    startedAt = Date.now();
    recordBtn.classList.add('is-recording');
    recordLabel.textContent = 'Stop recording';
    setStatus('RECORDING', true);
    setMessage('Recording from your microphone. Stop when you have captured 3–8 seconds.');
  } catch (error) {
    setMessage('Microphone access was denied or unavailable. Allow microphone permission, or upload an audio file instead.', true);
  }
});

audioFile.addEventListener('change', () => {
  const file = audioFile.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('audio/') && !/\.(wav|mp3|m4a|ogg|webm|aac|flac)$/i.test(file.name)) {
    setMessage('Please choose an audio file such as WAV, MP3, M4A, OGG, or WebM.', true);
    audioFile.value = '';
    return;
  }
  const url = URL.createObjectURL(file);
  showAudio(file, url);
});

clearAudio.addEventListener('click', () => {
  selectedAudio = null;
  audioFile.value = '';
  audioPlayer.pause();
  audioPlayer.removeAttribute('src');
  audioPlayer.load();
  audioPlayer.hidden = true;
  audioPreview.hidden = true;
  analyzeBtn.disabled = true;
  results.hidden = true;
  setStatus('READY');
  setMessage('Audio removed. Record or upload a new clip.');
});

analyzeBtn.addEventListener('click', async () => {
  if (!selectedAudio) return;
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Analyzing…';
  setStatus('ANALYZING');
  setMessage('Running a local demo check. No audio is sent to a server.');
  // Lightweight client-side demonstration only. It is not a trained diagnostic model.
  await new Promise(resolve => setTimeout(resolve, 800));
  const duration = Number.isFinite(audioPlayer.duration) ? audioPlayer.duration : null;
  document.getElementById('durationValue').textContent = duration ? `${duration.toFixed(1)} sec` : 'Unavailable';
  document.getElementById('sizeValue').textContent = humanSize(selectedAudio.size);
  document.getElementById('healthVerdict').textContent = 'Manual review recommended';
  document.getElementById('healthText').textContent = 'The clip was loaded successfully. This prototype does not classify faults; compare the sound with a known healthy baseline and inspect the machine if it sounds unusual.';
  results.hidden = false;
  setStatus('DEMO COMPLETE');
  setMessage('Demo check complete. This is not a machine-health diagnosis.');
  analyzeBtn.disabled = false;
  analyzeBtn.innerHTML = 'Analyze again <span>↗</span>';
  results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
