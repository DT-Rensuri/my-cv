<template>
  <section class="relative min-h-screen bg-background px-4 py-10 sm:px-6 pt-28 sm:pt-36">
    <div class="mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-8 flex items-center gap-3">
        <div class="grid place-items-center h-14 w-14 bg-primary text-background pixel-border-sm">
          <Mic class="h-7 w-7" />
        </div>
        <div>
          <p class="font-pixel text-px-16 text-accent">{{ t('projects.aimettingVoiceRecorder.badge') }}</p>
          <h1 class="font-retro text-2xl sm:text-3xl text-ink mt-1">{{ t('projects.aimettingVoiceRecorder.title') }}
          </h1>
        </div>
        <span class="ml-auto font-pixel text-px-16 text-ink-dim hidden sm:block">{{
          t('projects.aimettingVoiceRecorder.rec') }}</span>
      </div>

      <!-- Main recorder panel -->
      <div class="bg-panel pixel-border p-6 sm:p-8 crt-glow">
        <!-- Source selection -->
        <div class="mb-6">
          <p class="font-pixel text-px-16 text-ink-dim mb-3">{{ t('projects.aimettingVoiceRecorder.source') }}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button @click="source = 'mic'" :class="[
              'px-4 py-4 pixel-border-sm flex items-center gap-3 transition-colors text-left',
              source === 'mic'
                ? 'bg-accent text-background'
                : 'bg-background text-ink hover:border-success',
            ]">
              <MicVocal class="h-6 w-6 shrink-0" />
              <span class="font-retro text-base leading-snug">{{ t('projects.aimettingVoiceRecorder.mic') }}<br />
                <span :class="source === 'mic' ? 'text-background' : 'text-ink-dim'" class="font-pixel text-px-14">{{
                  t('projects.aimettingVoiceRecorder.micDesc') }}</span>
              </span>
            </button>
            <button @click="source = 'tab'" :class="[
              'px-4 py-4 pixel-border-sm flex items-center gap-3 transition-colors text-left',
              source === 'tab'
                ? 'bg-accent text-background'
                : 'bg-background text-ink hover:border-success',
            ]">
              <MonitorSpeaker class="h-6 w-6 shrink-0" />
              <span class="font-retro text-base leading-snug">{{ t('projects.aimettingVoiceRecorder.tab') }}<br />
                <span :class="source === 'tab' ? 'text-background' : 'text-ink-dim'" class="font-pixel text-px-14">{{
                  t('projects.aimettingVoiceRecorder.tabDesc') }}</span>
              </span>
            </button>
          </div>
        </div>

        <!-- Timer & state -->
        <div class="mb-6 flex flex-col items-center justify-center gap-2 py-4">
          <div class="h-20 w-20 grid place-items-center rounded-full pixel-border-sm"
            :class="isRecording ? 'bg-danger text-background' : 'bg-background text-ink'">
            <Mic v-if="!isRecording" class="h-9 w-9" />
            <span v-else class="font-pixel text-px-14 blink">REC</span>
          </div>
          <p class="font-pixel text-px-20 text-ink mt-2 tabular-nums">{{ formattedTime }}</p>
          <p class="font-pixel text-px-14" :class="isRecording ? 'text-danger blink' : 'text-ink-dim'">
            {{ isRecording ? t('projects.aimettingVoiceRecorder.recording') : t('projects.aimettingVoiceRecorder.ready')
            }}
          </p>
        </div>

        <!-- Controls -->
        <div class="flex flex-wrap items-center justify-center gap-3">
          <template v-if="!isAiSummaryLoading">
            <button v-if="!isRecording" @click="startRecording"
              class="px-6 py-3 bg-success text-background pixel-border-sm font-retro text-base hover:opacity-90 active:translate-y-0.5">
              {{ t('projects.aimettingVoiceRecorder.start') }}
            </button>
            <button v-else @click="stopRecording"
              class="px-6 py-3 bg-danger text-background pixel-border-sm font-retro text-base hover:opacity-90 active:translate-y-0.5">
              {{ t('projects.aimettingVoiceRecorder.stop') }}
            </button>
            <button v-if="audioUrl" @click="download()"
              class="px-6 py-3 bg-accent text-background pixel-border-sm font-retro text-base hover:opacity-90 active:translate-y-0.5">
              {{ t('projects.aimettingVoiceRecorder.download') }}
            </button>
            <button v-if="audioUrl" @click="aiSummaryBtn"
              class="px-6 py-3 bg-accent text-background pixel-border-sm font-retro text-base hover:opacity-90 active:translate-y-0.5">
              {{ t('projects.aimettingVoiceRecorder.aiSummaryBtn') }}
            </button>
            <button v-if="audioUrl" @click="clear"
              class="px-6 py-3 bg-panel text-ink pixel-border-sm font-retro text-base hover:border-danger hover:text-danger active:translate-y-0.5">
              {{ t('projects.aimettingVoiceRecorder.clear') }}
            </button>
          </template>
          <template v-else>
            <div class="flex items-center gap-2">
              <span class="font-pixel text-px-16 text-ink-dim">{{ t('projects.aimettingVoiceRecorder.aiSummaryLoading')
              }}</span>
              <svg class="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </div>
          </template>
        </div>

        <!-- Audio playback -->
        <div v-if="audioUrl" class="mt-8 border-t-4 border-line pt-6">
          <p class="font-pixel text-px-16 text-ink-dim mb-3">{{ t('projects.aimettingVoiceRecorder.playback') }}</p>
          <audio :src="audioUrl" controls class="w-full"></audio>
          <p class="font-pixel text-px-14 text-ink-dim mt-2">{{ t('projects.aimettingVoiceRecorder.size') }} {{
            formatSize(audioBlob) }}</p>
        </div>
      </div>


      <div class="mt-6 bg-panel pixel-border p-6 sm:p-8 crt-glow">
        <!-- Header -->
        <div class="flex justify-between mb-4 pb-4 border-b-4 border-line">
          <div class="flex items-center gap-3">
            <div class="grid place-items-center h-12 w-12 bg-highlight text-background pixel-border-sm">
              <Sparkles class="h-6 w-6" />
            </div>

            <div>
              <p class="font-pixel text-px-18 text-highlight">
                {{ t('projects.aimettingVoiceRecorder.aiSummary') }}
              </p>

              <p class="font-pixel text-px-14 text-ink-dim mt-1">
                {{ t('projects.aimettingVoiceRecorder.aiSummaryDesc') }}
              </p>
            </div>
          </div>

          <div>
            <button type="button" class="font-pixel text-px-14 px-5 py-3 transition-colors" :class="activeTab === 'original'
              ? 'bg-highlight text-background'
              : 'text-ink-dim hover:text-highlight'
              " @click="activeTab = 'original'">
              {{ t('projects.aimettingVoiceRecorder.original') }}
            </button>

            <button type="button" class="font-pixel text-px-14 px-5 py-3 transition-colors" :class="activeTab === 'summary'
              ? 'bg-highlight text-background'
              : 'text-ink-dim hover:text-highlight'
              " @click="activeTab = 'summary'">
              {{ t('projects.aimettingVoiceRecorder.summary') }}
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="font-retro text-base text-ink leading-relaxed text-ink-dim">
          <div v-if="activeTab === 'original'">
            <div v-if="originalText" class="whitespace-pre-wrap">
              {{ originalText }}
            </div>

            <div v-else class="text-ink-dim">
              {{ t('projects.aimettingVoiceRecorder.aiSummaryText') }}
            </div>
          </div>

          <div v-else>
            <div v-if="renderAiSummary" v-html="renderAiSummary" />

            <div v-else>
              {{ t('projects.aimettingVoiceRecorder.aiSummaryText') }}
            </div>
          </div>
        </div>
      </div>

      <p class="mt-8 text-center font-pixel text-px-14 text-ink-dim">
        {{ t('projects.aimettingVoiceRecorder.footer') }}
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed, onUnmounted } from 'vue';
import { Mic, MicVocal, MonitorSpeaker, Sparkles } from 'lucide-vue-next';
import ProjectLayouts from '@/layouts/ProjectLayouts.vue';
import { useI18n } from 'vue-i18n';
import { marked } from 'marked';
import { guestApi } from '@/services/api/guest';
import { STTResponse } from '@/types/openrouter';

const { t } = useI18n();

defineOptions({
  layout: ProjectLayouts,
});

const source = ref<'mic' | 'tab'>('mic');
const isRecording = ref(false);
const audioUrl = ref<string | null>(null);
const audioBlob = ref<Blob | null>(null);
const elapsed = ref(0);
const isAiSummaryLoading = ref(false);
const originalText = ref<string | null>(null);
const aiSummary = ref<string | null>(null);
const activeTab = ref<'summary' | 'original'>('summary');

let recorder: MediaRecorder | null = null;
let stream: MediaStream | null = null;
let chunks: Blob[] = [];
let timer: ReturnType<typeof setInterval> | null = null;

const formattedTime = computed(() => {
  const m = Math.floor(elapsed.value / 60).toString().padStart(2, '0');
  const s = (elapsed.value % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
});

const renderAiSummary = computed(() => {
  if (!aiSummary.value) return null;
  return marked.parse(aiSummary.value);
});

const startTimer = () => {
  elapsed.value = 0;
  timer = setInterval(() => {
    elapsed.value += 1;
  }, 1000);
};

const stopTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const setupRecorder = (mediaStream: MediaStream) => {
  chunks = [];

  recorder = new MediaRecorder(mediaStream, {
    mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm',
  });

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: recorder?.mimeType || 'audio/webm' });
    audioBlob.value = blob;

    if (audioUrl.value) {
      URL.revokeObjectURL(audioUrl.value);
    }
    audioUrl.value = URL.createObjectURL(blob);
  };

  recorder.start();
  isRecording.value = true;
  startTimer();
};

/**
 * Record audio from microphone.
 */
const startMicRecording = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setupRecorder(stream);
  } catch (error) {
    console.error('Cannot access microphone:', error);
  }
};

/**
 * Record audio from a tab / screen share (system audio).
 */
const startTabRecording = async () => {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    const audioTracks = stream.getAudioTracks();
    if (!audioTracks.length) {
      throw new Error('Không nhận được audio. Hãy bật "Share tab audio".');
    }

    // Không cần video
    stream.getVideoTracks().forEach((track) => track.stop());

    const audioStream = new MediaStream(audioTracks);

    // User bấm "Stop sharing" => tự dừng ghi
    audioTracks.forEach((track) => {
      track.onended = () => stopRecording();
    });

    setupRecorder(audioStream);
  } catch (error) {
    console.error('Cannot start tab recording:', error);
  }
};

const startRecording = () => {
  if (source.value === 'mic') {
    startMicRecording();
  } else {
    startTabRecording();
  }
};

const stopRecording = () => {
  if (recorder && recorder.state !== 'inactive') {
    recorder.stop();
  }

  stream?.getTracks().forEach((track) => track.stop());
  stream = null;
  recorder = null;

  stopTimer();
  isRecording.value = false;
};

const formatSize = (blob: Blob | null): string => {
  if (!blob) return '0 KB';
  const kb = blob.size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const download = (filename = 'recording.webm') => {
  if (!audioUrl.value) return;

  const a = document.createElement('a');
  a.href = audioUrl.value;
  a.download = filename;
  a.click();
};

const clear = () => {
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value);
  }
  audioUrl.value = null;
  audioBlob.value = null;
  aiSummary.value = null;
  originalText.value = null;
  chunks = [];
  elapsed.value = 0;
};

const aiSummaryBtn = async () => {
  if (!audioBlob.value) return;
  isAiSummaryLoading.value = true;
  const formData = new FormData();
  formData.append('audio_data', audioBlob.value, 'recording.webm');
  formData.append('audio_format', 'webm');

  try {
    const response = await guestApi.post<STTResponse>('openrouter/audio/transcriptions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = response.data;
    aiSummary.value = data.summary_text || 'No summary available.';
    originalText.value = data.original_text || 'No original text available.';
  } catch (error) {
    aiSummary.value = 'Error fetching summary.';
    originalText.value = 'Error fetching original text.';
  } finally {
    isAiSummaryLoading.value = false;
  }
};

onUnmounted(() => {
  stopRecording();
  clear();
});
</script>