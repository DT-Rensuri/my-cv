import { useThemeStore } from '@/stores/theme';
import { tool } from '@langchain/core/tools';
import { ThemeColors } from '@/types/theme';
import * as z from 'zod';

const ThemeColorsSchema = z.object({
    backgroundColor: z
        .string()
        .describe('The background color of the application.'),
    backgroundAltColor: z
        .string()
        .describe('The alternative background color of the application.'),
    panelColor: z.string().describe('The color of the application panel.'),
    lineColor: z
        .string()
        .describe('The color of the lines in the application.'),
    lineLightColor: z
        .string()
        .describe('The light color of the lines in the application.'),
    inkColor: z.string().describe('The color of the ink in the application.'),
    inkMutedColor: z
        .string()
        .describe('The muted color of the ink in the application.'),
    inkDimColor: z
        .string()
        .describe('The dim color of the ink in the application.'),

    successColor: z.string().describe('The color for success messages.'),
    accentColor: z.string().describe('The accent color for the application.'),
    highlightColor: z.string().describe('The color for highlighted elements.'),
    warningColor: z.string().describe('The color for warning messages.'),
    orangeColor: z.string().describe('The color for orange elements.'),
    dangerColor: z.string().describe('The color for danger messages.'),
    primaryColor: z.string().describe('The primary color for the application.'),
});

export const customThemeColorTool = tool(
    async (input: z.infer<typeof ThemeColorsSchema>) => {
        try {
            const themeStore = useThemeStore();
            const themeColors: ThemeColors = {
                backgroundColor: input.backgroundColor,
                backgroundAltColor: input.backgroundAltColor,
                panelColor: input.panelColor,
                lineColor: input.lineColor,
                lineLightColor: input.lineLightColor,
                inkColor: input.inkColor,
                inkMutedColor: input.inkMutedColor,
                inkDimColor: input.inkDimColor,
                successColor: input.successColor,
                accentColor: input.accentColor,
                highlightColor: input.highlightColor,
                warningColor: input.warningColor,
                orangeColor: input.orangeColor,
                dangerColor: input.dangerColor,
                primaryColor: input.primaryColor,
            };
            themeStore.setColorTheme(themeColors);

            return {
                success: true,
                message: 'Theme colors updated successfully',
                colors: themeColors,
            };
        } catch (error) {
            console.error('Error updating theme colors:', error);
            return {
                success: false,
                message: 'Failed to update theme colors',
                error: error,
            };
        }
    },
    {
        name: 'customThemeColor',
        description: 'Set custom theme colors for the UI',
        schema: ThemeColorsSchema,
    },
);
