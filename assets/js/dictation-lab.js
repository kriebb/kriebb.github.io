document.addEventListener('DOMContentLoaded', function () {
  const root = document.querySelector('[data-dictation-lab]');
  if (!root) return;

  const apiBase = 'http://127.0.0.1:8765';
  const startBtn = root.querySelector('[data-action="record-start"]');
  const stopBtn = root.querySelector('[data-action="record-stop"]');
  const transcribeBtn = root.querySelector('[data-action="transcribe"]');
  const reviewBtn = root.querySelector('[data-action="review"]');
  const recordingStatus = root.querySelector('[data-role="recording-status"]');
  const reviewStatus = root.querySelector('[data-role="review-status"]');
  const player = root.querySelector('[data-role="player"]');
  const transcriptBox = root.querySelector('[data-role="transcript"]');
  const reviewBox = root.querySelector('[data-role="review"]');
  const postPathInput = root.querySelector('[data-role="post-path"]');
  const modelInput = root.querySelector('[data-role="model"]');

  let mediaRecorder = null;
  let recordedChunks = [];
  let recordedBlob = null;

  function setRecordingState(isRecording) {
    startBtn.disabled = isRecording;
    stopBtn.disabled = !isRecording;
  }

  function setStatus(el, text, isError) {
    el.textContent = text;
    el.classList.toggle('dictation-lab__status--error', Boolean(isError));
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.addEventListener('dataavailable', function (event) {
        if (event.data && event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      });

      mediaRecorder.addEventListener('stop', function () {
        recordedBlob = new Blob(recordedChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
        player.src = URL.createObjectURL(recordedBlob);
        player.hidden = false;
        transcribeBtn.disabled = false;
        stream.getTracks().forEach(function (track) { track.stop(); });
        setStatus(recordingStatus, 'Recording ready for transcription.');
      });

      mediaRecorder.start();
      setRecordingState(true);
      setStatus(recordingStatus, 'Recording...');
    } catch (error) {
      setStatus(recordingStatus, 'Could not start recording: ' + error.message, true);
    }
  }

  function stopRecording() {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setRecordingState(false);
  }

  async function transcribeRecording() {
    if (!recordedBlob) {
      setStatus(recordingStatus, 'No recording available.', true);
      return;
    }

    const formData = new FormData();
    formData.append('file', recordedBlob, 'dictation.webm');
    formData.append('model', 'distil-large-v3');

    setStatus(recordingStatus, 'Uploading and transcribing...');

    try {
      const response = await fetch(apiBase + '/transcribe', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Transcription failed with status ' + response.status);
      }

      const payload = await response.json();
      transcriptBox.value = payload.transcript || '';
      setStatus(recordingStatus, 'Transcription complete.');
      setStatus(reviewStatus, 'Transcript ready for review.');
    } catch (error) {
      setStatus(recordingStatus, 'Transcription failed: ' + error.message, true);
    }
  }

  async function reviewTranscript() {
    const transcript = transcriptBox.value.trim();
    const postPath = postPathInput.value.trim();
    const model = modelInput.value.trim();

    if (!transcript) {
      setStatus(reviewStatus, 'No transcript available.', true);
      return;
    }

    if (!postPath) {
      setStatus(reviewStatus, 'No post path configured.', true);
      return;
    }

    setStatus(reviewStatus, 'Running local review...');

    try {
      const response = await fetch(apiBase + '/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcript,
          post_path: postPath,
          model: model
        })
      });

      if (!response.ok) {
        throw new Error('Review failed with status ' + response.status);
      }

      const payload = await response.json();
      reviewBox.value = payload.review || '';
      setStatus(reviewStatus, 'Review complete.');
    } catch (error) {
      setStatus(reviewStatus, 'Review failed: ' + error.message, true);
    }
  }

  startBtn.addEventListener('click', startRecording);
  stopBtn.addEventListener('click', stopRecording);
  transcribeBtn.addEventListener('click', transcribeRecording);
  reviewBtn.addEventListener('click', reviewTranscript);
  setRecordingState(false);
  transcribeBtn.disabled = true;
});
