import React from 'react';
import { useWindowDimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';

import type { Mood } from '../../../models/interfaces/users.model';
import type { DayData } from '../../../hooks/useInsightsGraph';

export const MOOD_COLORS: Record<Mood, string> = {
  happy: '#f59e0b',
  grateful: '#22c55e',
  excited: '#f97316',
  neutral: '#94a3b8',
  reflective: '#a855f7',
  anxious: '#ef4444',
  sad: '#3b82f6',
};

const CHART_H = 180;
const PAD = { top: 16, right: 8, bottom: 30, left: 26 };
const BAR_GAP = 2;
const BAR_RADIUS = 2;

interface Props {
  dayData: DayData[];
  isDark: boolean;
}

export default function MoodBarChart({ dayData, isDark }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = screenWidth - 32;
  const innerW = chartWidth - PAD.left - PAD.right;
  const innerH = CHART_H - PAD.top - PAD.bottom;

  const n = dayData.length;
  const barW = Math.max((innerW - (n - 1) * BAR_GAP) / n, 3);

  const maxCount = Math.max(...dayData.map(d => d.count), 1);
  const yScale = innerH / maxCount;

  const axisColor = isDark ? '#1e293b' : '#e2e8f0';
  const labelColor = isDark ? '#334155' : '#cbd5e1';
  const emptyBarColor = isDark ? '#1e293b' : '#f1f5f9';

  const yTicks = Array.from({ length: maxCount + 1 }, (_, i) => i);

  return (
    <Svg width={chartWidth} height={CHART_H}>
      {yTicks.map(tick => {
        const y = PAD.top + innerH - tick * yScale;
        return (
          <G key={`grid-${tick}`}>
            <Line
              x1={PAD.left}
              y1={y}
              x2={PAD.left + innerW}
              y2={y}
              stroke={axisColor}
              strokeWidth={tick === 0 ? 1 : 0.5}
              strokeDasharray={tick === 0 ? undefined : '3 3'}
            />
            {tick > 0 && (
              <SvgText
                x={PAD.left - 5}
                y={y + 3.5}
                fontSize={8}
                fill={labelColor}
                textAnchor="end"
              >
                {tick}
              </SvgText>
            )}
          </G>
        );
      })}

      {dayData.map((day, i) => {
        const x = PAD.left + i * (barW + BAR_GAP);
        const barBottom = PAD.top + innerH;
        const showLabel = day.day === 1 || day.day % 5 === 0 || day.day === dayData.length;

        if (day.count === 0) {
          return (
            <G key={`day-${day.day}`}>
              <Rect
                x={x}
                y={barBottom - 3}
                width={barW}
                height={3}
                fill={emptyBarColor}
                rx={1}
              />
              {showLabel && (
                <SvgText
                  x={x + barW / 2}
                  y={barBottom + 14}
                  fontSize={7}
                  fill={labelColor}
                  textAnchor="middle"
                >
                  {day.day}
                </SvgText>
              )}
            </G>
          );
        }

        return (
          <G key={`day-${day.day}`}>
            {day.entryMoods.map((mood, mi) => {
              const segH = yScale;
              const segY = barBottom - (mi + 1) * segH;
              const isTop = mi === day.entryMoods.length - 1;
              return (
                <Rect
                  key={`seg-${mi}`}
                  x={x}
                  y={segY + 1}
                  width={barW}
                  height={segH - 1}
                  fill={mood ? MOOD_COLORS[mood] : MOOD_COLORS.neutral}
                  rx={isTop ? BAR_RADIUS : 0}
                  ry={isTop ? BAR_RADIUS : 0}
                />
              );
            })}

            {showLabel && (
              <SvgText
                x={x + barW / 2}
                y={barBottom + 14}
                fontSize={7}
                fill={isDark ? '#475569' : '#94a3b8'}
                textAnchor="middle"
              >
                {day.day}
              </SvgText>
            )}
          </G>
        );
      })}
    </Svg>
  );
}
