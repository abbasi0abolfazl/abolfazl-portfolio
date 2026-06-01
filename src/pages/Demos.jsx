import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, TrendingUp, Eye, Code } from 'lucide-react';
import ChatbotDemo from '../components/portfolio/demos/ChatbotDemo';
import TradingDemo from '../components/portfolio/demos/TradingDemo';
import YoloDemo from '../components/portfolio/demos/YoloDemo';
import CodeViewer from '../components/portfolio/demos/CodeViewer';
import AnimatedSection from '../components/portfolio/AnimatedSection';
import SectionHeading from '../components/portfolio/SectionHeading';

const demos = [
  { id: 'chatbot', label: 'Chatbot', icon: MessageSquare, component: ChatbotDemo },
  { id: 'trading', label: 'Trading Bot', icon: TrendingUp, component: TradingDemo },
  { id: 'yolo', label: 'YOLO Detector', icon: Eye, component: YoloDemo },
  { id: 'code', label: 'Code Snippets', icon: Code, component: CodeViewer },
];

export default function Demos() {
  return (
    <main className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Project Demos"
          subtitle="Interactive demonstrations of my key projects"
        />

        <AnimatedSection>
          <Tabs defaultValue="chatbot" className="w-full">
            <TabsList className="w-full bg-card/50 border border-border/50 h-auto flex-wrap gap-1 p-1.5 rounded-xl mb-8">
              {demos.map((demo) => (
                <TabsTrigger
                  key={demo.id}
                  value={demo.id}
                  className="flex-1 min-w-[120px] gap-2 py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                >
                  <demo.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{demo.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {demos.map((demo) => (
              <TabsContent key={demo.id} value={demo.id}>
                <demo.component />
              </TabsContent>
            ))}
          </Tabs>
        </AnimatedSection>
      </div>
    </main>
  );
}