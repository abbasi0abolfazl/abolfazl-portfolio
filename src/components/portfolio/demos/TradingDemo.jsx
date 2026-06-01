import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

function generatePriceData() {
  const data = [];
  let price = 1.0850;
  for (let i = 0; i < 50; i++) {
    price += (Math.random() - 0.48) * 0.002;
    const signal = i === 15 ? 'buy' : i === 32 ? 'sell' : i === 45 ? 'buy' : null;
    data.push({
      time: `${String(Math.floor(i / 2) + 9).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
      price: parseFloat(price.toFixed(4)),
      signal,
    });
  }
  return data;
}

export default function TradingDemo() {
  const [data, setData] = useState(() => generatePriceData());
  const [metrics, setMetrics] = useState({
    balance: 10250.00,
    openTrades: 2,
    winRate: 68,
    dailyPnL: 125.50,
    riskLevel: 'Medium',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        const lastPrice = newData[newData.length - 1].price;
        newData.push({
          time: '',
          price: parseFloat((lastPrice + (Math.random() - 0.48) * 0.001).toFixed(4)),
          signal: null,
        });
        if (newData.length > 60) newData.shift();
        return newData;
      });
      setMetrics(prev => ({
        ...prev,
        dailyPnL: parseFloat((prev.dailyPnL + (Math.random() - 0.45) * 5).toFixed(2)),
        balance: parseFloat((prev.balance + (Math.random() - 0.45) * 2).toFixed(2)),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl bg-background/80 border border-border/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50 bg-card/50 flex items-center justify-between">
        <div>
          <h4 className="font-medium text-sm text-foreground">EUR/USD Trading Bot</h4>
          <p className="text-xs text-muted-foreground">Real-time simulation</p>
        </div>
        <Badge className={`text-xs ${metrics.dailyPnL >= 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          {metrics.dailyPnL >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {metrics.dailyPnL >= 0 ? '+' : ''}{metrics.dailyPnL}
        </Badge>
      </div>

      {/* Chart */}
      <div className="h-[220px] p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={9} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#94a3b8' }} width={50} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
              labelStyle={{ color: '#94a3b8' }}
              itemStyle={{ color: '#f59e0b' }}
            />
            <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={2} dot={false} />
            {data.filter(d => d.signal).map((d, i) => (
              <ReferenceLine
                key={i}
                x={d.time}
                stroke={d.signal === 'buy' ? '#22c55e' : '#ef4444'}
                strokeDasharray="3 3"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-px bg-border/30">
        {[
          { label: 'Balance', value: `$${metrics.balance.toLocaleString()}` },
          { label: 'Open Trades', value: metrics.openTrades },
          { label: 'Win Rate', value: `${metrics.winRate}%` },
          { label: 'Risk', value: metrics.riskLevel },
        ].map((m) => (
          <div key={m.label} className="p-3 bg-card/30 text-center">
            <div className="text-xs text-muted-foreground">{m.label}</div>
            <div className="text-sm font-semibold text-foreground">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}