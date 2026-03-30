package com.caresphere.gateway.filter;

import com.caresphere.gateway.config.JwtConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * Global gateway filter that enforces JWT-based authentication.
 * <p>
 * Public routes (e.g. /auth/register, /auth/login) are allowed through
 * without a token. All other requests must carry a valid Bearer token
 * in the Authorization header.
 * <p>
 * On successful validation the filter forwards the userId and role as
 * request headers so downstream services can use them without
 * re-parsing the token.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtConfig jwtConfig;

    /**
     * Paths that do not require authentication.
     */
    private static final List<String> PUBLIC_PATHS = List.of(
            "/auth/register",
            "/auth/login"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        // Allow public endpoints without authentication
        if (isPublicPath(path)) {
            return chain.filter(exchange);
        }

        // Allow CORS preflight requests
        if (request.getMethod().name().equals("OPTIONS")) {
            return chain.filter(exchange);
        }

        // Check for Authorization header
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Missing or invalid Authorization header for path: {}", path);
            return onUnauthorized(exchange);
        }

        // Extract and validate token
        String token = authHeader.substring(7);
        if (!jwtConfig.isTokenValid(token)) {
            log.warn("Invalid or expired JWT token for path: {}", path);
            return onUnauthorized(exchange);
        }

        // Extract user info from token and forward as headers
        String userId = jwtConfig.extractUserId(token);
        String role = jwtConfig.extractRole(token);

        log.debug("Authenticated request - userId: {}, role: {}, path: {}", userId, role, path);

        // Mutate request to include user information for downstream services
        ServerHttpRequest mutatedRequest = request.mutate()
                .header("X-User-Id", userId)
                .header("X-User-Role", role)
                .build();

        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    @Override
    public int getOrder() {
        return -1; // High priority — run before other filters
    }

    /**
     * Check if the request path is a public (unauthenticated) endpoint.
     */
    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    /**
     * Reject the request with HTTP 401 Unauthorized.
     */
    private Mono<Void> onUnauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
}
