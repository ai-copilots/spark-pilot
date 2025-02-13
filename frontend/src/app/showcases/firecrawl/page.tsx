'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CrawlForm } from './components/crawl-form';
import { ExtractForm } from './components/extract-form';
import { SearchForm } from './components/search-form';

// Firecrawl 展示页面
export default function FirecrawlShowcase() {
  const [activeTab, setActiveTab] = useState('crawl');

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Firecrawl 功能展示</CardTitle>
          <CardDescription>
            展示 Firecrawl 的网页爬取、内容提取和搜索功能
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="crawl">网页爬取</TabsTrigger>
              <TabsTrigger value="extract">内容提取</TabsTrigger>
              <TabsTrigger value="search">网页搜索</TabsTrigger>
            </TabsList>
            <TabsContent value="crawl">
              <CrawlForm />
            </TabsContent>
            <TabsContent value="extract">
              <ExtractForm />
            </TabsContent>
            <TabsContent value="search">
              <SearchForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 