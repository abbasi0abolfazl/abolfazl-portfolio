import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

const codeSnippets = {
  rag: {
    label: 'RAG Pipeline',
    language: 'python',
    code: `from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA

# Initialize embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Create vector store
vectordb = Chroma.from_documents(
    documents=legal_docs,
    embedding=embeddings,
    persist_directory="./legal_db"
)

# Build RAG chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectordb.as_retriever(k=5),
    return_source_documents=True
)

# Query
result = qa_chain("What does Article 148 say?")`,
  },
  trading: {
    label: 'Trading Bot',
    language: 'python',
    code: `import MetaTrader5 as mt5
import redis
from datetime import datetime

class ForexBot:
    def __init__(self):
        self.redis = redis.Redis()
        mt5.initialize()
        
    def check_risk(self, symbol, lot_size):
        """Risk management before trade execution"""
        account = mt5.account_info()
        margin = mt5.order_calc_margin(
            mt5.ORDER_TYPE_BUY, symbol, lot_size
        )
        risk_ratio = margin / account.equity
        return risk_ratio < 0.02  # Max 2% risk
        
    def execute_trade(self, symbol, signal):
        if self.is_news_suspended(symbol):
            return "Trade suspended - news event"
        if not self.check_risk(symbol, 0.1):
            return "Risk limit exceeded"
        # Execute order...`,
  },
  yolo: {
    label: 'YOLOv8 Detection',
    language: 'python',
    code: `from ultralytics import YOLO
import cv2

# Load trained model
model = YOLO("chart_patterns_v8.pt")

def detect_patterns(image_path):
    """Detect chart patterns in financial charts"""
    results = model.predict(
        source=image_path,
        conf=0.75,
        iou=0.45
    )
    
    detections = []
    for r in results:
        for box in r.boxes:
            detections.append({
                "pattern": model.names[int(box.cls)],
                "confidence": float(box.conf),
                "bbox": box.xyxy[0].tolist()
            })
    
    return sorted(
        detections, 
        key=lambda x: x["confidence"], 
        reverse=True
    )`,
  },
};

export default function CodeViewer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl bg-background/80 border border-border/50 overflow-hidden">
      <Tabs defaultValue="rag">
        <div className="px-4 py-3 border-b border-border/50 bg-card/50">
          <TabsList className="bg-background/60 h-8">
            {Object.entries(codeSnippets).map(([key, snippet]) => (
              <TabsTrigger key={key} value={key} className="text-xs h-7 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                {snippet.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {Object.entries(codeSnippets).map(([key, snippet]) => (
          <TabsContent key={key} value={key} className="m-0">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(snippet.code)}
                className="absolute top-3 right-3 h-7 text-xs text-muted-foreground hover:text-primary z-10"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
              <pre className="p-4 overflow-x-auto text-xs leading-relaxed text-muted-foreground max-h-[350px]">
                <code>{snippet.code}</code>
              </pre>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}