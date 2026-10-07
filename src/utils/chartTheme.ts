import { useTheme } from '@mui/joy/styles';

/**
 * Shared Recharts theming.
 *
 * Recharts ships no dark mode: axis labels default to #666 and the grid to #ccc,
 * which on the dark surface is ~3:1 for the text (fails WCAG for body copy) and
 * a bright grid on a dark page. Tooltips are hardcoded white with a #e0e0e0
 * border, so they stayed light inside a dark chart.
 *
 * Both charts read these values from the Joy theme instead of hardcoding hex, so
 * they follow the same toggle as everything else. The accent uses the brand
 * primary rather than the old purple/blue literals, which also keeps the two
 * charts from looking like two different products.
 */
export const useChartTheme = () => {
  const theme = useTheme();

  const isDark = theme.colorSchemes?.dark != null;
  // theme.vars is a large CSS-variable map that the typings do not narrow to a
  // palette shape, so it is read through a local type.
  const vars = (theme.vars?.palette ?? {}) as Record<string, any>;
  const primary = vars.primary?.plainColor ?? vars.primary?.mainChannel ?? '#FFA500';

  const tick = vars.text?.secondary ?? '#666';
  const grid = vars.divider ?? (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.12)');
  const tooltipBg = vars.background?.level3 ?? (isDark ? '#2A313A' : '#fff');
  const tooltipBorder = vars.divider ?? (isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)');
  const tooltipText = vars.text?.primary ?? '#000';

  const axisProps = {
    stroke: tick,
    tick: { fill: tick, fontSize: 12 },
    tickLine: false,
  };

  const gridProps = {
    stroke: grid,
    strokeDasharray: '3 3',
  };

  const tooltipProps = {
    contentStyle: {
      backgroundColor: tooltipBg,
      border: `1px solid ${tooltipBorder}`,
      borderRadius: 8,
      color: tooltipText,
      fontSize: 12,
    },
    labelStyle: { color: tooltipText, marginBottom: 4 },
    itemStyle: { color: tooltipText },
  };

  return { accent: primary, axisProps, gridProps, tooltipProps };
};