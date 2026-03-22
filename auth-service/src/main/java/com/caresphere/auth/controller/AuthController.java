package com.caresphere.auth.controller;

import com.caresphere.auth.dto.*;
import com.caresphere.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        UserResponse response = authService.getCurrentUser(userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<UserResponse> verifyUser(@Valid @RequestBody VerifyRequest request) {
        UserResponse response = authService.verifyUser(request);
        return ResponseEntity.ok(response);
    }
}
