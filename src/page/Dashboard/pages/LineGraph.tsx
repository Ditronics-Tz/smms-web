import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useChartTheme } from '../../../utils/chartTheme';

function LineChart({ data }) {
  const { accent, axisProps, gridProps, tooltipProps } = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={accent} stopOpacity={0.55} />
            <stop offset="95%" stopColor={accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey="date" {...axisProps} />
        <YAxis {...axisProps} width={56} />
        <Tooltip {...tooltipProps} />
        <Area
          type="monotone"
          dataKey="amount"
          stroke={accent}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorY)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default LineChart;