/**
 * Blog & Knowledge Hub Data Models
 * Authority: Requirement R3, Milestone M3
 */

export type BlogCategorySlug = 'engineering' | 'financial' | 'legal' | 'business';

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface BlogSection {
  id: string; // HTML anchor ID for Table of Contents tracking
  title: string;
  content: string; // Long-form authoritative editorial content
  keyPoints?: string[];
  callout?: {
    type: 'tip' | 'warning' | 'info' | 'quote';
    text: string;
  };
}

export interface BlogSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategorySlug;
  categoryLabel: string;
  author: BlogAuthor;
  publishedAt: string;
  readingTime: string;
  sections: BlogSection[];
  embeddedProductIds: string[];
  seo: BlogSEO;
  tags: string[];
  views: number;
  featured?: boolean;
  coverImage?: string;
}
