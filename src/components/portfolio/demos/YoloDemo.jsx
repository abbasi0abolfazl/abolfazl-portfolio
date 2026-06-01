import React, { useState } from 'react';
import { Upload, Eye, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const mockDetections = [
  { pattern: 'Head and Shoulders', confidence: 97.2, color: 'text-green-400' },
  { pattern: 'Double Top', confidence: 89.5, color: 'text-blue-400' },
  { pattern: 'Triangle', confidence: 72.1, color: 'text-amber-400' },
];

export default function YoloDemo() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setResults(null);
    setTimeout(() => {
      setResults(mockDetections);
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="rounded-xl bg-background/80 border border-border/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50 bg-card/50">
        <h4 className="font-medium text-sm text-foreground">YOLOv8 Chart Pattern Detector</h4>
        <p className="text-xs text-muted-foreground">97% accuracy on financial charts</p>
      </div>

      <div className="p-6">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center mb-4 hover:border-primary/30 transition-colors">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-1">Upload a chart image for analysis</p>
          <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-4"
        >
          {analyzing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </div>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Run Demo Analysis
            </>
          )}
        </Button>

        {/* Results */}
        {results && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <BarChart3 className="w-4 h-4 text-primary" />
              Detected Patterns
            </div>
            {results.map((det) => (
              <div key={det.pattern} className="p-3 rounded-lg bg-card/50 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${det.color}`}>{det.pattern}</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {det.confidence}%
                  </Badge>
                </div>
                <Progress value={det.confidence} className="h-1.5" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}