import React, { useState, useEffect, useRef } from 'react';
import { useWindowDimensions, View, Text } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';

import type { DayData } from '../../../hooks/useInsightsGraph';
import { MOOD_COLORS, MOOD_META } from '../../../utils/mood';

const CHART_H = 180;
const PAD = { top: 16, right: 8, bottom: 30, left: 26 };
const BAR_GAP = 2;
const BAR_RADIUS = 2;
const TOOLTIP_W = 120;
const TOOLTIP_H = 72;

interface Props {
  dayData: DayData[];
  totalEntries: number;
  monthName: string;
  isDark: boolean;
  resetKey: number;
}

type TooltipState = { day: DayData; x: number; y: number };

export default function MoodBarChart({ dayData, totalEntries, monthName, isDark, resetKey }: Props) {
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

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setTooltip(null);
  }, [resetKey]);

  useEffect(() => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    if (tooltip) {
      dismissTimer.current = setTimeout(() => setTooltip(null), 5000);
    }
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [tooltip]);

  const handleBarPress = (day: DayData, i: number) => {
    if (tooltip?.day.day === day.day) {
      setTooltip(null);
      return;
    }
    const barCenterX = PAD.left + i * (barW + BAR_GAP) + barW / 2;
    const barTopY = PAD.top + innerH - day.count * yScale;
    const rawX = barCenterX - TOOLTIP_W / 2;
    const clampedX = Math.max(PAD.left, Math.min(rawX, chartWidth - TOOLTIP_W - PAD.right));
    const tooltipY = Math.max(2, barTopY - TOOLTIP_H - 6);
    setTooltip({ day, x: clampedX, y: tooltipY });
  };

  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';
  const tooltipPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const tooltipSecondary = isDark ? '#94a3b8' : '#64748b';

  return (
    <View style={{ position: 'relative' }}>
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
          const isSelected = tooltip?.day.day === day.day;

          if (day.count === 0) {
            return (
              <G key={`day-${day.day}`} onPress={() => setTooltip(null)}>
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
            <G key={`day-${day.day}`} onPress={() => handleBarPress(day, i)}>
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
                    opacity={isSelected ? 0.55 : 1}
                  />
                );
              })}
              {/* Full-column transparent hit area for reliable touch */}
              <Rect x={x} y={PAD.top} width={barW} height={innerH} fill="transparent" />
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

      {tooltip && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
            width: TOOLTIP_W,
            backgroundColor: tooltipBg,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: tooltipBorder,
            paddingHorizontal: 10,
            paddingVertical: 8,
            shadowColor: '#000',
            shadowOpacity: isDark ? 0.35 : 0.1,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 8,
          }}
        >
          <Text
            style={{ fontSize: 10, fontWeight: '700', color: tooltipPrimary, marginBottom: 2 }}
          >
            {monthName} {tooltip.day.day}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 5,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: tooltipPrimary }}>
              {tooltip.day.count} {tooltip.day.count === 1 ? 'entry' : 'entries'}
            </Text>
            {totalEntries > 0 && (
              <Text style={{ fontSize: 10, color: tooltipSecondary }}>
                {Math.round((tooltip.day.count / totalEntries) * 100)}%
              </Text>
            )}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
            {tooltip.day.entryMoods.map((mood, idx) => (
              <Text key={idx} style={{ fontSize: 12 }}>
                {MOOD_META[mood ?? 'neutral'].emoji}
              </Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
