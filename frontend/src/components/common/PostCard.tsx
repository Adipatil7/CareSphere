"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { Post, Comment } from "@/types";
import { useUserNames, getDisplayName, getInitials } from "@/hooks/useUserNames";
import { ThumbsUp, HeartHandshake, MessageCircle, Send, Loader2 } from "lucide-react";

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onReact: (postId: string, type: "LIKE" | "HELPFUL") => Promise<void>;
  onComment: (postId: string, text: string) => Promise<void>;
}

export function PostCard({ post, currentUserId, onReact, onComment }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isReacting, setIsReacting] = useState<string | null>(null);
  const [isCommenting, setIsCommenting] = useState(false);

  // Collect all user IDs from post author + comment authors
  const allUserIds = useMemo(() => {
    const ids = [post.authorId];
    if (post.comments) {
      post.comments.forEach((c) => ids.push(c.userId));
    }
    return ids;
  }, [post.authorId, post.comments]);

  const namesMap = useUserNames(allUserIds);

  const likeCount = post.reactions?.filter((r) => r.reactionType === "LIKE").length ?? 0;
  const helpfulCount = post.reactions?.filter((r) => r.reactionType === "HELPFUL").length ?? 0;
  const commentCount = post.comments?.length ?? 0;

  const handleReact = async (type: "LIKE" | "HELPFUL") => {
    setIsReacting(type);
    try {
      await onReact(post.id, type);
    } finally {
      setIsReacting(null);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setIsCommenting(true);
    try {
      await onComment(post.id, commentText);
      setCommentText("");
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
              {getInitials(namesMap, post.authorId)}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {getDisplayName(namesMap, post.authorId)}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            {post.category}
          </Badge>
        </div>

        {/* Content */}
        <h3 className="font-semibold text-foreground mb-1">{post.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-blue-600 h-8 px-2.5"
            onClick={() => handleReact("LIKE")}
            disabled={isReacting !== null}
          >
            {isReacting === "LIKE" ? (
              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
            ) : (
              <ThumbsUp className="h-3.5 w-3.5 mr-1" />
            )}
            {likeCount > 0 && likeCount}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-emerald-600 h-8 px-2.5"
            onClick={() => handleReact("HELPFUL")}
            disabled={isReacting !== null}
          >
            {isReacting === "HELPFUL" ? (
              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
            ) : (
              <HeartHandshake className="h-3.5 w-3.5 mr-1" />
            )}
            {helpfulCount > 0 && helpfulCount}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground h-8 px-2.5"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-3.5 w-3.5 mr-1" />
            {commentCount > 0 && commentCount}
          </Button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-3 space-y-3">
            <Separator />
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                {post.comments.map((c: Comment) => (
                  <div key={c.id} className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-500 shrink-0 mt-0.5">
                      {getInitials(namesMap, c.userId)}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{getDisplayName(namesMap, c.userId)}</p>
                      <p className="text-sm text-muted-foreground">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">No comments yet</p>
            )}
            <div className="flex gap-2">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="h-8 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
              />
              <Button
                size="sm"
                onClick={handleComment}
                disabled={!commentText.trim() || isCommenting}
                className="h-8 px-3 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isCommenting ? (
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
}
