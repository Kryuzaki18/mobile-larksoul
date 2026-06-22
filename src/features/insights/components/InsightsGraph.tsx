import React, { useState, useEffect, useRef } from 'react';
import { useWindowDimensions, View, Animated, Easing } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';

import type { DayData } from '../../../hooks/useInsightsGraph';
import { MOOD_COLORS } from '../../../utils/mood';
import BarTooltip, { TOOLTIP_W, TOOLTIP_H } from './BarTooltip';
import { Colors } from '../../../utils/themes';

const CHART_H = 180;
const PAD = { top: 16, right: 8, bottom: 30, left: 26 };
const BAR_GAP = 2;
const BAR_RADIUS = 2;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnimatedRect = Animated.createAnimatedComponent(Rect) as React.ComponentType<any>;

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

  const axisColor = isDark ? Colors.slate800 : Colors.slate200;
  const labelColor = isDark ? Colors.slate700 : Colors.slate300;
  const emptyBarColor = isDark ? Colors.slate800 : Colors.slate100;

  const yTicks = Array.from({ length: maxCount + 1 }, (_, i) => i);

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTooltip(null);
    barProgress.setValue(0);
    Animated.timing(barProgress, {
      toValue: 1,
      duration: 650,
      delay: 80,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
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
                const targetY = barBottom - (mi + 1) * segH + 1;
                const isTop = mi === day.entryMoods.length - 1;
                return (
                  <AnimatedRect
                    key={`seg-${mi}`}
                    x={x}
                    y={barProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [barBottom + 1, targetY],
                    })}
                    width={barW}
                    height={barProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, segH - 1],
                    })}
                    fill={mood ? MOOD_COLORS[mood] : MOOD_COLORS.neutral}
                    rx={isTop ? BAR_RADIUS : 0}
                    ry={isTop ? BAR_RADIUS : 0}
                    opacity={isSelected ? 0.55 : 1}
                  />
                );
              })}
              <Rect x={x} y={PAD.top} width={barW} height={innerH} fill="transparent" />
              {showLabel && (
                <SvgText
                  x={x + barW / 2}
                  y={barBottom + 14}
                  fontSize={7}
                  fill={isDark ? Colors.slate600 : Colors.slate400}
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
        <BarTooltip
          day={tooltip.day}
          x={tooltip.x}
          y={tooltip.y}
          totalEntries={totalEntries}
          monthName={monthName}
          isDark={isDark}
        />
      )}
    </View>
  );
}
