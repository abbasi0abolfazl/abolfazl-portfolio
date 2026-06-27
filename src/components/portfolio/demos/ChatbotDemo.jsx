import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const predefinedResponses = {
  'قانون کار': 'طبق ماده ۱۴۸ قانون کار، کارفرما مکلف است بر اساس قانون تأمین اجتماعی نسبت به بیمه نمودن کارگران اقدام نماید. همچنین حق بیمه سهم کارفرما باید به موقع پرداخت شود.',
  'labor law': 'According to Article 148 of the Labor Law, the employer is obligated to insure workers based on social security law. The employer must also pay their share of insurance premiums on time.',
  'rag': 'RAG (Retrieval-Augmented Generation) combines a retrieval system with a language model. First, relevant documents are retrieved from a vector database like ChromaDB, then the LLM generates an answer based on the retrieved context.',
  'chatbot': 'This chatbot uses a RAG architecture: 1) User query is embedded, 2) Similar documents are retrieved via vector search, 3) Context is passed to the LLM, 4) Response is generated with source citations.',
  'help': 'I can answer questions about Persian legal documents, labor law, and RAG architecture. Try asking about "قانون کار", "labor law", "rag", or "chatbot".',
};

export default function ChatbotDemo() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m the Legal Reasoning Assistant. Ask me about Persian legal documents, labor law, or how RAG works. Type "help" for suggestions.' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (messages.length > 1 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const key = Object.keys(predefinedResponses).find(k => 
        userMsg.toLowerCase().includes(k)
      );
      const response = key 
        ? predefinedResponses[key]
        : 'I found relevant legal documents in the vector database. Based on the retrieved context, I can provide information on various legal topics. Try asking about specific legal terms or concepts.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="flex flex-col h-[400px] rounded-xl bg-background/80 border border-border/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50 bg-card/50">
        <h4 className="font-medium text-sm text-foreground">Legal Reasoning Chatbot</h4>
        <p className="text-xs text-muted-foreground">RAG + ChromaDB + LangChain</p>
      </div>
      
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-sm'
                : 'bg-card border border-border/50 text-foreground rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-card border border-border/50 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 border-t border-border/50 bg-card/30">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about legal documents..."
            className="bg-background/50 border-border/50 text-sm h-9"
          />
          <Button type="submit" size="sm" className="bg-primary text-primary-foreground h-9 px-3">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}