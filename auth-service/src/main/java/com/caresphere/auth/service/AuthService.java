package com.caresphere.auth.service;

import com.caresphere.auth.dto.*;
import com.caresphere.auth.entity.User;
import com.caresphere.auth.exception.EmailAlreadyExistsException;
import com.caresphere.auth.exception.UserNotFoundException;
import com.caresphere.auth.kafka.AuthEventProducer;
import com.caresphere.auth.repository.UserRepository;
import com.caresphere.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthEventProducer authEventProducer;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .verified(false)
                .build();

        user = userRepository.save(user);

        authEventProducer.publishUserCreated(user);

        String token = jwtUtil.generateToken(user.getId(), user.getRole().name());
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRole().name());
        return new AuthResponse(token);
    }

    public UserResponse getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        return toUserResponse(user);
    }

    public UserResponse getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        return toUserResponse(user);
    }

    public List<UserResponse> getUsersByIds(List<UUID> ids) {
        List<User> users = userRepository.findAllByIdIn(ids);
        return users.stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse verifyUser(VerifyRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + request.getUserId()));

        user.setVerified(true);
        user = userRepository.save(user);

        authEventProducer.publishUserVerified(user);

        return toUserResponse(user);
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .verified(user.isVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
