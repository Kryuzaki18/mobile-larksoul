import React, { useState, useEffect, useRef } from 'react';
import { useWindowDimensions, View, Animated, Easing } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G, Circle } from 'react-native-svg';

import type { DayData } from '../../../hooks/useInsightsGraph';
import { MOOD_COLORS } from '../../../utils/mood';
import BarTooltip, { TOOLTIP_W, TOOLTIP_H } from './BarTooltip';
import { Colors } from '../../../utils/themes';
import type { ColorTheme } from '../../../utils/themes';

const CHART_H = 180;
const PAD = { top: 16, right: 8, bottom: 36, left: 26 };
const BAR_GAP = 2;
const BAR_RADIUS = 4;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnimatedRect = Animated.createAnimatedComponent(Rect) as React.ComponentType<any>;

interface Props {
  dayData: DayData[];
  totalEntries: number;
  monthName: string;
  isDark: boolean;
  resetKey: number;
  theme: ColorTheme;
}

type TooltipState = { day: DayData; x: number; y: number };

export default function MoodBarChart({ dayData, totalEntries, monthName, isDark, resetKey, theme }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = screenWidth - 32;
  const innerW = chartWidth - PAD.left - PAD.right;
  const innerH = CHART_H - PAD.top - PAD.bottom;

  const n = dayData.length;
  const barW = Math.max((innerW - (n - 1) * BAR_GAP) / n, 3);

  const maxCount = Math.max(...dayData.map(d => d.count), 1);
  const yScale = innerH / maxCount;

  const gridColor     = isDark ? theme._13 : theme[100];
  const baselineColor = isDark ? theme._15 : theme[200];
  const labelColor    = isDark ? Colors.slate700 : Colors.slate300;
  const yLabelColor   = isDark ? Colors.slate700 : Colors.slate300;
  const emptyBarColor = isDark ? theme._13 : theme[100];
  const selectedColBg = isDark ? theme._13 : theme[50];

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayDay = dayData.find(d => d.dateStr === todayStr)?.day;

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
                stroke={tick === 0 ? baselineColor : gridColor}
                strokeWidth={tick === 0 ? 1.5 : 0.5}
                strokeDasharray={tick === 0 ? undefined : '3 4'}
              />
              {tick > 0 && (
                <SvgText
                  x={PAD.left - 5}
                  y={y + 3.5}
                  fontSize={8}
                  fill={yLabelColor}
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
          const isToday = day.day === todayDay;

          return (
            <G
              key={`day-${day.day}`}
              onPress={() => day.count > 0 ? handleBarPress(day, i) : setTooltip(null)}
            >
              {isSelected && (
                <Rect
                  x={x - 1}
                  y={PAD.top}
                  width={barW + 2}
                  height={innerH}
                  fill={selectedColBg}
                  rx={3}
                />
              )}

              {day.count === 0 ? (
                // Empty bar — slim nub
                <Rect
                  x={x + barW * 0.15}
                  y={barBottom - 3}
                  width={barW * 0.7}
                  height={3}
                  fill={emptyBarColor}
                  rx={1.5}
                />
              ) : (
                <>
                  {day.entryMoods.map((mood, mi) => {
                    const segH = yScale;
                    const targetY = barBottom - (mi + 1) * segH + 1;
                    const isTopSeg = mi === day.entryMoods.length - 1;
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
                        rx={isTopSeg ? BAR_RADIUS : 0}
                        ry={isTopSeg ? BAR_RADIUS : 0}
                        opacity={isSelected ? 0.5 : 1}
                      />
                    );
                  })}

                  {isSelected && (
                    <Rect
                      x={x}
                      y={barBottom - day.count * yScale - 1}
                      width={barW}
                      height={3}
                      fill={theme[500]}
                      rx={BAR_RADIUS}
                    />
                  )}
                </>
              )}

              <Rect x={x} y={PAD.top} width={barW} height={innerH} fill="transparent" />

              {showLabel && (
                <SvgText
                  x={x + barW / 2}
                  y={barBottom + 13}
                  fontSize={7}
                  fontWeight={isSelected || isToday ? '700' : '400'}
                  fill={
                    isSelected
                      ? theme[500]
                      : isToday
                      ? theme[isDark ? 400 : 600]
                      : labelColor
                  }
                  textAnchor="middle"
                >
                  {day.day}
                </SvgText>
              )}

              {isToday && (
                <Circle
                  cx={x + barW / 2}
                  cy={barBottom + 23}
                  r={1.8}
                  fill={theme[500]}
                />
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
          theme={theme}
        />
      )}
    </View>
  );
}
