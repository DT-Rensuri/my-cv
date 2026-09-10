import { ref } from 'vue';
import { defineStore } from 'pinia';

export type MeetingVersion = {
    id: string;
    title: string;
    content: string;
    createdAt: number;
};

export type MeetingChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

export const useVoiceMeetingStore = defineStore('voice-meeting', () => {
    const originalText = ref<string | null>(null);
    const summary = ref<string | null>(null);
    const versions = ref<MeetingVersion[]>([]);
    const activeVersionId = ref<string | null>(null);
    const chatMessages = ref<MeetingChatMessage[]>([]);

    function setOriginalText(text: string | null) {
        originalText.value = text;
    }

    function setSummary(text: string | null) {
        summary.value = text;
    }

    function addVersion(title: string, content: string): MeetingVersion {
        const version: MeetingVersion = {
            id: crypto.randomUUID(),
            title,
            content,
            createdAt: Date.now(),
        };
        versions.value.push(version);
        activeVersionId.value = version.id;
        return version;
    }

    function setActiveVersion(id: string | null) {
        activeVersionId.value = id;
    }

    function removeVersion(id: string) {
        versions.value = versions.value.filter((v) => v.id !== id);
        if (activeVersionId.value === id) {
            activeVersionId.value =
                versions.value[versions.value.length - 1]?.id ?? null;
        }
    }

    function clearVersions() {
        versions.value = [];
        activeVersionId.value = null;
    }

    return {
        originalText,
        summary,
        versions,
        activeVersionId,
        chatMessages,
        setOriginalText,
        setSummary,
        addVersion,
        setActiveVersion,
        removeVersion,
        clearVersions,
    };
});