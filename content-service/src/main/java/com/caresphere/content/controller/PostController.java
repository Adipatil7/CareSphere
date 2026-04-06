package com.caresphere.content.controller;

import com.caresphere.content.dto.CreateCommentRequest;
import com.caresphere.content.dto.CreatePostRequest;
import com.caresphere.content.dto.ReactToPostRequest;
import com.caresphere.content.entity.Comment;
import com.caresphere.content.entity.Post;
import com.caresphere.content.entity.PostReaction;
import com.caresphere.content.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/content/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<Post> createPost(@Valid @RequestBody CreatePostRequest request) {
        Post post = postService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts(
            @RequestParam(required = false) String category) {
        List<Post> posts = postService.getAllPosts(category);
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/{id}/comment")
    public ResponseEntity<Comment> addComment(
            @PathVariable UUID id,
            @Valid @RequestBody CreateCommentRequest request) {
        Comment comment = postService.addComment(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @PostMapping("/{id}/react")
    public ResponseEntity<PostReaction> reactToPost(
            @PathVariable UUID id,
            @Valid @RequestBody ReactToPostRequest request) {
        PostReaction reaction = postService.reactToPost(id, request);
        return ResponseEntity.ok(reaction);
    }
}
