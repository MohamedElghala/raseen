import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CommunityPost, CommunityCategorySlug, CommunityComment, Author } from '@/lib/communityTypes';
import { INITIAL_POSTS } from '@/lib/communitySeedData';

interface CommunityState {
  posts: CommunityPost[];
  selectedCategory: CommunityCategorySlug;
  searchQuery: string;
  activeTab: 'all' | 'recent' | 'top' | 'requests' | 'solved';
  isCreateModalOpen: boolean;
  createModalType: 'discussion' | 'request';
  upvotedPostIds: string[];
  upvotedCommentIds: string[];

  // Actions
  setSelectedCategory: (category: CommunityCategorySlug) => void;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: 'all' | 'recent' | 'top' | 'requests' | 'solved') => void;
  openCreateModal: (type?: 'discussion' | 'request') => void;
  closeCreateModal: () => void;

  addPost: (newPostData: {
    title: string;
    content: string;
    author: Author;
    category: CommunityCategorySlug;
    tags: string[];
    isCustomRequest?: boolean;
    bounty?: string;
    deadline?: string;
  }) => string;

  upvotePost: (postId: string) => void;

  addComment: (postId: string, commentData: {
    author: Author;
    content: string;
  }) => void;

  markCommentAsSolution: (postId: string, commentId: string) => void;
  upvoteComment: (commentId: string) => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      posts: INITIAL_POSTS,
      selectedCategory: 'all',
      searchQuery: '',
      activeTab: 'all',
      isCreateModalOpen: false,
      createModalType: 'discussion',
      upvotedPostIds: [],
      upvotedCommentIds: [],

      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      openCreateModal: (type = 'discussion') =>
        set({ isCreateModalOpen: true, createModalType: type }),

      closeCreateModal: () => set({ isCreateModalOpen: false }),

      addPost: (data) => {
        const id = `post-${Date.now()}`;
        const newPost: CommunityPost = {
          id,
          title: data.title,
          content: data.content,
          author: data.author,
          category: data.category,
          tags: data.tags,
          upvotes: 1,
          views: 1,
          commentsCount: 0,
          createdAt: 'الآن',
          isSolved: false,
          isCustomRequest: data.isCustomRequest,
          bounty: data.bounty,
          deadline: data.deadline,
          comments: [],
        };

        set((state) => ({
          posts: [newPost, ...state.posts],
          isCreateModalOpen: false,
          upvotedPostIds: [...state.upvotedPostIds, id],
        }));

        return id;
      },

      upvotePost: (postId: string) => {
        const { upvotedPostIds, posts } = get();
        const hasUpvoted = upvotedPostIds.includes(postId);

        set({
          upvotedPostIds: hasUpvoted
            ? upvotedPostIds.filter((id) => id !== postId)
            : [...upvotedPostIds, postId],
          posts: posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                upvotes: hasUpvoted ? Math.max(0, post.upvotes - 1) : post.upvotes + 1,
              };
            }
            return post;
          }),
        });
      },

      addComment: (postId: string, commentData) => {
        const newComment: CommunityComment = {
          id: `c-${Date.now()}`,
          postId,
          author: commentData.author,
          content: commentData.content,
          upvotes: 0,
          createdAt: 'الآن',
          isSolution: false,
        };

        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              const currentComments = post.comments || [];
              return {
                ...post,
                comments: [...currentComments, newComment],
                commentsCount: currentComments.length + 1,
              };
            }
            return post;
          }),
        }));
      },

      markCommentAsSolution: (postId: string, commentId: string) => {
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              const updatedComments = (post.comments || []).map((c) => ({
                ...c,
                isSolution: c.id === commentId,
              }));
              return {
                ...post,
                isSolved: true,
                comments: updatedComments,
              };
            }
            return post;
          }),
        }));
      },

      upvoteComment: (commentId: string) => {
        const { upvotedCommentIds, posts } = get();
        const hasUpvoted = upvotedCommentIds.includes(commentId);

        set({
          upvotedCommentIds: hasUpvoted
            ? upvotedCommentIds.filter((id) => id !== commentId)
            : [...upvotedCommentIds, commentId],
          posts: posts.map((post) => {
            if (!post.comments) return post;
            return {
              ...post,
              comments: post.comments.map((c) => {
                if (c.id === commentId) {
                  return {
                    ...c,
                    upvotes: hasUpvoted ? Math.max(0, c.upvotes - 1) : c.upvotes + 1,
                  };
                }
                return c;
              }),
            };
          }),
        });
      },
    }),
    {
      name: 'raseen-community-storage',
    }
  )
);
