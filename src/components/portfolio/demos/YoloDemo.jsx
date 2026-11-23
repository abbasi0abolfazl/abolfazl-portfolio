import React, { useState } from 'react';
import { Eye, BarChart3, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLang } from '@/lib/LanguageContext';

export default function YoloDemo() {
  const { tr, lang } = useLang();
  const [showSample, setShowSample] = useState(false);

  const sampleDetections = [
    {
      pattern: lang === 'fa' ? 'الگوی سر و شانه (Head & Shoulders)' : 'Head and Shoulders',
      confidence: 93,
      color: 'text-green-400'
    },
    {
      pattern: lang === 'fa' ? 'الگوی سقف دوگانه (Double Top)' : 'Double Top',
      confidence: 86,
      color: 'text-blue-400'
    },
    {
      pattern: lang === 'fa' ? 'الگوی کنج مثلثی (Triangle)' : 'Triangle',
      confidence: 74,
      color: 'text-amber-400'
    },
  ];

  return (
    <div className="rounded-xl bg-background/80 border border-border/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50 bg-card/50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="font-medium text-sm text-foreground">{tr('demos_yolo_header')}</h4>
            <p className="text-xs text-muted-foreground">{tr('demos_yolo_sub')}</p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {tr('demos_yolo_result')}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/40 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tr('demos_yolo_notice')}
          </p>
        </div>

        <Button
          onClick={() => setShowSample((value) => !value)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Eye className="w-4 h-4" />
          {showSample ? tr('demos_yolo_btn_hide') : tr('demos_yolo_btn_show')}
        </Button>

        {showSample && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <BarChart3 className="w-4 h-4 text-primary" />
              {tr('demos_yolo_detections')}
            </div>
            {sampleDetections.map((detection) => (
              <div key={detection.pattern} className="p-3 rounded-lg bg-card/50 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${detection.color}`}>{detection.pattern}</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs font-mono">
                    {detection.confidence}%
                  </Badge>
                </div>
                <Progress value={detection.confidence} className="h-1.5" />
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {tr('demos_yolo_footer')}
        </p>
      </div>
    </div>
  );
}
