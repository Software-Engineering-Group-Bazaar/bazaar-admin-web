import React from 'react';

function getWidth(percent, maxWidth) {
  return (percent / 100) * maxWidth;
}

const FunnelCurved = ({ steps, width = 700, height = 200 }) => {
  const stepHeight = height / steps.length;
  const maxWidth = width;
  return (
    <svg width={width} height={height}>
      {steps.map((step, i) => {
        if (i === steps.length - 1) return null;
        const next = steps[i + 1];
        const y1 = i * stepHeight;
        const y2 = (i + 1) * stepHeight;
        const w1 = getWidth(step.percent, maxWidth);
        const w2 = getWidth(next.percent, maxWidth);
        const x1 = (maxWidth - w1) / 2;
        const x2 = (maxWidth - w2) / 2;
        // Manje zakrivljenosti za više horizontalan izgled
        const c1 = y1 + stepHeight * 0.9;
        const c2 = y2 - stepHeight * 0.8;
        return (
          <path
            key={i}
            d={`
              M ${x1},${y1}
              C ${x1},${c1} ${x2},${c2} ${x2},${y2}
              L ${x2 + w2},${y2}
              C ${x2 + w2},${c2} ${x1 + w1},${c1} ${x1 + w1},${y1}
              Z
            `}
            fill={step.color}
            opacity={0.95}
          />
        );
      })}
      {/* Tekst u sredini svakog stepa */}
      {steps.map((step, i) => {
        const y = i * stepHeight + stepHeight / 2 + 6;
        return (
          <text
            key={i}
            x={width / 2}
            y={y}
            textAnchor='middle'
            fontSize='18'
            fill='#fff'
            fontWeight='bold'
            style={{ pointerEvents: 'none' }}
          >
            {step.value.toLocaleString()} ({step.percent}%)
          </text>
        );
      })}
    </svg>
  );
};

export default FunnelCurved;
