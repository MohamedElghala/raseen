export type CommunityCategorySlug = 
  | 'all' 
  | 'accounting' 
  | 'legal' 
  | 'engineering' 
  | 'business' 
  | 'requests';

export interface Author {
  name: string;
  title: string;
  avatar?: string;
  verified: boolean;
  role: 'expert' | 'creator' | 'member';
}

export interface CommunityComment {
  id: string;
  postId: string;
  author: Author;
  content: string;
  upvotes: number;
  createdAt: string;
  isSolution?: boolean;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: Author;
  category: CommunityCategorySlug;
  tags: string[];
  upvotes: number;
  views: number;
  commentsCount: number;
  createdAt: string;
  isSolved?: boolean;
  isCustomRequest?: boolean;
  bounty?: string; // e.g. "800 ج.م"
  deadline?: string;
  relatedProductId?: string;
  comments?: CommunityComment[];
}
