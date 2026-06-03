import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, TrendingUp, Brain, Award, ExternalLink, Zap, BarChart3, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projects } from '@/data/projectsData';

// پیدا کردن ID پروژه مرتبط با هر research highlight
const getProjectId = (title) => {
  const mapping = {
    "Fine-tuning BERT for Persian Emotion Detection": "sentiment-emotion-detection",
    "RAG Optimization for Legal Documents": "legal-reasoning-chatbot",
    "YOLOv8 for Chart Pattern Detection": "chart-pattern-detector",
  };
  return mapping[title];
};

const researchHighlights = [
  {
    title: "Fine-tuning BERT for Persian Emotion Detection",
    description: "Achieved 87% macro-F1 across 8 emotion classes by fine-tuning ParsBERT on a curated dataset of 15K Persian sentences.",
    tags: ["BERT", "Persian NLP", "Fine-tuning", "Classification"],
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    projectLink: true,
  },
  {
    title: "RAG Optimization for Legal Documents",
    description: "Developed structure-aware chunking strategy that improved retrieval precision by 92% on a corpus of 10K+ legal articles.",
    tags: ["RAG", "Vector Search", "LangChain", "Legal AI"],
    icon: FileText,
    color: "from-green-500 to-emerald-500",
    projectLink: true,
  },
  {
    title: "YOLOv8 for Chart Pattern Detection",
    description: "Trained a computer vision model achieving 97% mAP for detecting 12 distinct technical analysis patterns in real-time.",
    tags: ["Computer Vision", "YOLOv8", "Trading", "Deep Learning"],
    icon: TrendingUp,
    color: "from-amber-500 to-orange-500",
    projectLink: true,
  },
];

const publications = [
  {
    title: "Efficient RAG Systems for Low-Resource Languages",
    venue: "AI Journal (In Preparation)",
    year: "2025",
    status: "Draft",
    url: null,
    urlText: "Preprint Coming Soon",
  },
  {
    title: "Emotion-Aware Chatbots for E-Commerce",
    venue: "International Conference on NLP",
    year: "2024",
    status: "Submitted",
    url: null,
    urlText: "Under Review",
  },
  {
    title: "Real-time Chart Pattern Recognition Using YOLO",
    venue: "FinTech Innovation Summit",
    year: "2024",
    status: "Presented",
    url: "https://drive.google.com",
    urlText: "View Slides",
  },
];

const modelBenchmarks = [
  { model: "ParsBERT", task: "Emotion Detection", accuracy: "87%", latency: "45ms", detailsLink: "/projects/sentiment-emotion-detection" },
  { model: "Multilingual BERT", task: "Emotion Detection", accuracy: "75%", latency: "52ms", detailsLink: null },
  { model: "YOLOv8n", task: "Chart Detection", mAP: "97%", fps: "30", detailsLink: "/projects/chart-pattern-detector" },
  { model: "GPT-4 (few-shot)", task: "Legal QA", accuracy: "89%", latency: "1200ms", detailsLink: "/projects/legal-reasoning-chatbot" },
];

export default function ResearchInsights() {
  return (
    <div className="space-y-8">
      {/* Research Highlights - هر کارت به صفحه پروژه لینک دارد */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Research Highlights
        </h3>
        <div className="grid gap-4">
          {researchHighlights.map((item, idx) => {
            const Icon = item.icon;
            const projectId = getProjectId(item.title);
            const content = (
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} bg-opacity-10 shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-primary/5 text-primary border-primary/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
            );

            return projectId ? (
              <Link
                key={idx}
                to={`/projects/${projectId}`}
                className="block p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all group"
              >
                {content}
              </Link>
            ) : (
              <div
                key={idx}
                className="p-4 rounded-xl bg-card/50 border border-border/50"
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Benchmarks - هر ردیف قابل کلیک */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Model Benchmarks
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Model</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Task</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Metric</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Value</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium"></th>
               </tr>
            </thead>
            <tbody>
              {modelBenchmarks.map((benchmark, idx) => {
                const isClickable = benchmark.detailsLink;
                const rowContent = (
                  <>
                    <td className="py-2 px-3 text-foreground font-mono text-xs">{benchmark.model}</td>
                    <td className="py-2 px-3 text-muted-foreground">{benchmark.task}</td>
                    <td className="py-2 px-3 text-muted-foreground">
                      {benchmark.mAP ? "mAP@0.5" : "Accuracy"}
                    </td>
                    <td className="py-2 px-3 text-primary font-semibold">{benchmark.mAP || benchmark.accuracy}</td>
                    <td className="py-2 px-3">
                      {isClickable && (
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
                      )}
                    </td>
                  </>
                );

                return isClickable ? (
                  <Link
                    key={idx}
                    to={benchmark.detailsLink}
                    className="group block border-b border-border/50 hover:bg-card/50 transition-colors"
                  >
                    <tr className="cursor-pointer">{rowContent}</tr>
                  </Link>
                ) : (
                  <tr key={idx} className="border-b border-border/50">
                    {rowContent}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Publications - با لینک واقعی */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Publications & Presentations
        </h3>
        <div className="space-y-2">
          {publications.map((pub, idx) => (
            <div
              key={idx}
              className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-card/30 border border-border/50 hover:border-primary/30 transition-all"
            >
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">{pub.title}</p>
                <p className="text-xs text-muted-foreground">{pub.venue} • {pub.year}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    pub.status === 'Draft' 
                      ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      : pub.status === 'Submitted'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-green-500/10 text-green-400 border-green-500/20'
                  }`}
                >
                  {pub.status}
                </Badge>
                {pub.url ? (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    {pub.urlText}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">{pub.urlText}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub CTA */}
      <div className="pt-4 text-center">
        <Button
          variant="outline"
          className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
          onClick={() => window.open('https://github.com/abbasi0abolfazl', '_blank')}
        >
          <Github className="w-4 h-4" />
          View All Research on GitHub
        </Button>
      </div>
    </div>
  );
}