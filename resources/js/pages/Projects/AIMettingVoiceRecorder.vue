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
          <template v-if="!isAiTranscriptionLoading">
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
            <button v-if="audioUrl" @click="aiTranscriptionBtn()"
              class="px-6 py-3 bg-accent text-background pixel-border-sm font-retro text-base hover:opacity-90 active:translate-y-0.5">
              {{ t('projects.aimettingVoiceRecorder.aiTranscriptionBtn') }}
            </button>
            <button v-if="audioUrl" @click="clear"
              class="px-6 py-3 bg-panel text-ink pixel-border-sm font-retro text-base hover:border-danger hover:text-danger active:translate-y-0.5">
              {{ t('projects.aimettingVoiceRecorder.clear') }}
            </button>
          </template>
          <template v-else>
            <div class="flex items-center gap-2">
              <span class="font-pixel text-px-16 text-ink-dim">
                {{ t('projects.aimettingVoiceRecorder.aiTranscriptionLoading') }}
              </span>
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
            <div v-if="isTranscribing" class="flex items-center justify-center gap-2 mb-3">
              <span class="font-pixel text-px-16 text-ink-dim">
                {{ t('projects.aimettingVoiceRecorder.aiTranscriptionLoading') }}
              </span>
              <svg class="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </div>
            <div v-else-if="originalText" class="whitespace-pre-wrap">
              {{ originalText }}
            </div>
            <div v-else class="text-ink-dim">
              {{ t('projects.aimettingVoiceRecorder.aiSummaryText') }}
            </div>
          </div>

          <div v-else>

            <div class="flex items-center justify-end mb-3">
              <div class="flex items-center gap-2">
                <select v-model="selectedVersionId"
                  class="bg-background text-ink px-2 py-1.5 pixel-border-sm font-pixel text-px-12"
                  @change="onVersionSelect">
                  <option :value="null">
                    {{ t('projects.aimettingVoiceRecorder.latest') }}
                  </option>
                  <option v-for="version in versions" :key="version.id" :value="version.id">
                    {{ version.title }} · {{ formatVersionTime(version.createdAt) }}
                  </option>
                </select>
                <button type="button" class="font-pixel text-px-12 px-3 py-2 transition-colors"
                  :class="showVersionPopup ? 'bg-highlight text-background' : 'text-ink-dim hover:text-highlight'"
                  @click="showVersionPopup = !showVersionPopup">
                  {{ t('projects.aimettingVoiceRecorder.manageVersions') }}
                </button>
              </div>
            </div>

            <!-- Version popup -->
            <div v-if="showVersionPopup" class="mb-3 bg-background pixel-border-sm p-4">
              <p class="font-pixel text-px-14 text-highlight mb-2">
                {{ t('projects.aimettingVoiceRecorder.versionHistory') }}
              </p>
              <div v-if="versions.length === 0" class="text-ink-dim text-px-14">
                {{ t('projects.aimettingVoiceRecorder.noVersions') }}
              </div>
              <ul v-else class="space-y-2">
                <li v-for="version in versions" :key="version.id" class="flex items-center justify-between gap-2">
                  <button type="button" class="font-pixel text-px-12 text-left"
                    :class="activeVersionId === version.id ? 'text-highlight' : 'text-ink-dim hover:text-highlight'"
                    @click="selectVersion(version.id)">
                    {{ version.title }} · {{ formatVersionTime(version.createdAt) }}
                  </button>
                  <button type="button" class="font-pixel text-px-12 text-danger hover:text-danger"
                    @click="removeVersion(version.id)">
                    ✕
                  </button>
                </li>
              </ul>
            </div>
            <div v-if="isSummarizing" class="flex items-center justify-center gap-2 mb-3">
              <span class="font-pixel text-px-16 text-ink-dim">
                {{ t('projects.aimettingVoiceRecorder.aiSummaryLoading') }}
              </span>
              <svg class="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </div>
            <div v-else-if="activeVersion" class="whitespace-pre-wrap">
              {{ activeVersion.content }}
            </div>
            <div v-else-if="renderAiSummary" v-html="renderAiSummary" />
            <div v-else class="text-ink-dim">
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
import { ref, watch, computed, onUnmounted, onMounted } from 'vue';
import { Mic, MicVocal, MonitorSpeaker, Sparkles } from 'lucide-vue-next';
import ProjectLayouts from '@/layouts/ProjectLayouts.vue';
import { useI18n } from 'vue-i18n';
import { marked } from 'marked';
import { guestApi } from '@/services/api/guest';
import { STTResponse } from '@/types/openrouter';
import { useVoiceMeetingStore } from '@/stores/voiceMeeting';
import { useChatbotAgentStore } from '@/stores/chatbotAgent';
import { voiceMeetingAgent } from '@/services/langchain';

const { t, tm, locale } = useI18n();

defineOptions({
  layout: ProjectLayouts,
});

const voiceMeetingStore = useVoiceMeetingStore();
const chatbotAgentStore = useChatbotAgentStore();
const versions = voiceMeetingStore.versions;
const activeVersionId = voiceMeetingStore.activeVersionId;

const source = ref<'mic' | 'tab'>('mic');
const isRecording = ref(false);
const isTranscribing = ref(false);
const isSummarizing = ref(false);
const audioUrl = ref<string | null>(null);
const audioBlob = ref<Blob | null>(null);
const elapsed = ref(0);
const isAiTranscriptionLoading = ref(false);
const originalText = ref<string | null>(null);
const aiSummary = ref<string | null>(null);
const activeTab = ref<'summary' | 'original'>('summary');
const selectedVersionId = ref<string | null>(null);
const showVersionPopup = ref(false);

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

const activeVersion = computed(() => {
  if (!voiceMeetingStore.activeVersionId) return null;
  return (
    voiceMeetingStore.versions.find(
      (v) => v.id === voiceMeetingStore.activeVersionId,
    ) ?? null
  );
});

const selectVersion = (id: string | null) => {
  voiceMeetingStore.setActiveVersion(id);
  selectedVersionId.value = id;
};

const onVersionSelect = () => {
  selectVersion(selectedVersionId.value);
};

const removeVersion = (id: string) => {
  voiceMeetingStore.removeVersion(id);
  if (selectedVersionId.value === id) {
    selectedVersionId.value = voiceMeetingStore.activeVersionId;
  }
};

const formatVersionTime = (ts: number): string => {
  const d = new Date(ts);
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
};

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

  voiceMeetingStore.setOriginalText(null);
  voiceMeetingStore.setSummary(null);
  voiceMeetingStore.clearVersions();
  selectedVersionId.value = null;
  showVersionPopup.value = false;
};

const aiTranscriptionBtn = async () => {
  if (!audioBlob.value) return;
  isTranscribing.value = true;
  isAiTranscriptionLoading.value = true;
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
    originalText.value = data.text;
    voiceMeetingStore.setOriginalText(originalText.value);

    aiSummaryHandler();
  } catch (error) {
    originalText.value = t('projects.aimettingVoiceRecorder.error.erTranscription');
  } finally {
    isAiTranscriptionLoading.value = false;
    isTranscribing.value = false;
  }
};

const aiSummaryHandler = async () => {
  if (!originalText.value) return;
  isSummarizing.value = true;
  try {
    const result = await voiceMeetingAgent.invoke(
      {
        messages: [
          {
            role: 'system',
            content: `Summarize data:\n\n${originalText.value}`,
          },
        ],
      },
      { configurable: { thread_id: 'ai-summary' } }
    );

    if (result && result.messages && result.messages.length > 0) {
      const last = result.messages[result.messages.length - 1];
      const content = last?.content;
      const text =
        typeof content === 'string'
          ? content
          : Array.isArray(content)
            ? content
              .map((c) =>
                typeof c === 'string' ? c : (c.text ?? ''),
              )
              .join('')
            : '';
      aiSummary.value = text;
      voiceMeetingStore.setSummary(aiSummary.value);
    }
  } catch (error) {
    aiSummary.value = t('projects.aimettingVoiceRecorder.error.erSummary');
  } finally {
    isSummarizing.value = false;
  }
};

onMounted(() => {
  chatbotAgentStore.selectedAgent = 'voiceMeetingAgent';
  chatbotAgentStore.suggestions = tm('projects.aimettingVoiceRecorder.chatbotSuggestions') as string[];
  chatbotAgentStore.enableSuggestions = true;
});

onUnmounted(() => {
  chatbotAgentStore.selectedAgent = 'default';
  chatbotAgentStore.suggestions = [];
  chatbotAgentStore.enableSuggestions = false;
  stopRecording();
  clear();
});

watch(
  () => locale.value,
  () => {
    chatbotAgentStore.suggestions = tm('projects.aimettingVoiceRecorder.chatbotSuggestions') as string[];
  }
)
</script>