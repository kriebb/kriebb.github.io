---
layout: page
title: "Dictation Lab"
permalink: "/dictation-lab/"
sidebar: false
lang: en
pageid: dictation-lab
ref: dictation-lab
---

This is a private tool page for reading a post out loud, recording feedback, transcribing it locally, and sending the result through a local review model.

<section class="dictation-lab" data-dictation-lab>
  <div class="dictation-lab__panel">
    <h2>Record</h2>
    <p>Record a spoken note in the browser, then send it through the current local transcription bridge.</p>

    <div class="dictation-lab__actions">
      <button type="button" class="btn-submit" data-action="record-start">Start recording</button>
      <button type="button" class="btn-submit" data-action="record-stop" disabled>Stop recording</button>
      <button type="button" class="btn-submit" data-action="transcribe" disabled>Transcribe</button>
    </div>

    <p class="dictation-lab__status" data-role="recording-status">Ready.</p>
    <audio class="dictation-lab__player" data-role="player" controls hidden></audio>
  </div>

  <div class="dictation-lab__panel">
    <h2>Transcript</h2>
    <p>The transcript appears here after the local transcription step finishes.</p>
    <textarea data-role="transcript" rows="14" placeholder="Transcript will appear here..."></textarea>
  </div>

  <div class="dictation-lab__panel">
    <h2>Review Against A Post</h2>
    <p>Pick a post file, then send the transcript to your local review model in LM Studio.</p>

    <label for="dictation-post-path">Post path</label>
    <input
      id="dictation-post-path"
      type="text"
      data-role="post-path"
      value="/home/kristof/git/kriebb.github.io/_posts/2026-03-09-why-i-finally-moved-my-homelab-secrets-out-of-env-files.md" />

    <label for="dictation-model">LM Studio model (optional)</label>
    <input
      id="dictation-model"
      type="text"
      data-role="model"
      value="local/qwen35-35b"
      placeholder="local/qwen35-35b" />

    <div class="dictation-lab__actions">
      <button type="button" class="btn-submit" data-action="review">Review transcript</button>
    </div>

    <p class="dictation-lab__status" data-role="review-status">Waiting for transcript.</p>
    <textarea data-role="review" rows="16" placeholder="Review notes will appear here..."></textarea>
  </div>

  <div class="dictation-lab__panel">
    <h2>Notes</h2>
    <ul>
      <li>This page is private and stays out of <code>public-main</code>.</li>
      <li>The current backend is only a temporary local bridge while the container-first version is still to be built.</li>
    </ul>
  </div>
</section>
