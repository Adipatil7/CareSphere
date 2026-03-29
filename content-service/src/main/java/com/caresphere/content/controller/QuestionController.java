package com.caresphere.content.controller;

import com.caresphere.content.dto.CreateAnswerRequest;
import com.caresphere.content.dto.CreateQuestionRequest;
import com.caresphere.content.entity.Answer;
import com.caresphere.content.entity.Question;
import com.caresphere.content.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<Question> createQuestion(@Valid @RequestBody CreateQuestionRequest request) {
        Question question = questionService.createQuestion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(question);
    }

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/{id}/answer")
    public ResponseEntity<Answer> addAnswer(
            @PathVariable UUID id,
            @Valid @RequestBody CreateAnswerRequest request) {
        Answer answer = questionService.addAnswer(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(answer);
    }

    @GetMapping("/{id}/answers")
    public ResponseEntity<List<Answer>> getAnswersForQuestion(@PathVariable UUID id) {
        List<Answer> answers = questionService.getAnswersForQuestion(id);
        return ResponseEntity.ok(answers);
    }
}
