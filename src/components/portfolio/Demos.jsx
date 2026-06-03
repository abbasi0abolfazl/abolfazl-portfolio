import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, TrendingUp, Eye, BookOpen } from 'lucide-react';
import ChatbotDemo from './demos/ChatbotDemo';
import TradingDemo from './demos/TradingDemo';
import YoloDemo from './demos/YoloDemo';
// import ResearchInsights from './demos/ResearchInsights'; // فعلاً غیرفعال
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';

// فعال/غیرفعال کردن تب Research
const SHOW_RESEARCH_TAB = false; // برای فعال‌سازی بعداً true کنید

const demos = [
  { id: 'chatbot', label: 'Chatbot', icon: MessageSquare, component: ChatbotDemo },
  { id: 'trading', label: 'Trading Bot', icon: TrendingUp, component: TradingDemo },
  { id: 'yolo', label: 'YOLO Detector', icon: Eye, component: YoloDemo },
];

// اگر SHOW_RESEARCH_TAB true بود، تب Research را اضافه کن
if (SHOW_RESEARCH_TAB) {
  demos.push({ id: 'research', label: 'Research', icon: BookOpen, component: () => <div>Research content coming soon...</div> });
}

export default function Demos() {
  return (
    <section id="demos" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Live Demos"
          subtitle="Interactive demonstrations of my key projects"
        />

        <AnimatedSection>
          <Tabs defaultValue="chatbot" className="w-full">
            <TabsList className="w-full bg-card/50 border border-border/50 h-auto flex-wrap gap-1 p-1.5 rounded-xl mb-8">
              {demos.map((demo) => (
                <TabsTrigger
                  key={demo.id}
                  value={demo.id}
                  className="flex-1 min-w-[100px] gap-2 py-2.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
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
    </section>
  );
}