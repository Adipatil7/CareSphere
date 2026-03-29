package com.caresphere.content.service;

import com.caresphere.content.dto.CreateCommentRequest;
import com.caresphere.content.dto.CreatePostRequest;
import com.caresphere.content.dto.ReactToPostRequest;
import com.caresphere.content.entity.Comment;
import com.caresphere.content.entity.Post;
import com.caresphere.content.entity.PostReaction;
import com.caresphere.content.exception.PostNotFoundException;
import com.caresphere.content.exception.UnauthorizedRoleException;
import com.caresphere.content.repository.CommentRepository;
import com.caresphere.content.repository.PostReactionRepository;
import com.caresphere.content.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private static final Set<String> ALLOWED_ROLES = Set.of("DOCTOR", "CHEMIST");

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PostReactionRepository postReactionRepository;

    @Transactional
    public Post createPost(CreatePostRequest request) {
        String role = request.getRole().toUpperCase();
        if (!ALLOWED_ROLES.contains(role)) {
            throw new UnauthorizedRoleException("Only DOCTOR or CHEMIST can create posts. Provided role: " + request.getRole());
        }

        Post post = Post.builder()
                .authorId(request.getAuthorId())
                .role(role)
                .category(request.getCategory())
                .title(request.getTitle())
                .content(request.getContent())
                .approved(false)
                .build();

        Post saved = postRepository.save(post);
        log.info("Post created with id: {} by {} (role: {})", saved.getId(), saved.getAuthorId(), saved.getRole());
        return saved;
    }

    public List<Post> getAllPosts(String category) {
        if (category != null && !category.isBlank()) {
            log.info("Fetching posts filtered by category: {}", category);
            return postRepository.findByCategoryIgnoreCaseOrderByCreatedAtDesc(category);
        }
        log.info("Fetching all posts");
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Comment addComment(UUID postId, CreateCommentRequest request) {
        if (!postRepository.existsById(postId)) {
            throw new PostNotFoundException("Post not found with id: " + postId);
        }

        Comment comment = Comment.builder()
                .postId(postId)
                .userId(request.getUserId())
                .text(request.getText())
                .build();

        Comment saved = commentRepository.save(comment);
        log.info("Comment added to post {} by user {}", postId, request.getUserId());
        return saved;
    }

    @Transactional
    public PostReaction reactToPost(UUID postId, ReactToPostRequest request) {
        if (!postRepository.existsById(postId)) {
            throw new PostNotFoundException("Post not found with id: " + postId);
        }

        Optional<PostReaction> existing = postReactionRepository.findByPostIdAndUserId(postId, request.getUserId());

        if (existing.isPresent()) {
            PostReaction reaction = existing.get();
            reaction.setReactionType(request.getReactionType());
            PostReaction updated = postReactionRepository.save(reaction);
            log.info("Reaction updated on post {} by user {}: {}", postId, request.getUserId(), request.getReactionType());
            return updated;
        }

        PostReaction reaction = PostReaction.builder()
                .postId(postId)
                .userId(request.getUserId())
                .reactionType(request.getReactionType())
                .build();

        PostReaction saved = postReactionRepository.save(reaction);
        log.info("Reaction added to post {} by user {}: {}", postId, request.getUserId(), request.getReactionType());
        return saved;
    }
}
