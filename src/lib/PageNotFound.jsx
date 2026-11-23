import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLang } from '@/lib/LanguageContext';

export default function PageNotFound() {
  const { tr, dir } = useLang();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4" dir={dir}>
      <div className="text-center">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          {tr('not_found_title')}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {tr('not_found_desc')}
        </p>
        <Link to="/">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 gap-2">
            <Home className="w-4 h-4" />
            {tr('not_found_back')}
          </Button>
        </Link>
      </div>
    </div>
  );
}