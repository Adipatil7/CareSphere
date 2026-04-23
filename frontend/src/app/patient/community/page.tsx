"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { PostCard } from "@/components/common/PostCard";
import { useAuth } from "@/hooks/useAuth";
import { useUserNames, getDisplayName, getInitials } from "@/hooks/useUserNames";
import { contentService } from "@/services/content.service";
import type { Post, Question, Answer } from "@/types";
import { toast } from "sonner";
import {
  Users,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  Plus,
} from "lucide-react";

export default function PatientCommunityPage() {
  const { user } = useAuth();

  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Q&A state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    null
  );
  const [answers, setAnswers] = useState<Record<string, Answer[]>>({});
  const [loadingAnswers, setLoadingAnswers] = useState<string | null>(null);

  // New question form
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDesc, setQuestionDesc] = useState("");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  // Answer input state per question
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<string | null>(
    null
  );

  // Collect all user IDs from Q&A for name resolution
  const qaUserIds = useMemo(() => {
    const ids: string[] = [];
    questions.forEach((q) => ids.push(q.userId));
    Object.values(answers).forEach((ansArr) =>
      ansArr.forEach((a) => ids.push(a.userId))
    );
    return ids;
  }, [questions, answers]);

  const qaNamesMap = useUserNames(qaUserIds);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await contentService.getPosts();
        setPosts(data);
      } catch {
        // Global error handler shows toast
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await contentService.getQuestions();
        setQuestions(data);
      } catch {
        // Global error handler shows toast
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, []);

  // Handle react
  const handleReact = useCallback(
    async (postId: string, type: "LIKE" | "HELPFUL") => {
      if (!user) return;
      await contentService.reactToPost(postId, {
        userId: user.id,
        reactionType: type,
      });
      // Refresh posts to get updated reaction counts
      try {
        const updatedPosts = await contentService.getPosts();
        setPosts(updatedPosts);
      } catch {
        // Silently ignore refresh failure
      }
    },
    [user]
  );

  // Handle comment
  const handleComment = useCallback(
    async (postId: string, text: string) => {
      if (!user) return;
      await contentService.addComment(postId, {
        userId: user.id,
        text,
      });
      // Refresh posts to get updated comments
      try {
        const updatedPosts = await contentService.getPosts();
        setPosts(updatedPosts);
      } catch {
        // Silently ignore refresh failure
      }
      toast.success("Comment added!");
    },
    [user]
  );

  // Toggle question expansion + fetch answers
  const handleToggleQuestion = async (questionId: string) => {
    if (expandedQuestionId === questionId) {
      setExpandedQuestionId(null);
      return;
    }

    setExpandedQuestionId(questionId);

    // Check if the question already has embedded answers
    const question = questions.find((q) => q.id === questionId);
    if (question?.answers) {
      setAnswers((prev) => ({ ...prev, [questionId]: question.answers! }));
      return;
    }

    // Fetch answers if not already loaded
    if (!answers[questionId]) {
      setLoadingAnswers(questionId);
      try {
        const data = await contentService.getAnswers(questionId);
        setAnswers((prev) => ({ ...prev, [questionId]: data }));
      } catch {
        // Global error handler shows toast
      } finally {
        setLoadingAnswers(null);
      }
    }
  };

  // Submit new question
  const handleSubmitQuestion = async () => {
    if (!user || !questionTitle.trim() || !questionDesc.trim()) return;

    setIsSubmittingQuestion(true);
    try {
      const newQ = await contentService.createQuestion({
        userId: user.id,
        title: questionTitle,
        description: questionDesc,
      });
      setQuestions((prev) => [newQ, ...prev]);
      setQuestionTitle("");
      setQuestionDesc("");
      setShowQuestionForm(false);
      toast.success("Question posted successfully!");
    } catch {
      // Global error handler shows toast
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  // Submit answer
  const handleSubmitAnswer = async (questionId: string) => {
    const text = answerTexts[questionId]?.trim();
    if (!user || !text) return;

    setIsSubmittingAnswer(questionId);
    try {
      const newAnswer = await contentService.addAnswer(questionId, {
        userId: user.id,
        answer: text,
      });
      setAnswers((prev) => ({
        ...prev,
        [questionId]: [...(prev[questionId] || []), newAnswer],
      }));
      setAnswerTexts((prev) => ({ ...prev, [questionId]: "" }));
      toast.success("Answer submitted!");
    } catch {
      // Global error handler shows toast
    } finally {
      setIsSubmittingAnswer(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Community"
        description="Read health awareness posts and get your questions answered."
      />

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="posts" className="text-sm">
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Health Posts
          </TabsTrigger>
          <TabsTrigger value="qa" className="text-sm">
            <HelpCircle className="h-4 w-4 mr-1.5" />
            Q&A
          </TabsTrigger>
        </TabsList>

        {/* ── Posts Tab ── */}
        <TabsContent value="posts" className="mt-4 space-y-4">
          {loadingPosts ? (
            <LoadingSkeleton variant="card" count={3} />
          ) : posts.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No posts yet"
              description="Health awareness posts from doctors will appear here."
            />
          ) : (
            <div className="space-y-4 max-w-2xl">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user?.id ?? ""}
                  onReact={handleReact}
                  onComment={handleComment}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Q&A Tab ── */}
        <TabsContent value="qa" className="mt-4 space-y-4">
          {/* Ask a Question */}
          <div className="max-w-2xl">
            {!showQuestionForm ? (
              <Button
                id="ask-question-btn"
                variant="outline"
                className="w-full border-dashed border-2 h-12 text-muted-foreground hover:text-foreground hover:border-primary/50"
                onClick={() => setShowQuestionForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ask a Question
              </Button>
            ) : (
              <Card className="border border-border shadow-sm">
                <CardContent className="p-5 space-y-4">
                  <h3 className="font-semibold text-foreground text-sm">
                    Ask a New Question
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="q-title" className="text-sm">
                      Title
                    </Label>
                    <Input
                      id="q-title"
                      placeholder="What's your health question?"
                      value={questionTitle}
                      onChange={(e) => setQuestionTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q-desc" className="text-sm">
                      Description
                    </Label>
                    <Textarea
                      id="q-desc"
                      placeholder="Provide more details about your question..."
                      value={questionDesc}
                      onChange={(e) => setQuestionDesc(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowQuestionForm(false);
                        setQuestionTitle("");
                        setQuestionDesc("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      id="submit-question-btn"
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={handleSubmitQuestion}
                      disabled={
                        isSubmittingQuestion ||
                        !questionTitle.trim() ||
                        !questionDesc.trim()
                      }
                    >
                      {isSubmittingQuestion && (
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      )}
                      Post Question
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Questions List */}
          {loadingQuestions ? (
            <LoadingSkeleton variant="list" count={5} />
          ) : questions.length === 0 ? (
            <EmptyState
              icon={HelpCircle}
              title="No questions yet"
              description="Be the first to ask a health question!"
              actionLabel="Ask a Question"
              onAction={() => setShowQuestionForm(true)}
            />
          ) : (
            <div className="space-y-3 max-w-2xl">
              {questions.map((q) => {
                const isExpanded = expandedQuestionId === q.id;
                const questionAnswers = answers[q.id] || [];
                const isLoadingThisAnswers = loadingAnswers === q.id;

                return (
                  <Card
                    key={q.id}
                    className="border border-border shadow-sm overflow-hidden"
                  >
                    <CardContent className="p-0">
                      {/* Question Header */}
                      <button
                        className="w-full p-5 text-left hover:bg-muted/30 transition-colors"
                        onClick={() => handleToggleQuestion(q.id)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <h3 className="font-medium text-foreground text-sm">
                              {q.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {q.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                              <span>
                                Asked by {getDisplayName(qaNamesMap, q.userId)}
                              </span>
                              <span>
                                {new Date(q.createdAt).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="shrink-0 mt-1">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </button>

                      {/* Answers */}
                      {isExpanded && (
                        <div className="px-5 pb-5 space-y-3 border-t border-border pt-4">
                          {isLoadingThisAnswers ? (
                            <div className="flex items-center gap-2 py-3">
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              <span className="text-sm text-muted-foreground">
                                Loading answers...
                              </span>
                            </div>
                          ) : questionAnswers.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic py-2">
                              No answers yet. Be the first to help!
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {questionAnswers.map((ans) => (
                                <div
                                  key={ans.id}
                                  className="flex gap-3 p-3 rounded-lg bg-muted/30"
                                >
                                  <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-semibold text-blue-700 shrink-0">
                                    {getInitials(qaNamesMap, ans.userId)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-xs font-medium text-foreground">
                                        {getDisplayName(qaNamesMap, ans.userId)}
                                      </p>
                                      <span className="text-[10px] text-muted-foreground">
                                        {new Date(
                                          ans.createdAt
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {ans.answer}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <Separator />

                          {/* Add Answer */}
                          <div className="flex gap-2">
                            <Input
                              value={answerTexts[q.id] || ""}
                              onChange={(e) =>
                                setAnswerTexts((prev) => ({
                                  ...prev,
                                  [q.id]: e.target.value,
                                }))
                              }
                              placeholder="Write your answer..."
                              className="h-9 text-sm"
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleSubmitAnswer(q.id)
                              }
                            />
                            <Button
                              size="sm"
                              className="h-9 px-3 bg-primary hover:bg-primary/90 text-primary-foreground"
                              onClick={() => handleSubmitAnswer(q.id)}
                              disabled={
                                !answerTexts[q.id]?.trim() ||
                                isSubmittingAnswer === q.id
                              }
                            >
                              {isSubmittingAnswer === q.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Send className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
