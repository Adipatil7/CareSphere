package com.caresphere.content.service;

import com.caresphere.content.dto.CreateAnswerRequest;
import com.caresphere.content.dto.CreateQuestionRequest;
import com.caresphere.content.entity.Answer;
import com.caresphere.content.entity.Question;
import com.caresphere.content.exception.QuestionNotFoundException;
import com.caresphere.content.repository.AnswerRepository;
import com.caresphere.content.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    @Transactional
    public Question createQuestion(CreateQuestionRequest request) {
        Question question = Question.builder()
                .userId(request.getUserId())
                .title(request.getTitle())
                .description(request.getDescription())
                .build();

        Question saved = questionRepository.save(question);
        log.info("Question created with id: {} by user {}", saved.getId(), saved.getUserId());
        return saved;
    }

    public List<Question> getAllQuestions() {
        log.info("Fetching all questions");
        return questionRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Answer addAnswer(UUID questionId, CreateAnswerRequest request) {
        if (!questionRepository.existsById(questionId)) {
            throw new QuestionNotFoundException("Question not found with id: " + questionId);
        }

        Answer answer = Answer.builder()
                .questionId(questionId)
                .userId(request.getUserId())
                .answer(request.getAnswer())
                .build();

        Answer saved = answerRepository.save(answer);
        log.info("Answer added to question {} by user {}", questionId, request.getUserId());
        return saved;
    }

    public List<Answer> getAnswersForQuestion(UUID questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new QuestionNotFoundException("Question not found with id: " + questionId);
        }

        log.info("Fetching answers for question {}", questionId);
        return answerRepository.findByQuestionIdOrderByCreatedAtDesc(questionId);
    }
}
