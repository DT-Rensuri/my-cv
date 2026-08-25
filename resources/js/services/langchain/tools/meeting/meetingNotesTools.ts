import { tool } from '@langchain/core/tools';
import * as z from 'zod';
import { useVoiceMeetingStore } from '@/stores/voiceMeeting';

/**
 * Reads the current meeting notes (the active version, or the latest summary).
 * Lets the agent see the notes before answering or editing them.
 */
export const readMeetingNotesTool = tool(
    async () => {
        const store = useVoiceMeetingStore();

        const active = store.versions.find(
            (v) => v.id === store.activeVersionId,
        );
        const content = active?.content ?? store.summary ?? '';

        return {
            success: true,
            notes: content,
            versionCount: store.versions.length,
            activeVersionId: store.activeVersionId,
        };
    },
    {
        name: 'read_meeting_notes',
        description:
            'Reads the current meeting notes. Returns the active version content (or the latest AI summary if no version exists yet), plus the number of saved versions. Use this before answering questions about the meeting or before editing the notes.',
        schema: z.object({}),
    },
);

/**
 * Updates the meeting notes by creating a new version. Each call produces a
 * new version so the user can compare and switch between revisions.
 */
export const updateMeetingNotesTool = tool(
    async (input: { content: string }) => {
        const store = useVoiceMeetingStore();
        const { content } = input;

        if (!content || !content.trim()) {
            return {
                success: false,
                message: 'No content provided to save as a new version.',
            };
        }

        const version = store.addVersion(
            `v${store.versions.length + 1}`,
            content.trim(),
        );

        return {
            success: true,
            message: 'Meeting notes updated. A new version was created.',
            versionId: version.id,
            versionTitle: version.title,
            versionCount: store.versions.length,
        };
    },
    {
        name: 'update_meeting_notes',
        description:
            'Saves the meeting notes as a new version. Call this whenever the user asks to edit, revise, or update the meeting notes. Each call creates a new version so the user can compare and restore older revisions.',
        schema: z.object({
            content: z
                .string()
                .describe(
                    'The full revised meeting notes content to save as a new version.',
                ),
        }),
    },
);