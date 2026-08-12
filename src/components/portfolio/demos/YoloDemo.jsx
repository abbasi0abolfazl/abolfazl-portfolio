import React, { useState } from 'react';
import { Eye, BarChart3, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const sampleDetections = [
  { pattern: 'Head and Shoulders', confidence: 93, color: 'text-green-400' },
  { pattern: 'Double Top', confidence: 86, color: 'text-blue-400' },
  { pattern: 'Triangle', confidence: 74, color: 'text-amber-400' },
];

export default function YoloDemo() {
  const [showSample, setShowSample] = useState(false);

  return (
    <div className="rounded-xl bg-background/80 border border-border/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50 bg-card/50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="font-medium text-sm text-foreground">YOLOv8 Chart Pattern Detection</h4>
            <p className="text-xs text-muted-foreground">Private client case study</p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Internal metrics withheld
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/40 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            This interface is a transparent UI simulation, not live model inference. Training artifacts and evaluation
            metrics from the client project are confidential, so no private benchmark is presented here.
          </p>
        </div>

        <Button
          onClick={() => setShowSample((value) => !value)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Eye className="w-4 h-4 mr-2" />
          {showSample ? 'Hide Sample Output' : 'View Sample Output'}
        </Button>

        {showSample && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <BarChart3 className="w-4 h-4 text-primary" />
              Illustrative detections
            </div>
            {sampleDetections.map((detection) => (
              <div key={detection.pattern} className="p-3 rounded-lg bg-card/50 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${detection.color}`}>{detection.pattern}</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                    Sample {detection.confidence}%
                  </Badge>
                </div>
                <Progress value={detection.confidence} className="h-1.5" />
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          The linked public project is a separate experiment that uses the public
          {' '}<code>foduucom/stockmarket-pattern-detection-yolov8</code> pretrained model.
        </p>
      </div>
    </div>
  );
}
