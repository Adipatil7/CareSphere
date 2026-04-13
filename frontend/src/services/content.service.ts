import api from '@/lib/api';
import type {
  Post,
  CreatePostRequest,
  Comment,
  CreateCommentRequest,
  PostReaction,
  ReactToPostRequest,
  Question,
  CreateQuestionRequest,
  Answer,
  CreateAnswerRequest,
} from '@/types';

export const contentService = {
  // ── Posts ──
  async createPost(data: CreatePostRequest): Promise<Post> {
    const res = await api.post<Post>('/api/content/posts', data);
    return res.data;
  },

  async getPosts(category?: string): Promise<Post[]> {
    const res = await api.get<Post[]>('/api/content/posts', {
      params: category ? { category } : {},
    });
    return res.data;
  },

  async addComment(postId: string, data: CreateCommentRequest): Promise<Comment> {
    const res = await api.post<Comment>(`/api/content/posts/${postId}/comment`, data);
    return res.data;
  },

  async reactToPost(postId: string, data: ReactToPostRequest): Promise<PostReaction> {
    const res = await api.post<PostReaction>(`/api/content/posts/${postId}/react`, data);
    return res.data;
  },

  // ── Questions ──
  async createQuestion(data: CreateQuestionRequest): Promise<Question> {
    const res = await api.post<Question>('/api/content/questions', data);
    return res.data;
  },

  async getQuestions(): Promise<Question[]> {
    const res = await api.get<Question[]>('/api/content/questions');
    return res.data;
  },

  async addAnswer(questionId: string, data: CreateAnswerRequest): Promise<Answer> {
    const res = await api.post<Answer>(`/api/content/questions/${questionId}/answer`, data);
    return res.data;
  },

  async getAnswers(questionId: string): Promise<Answer[]> {
    const res = await api.get<Answer[]>(`/api/content/questions/${questionId}/answers`);
    return res.data;
  },
};
