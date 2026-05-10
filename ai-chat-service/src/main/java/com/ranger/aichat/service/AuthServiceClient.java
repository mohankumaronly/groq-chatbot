package com.ranger.aichat.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceClient {

    private final RestTemplate restTemplate;

    @Value("${auth.service.url:http://localhost:8080}")
    private String authServiceUrl;

    /**
     * Get user ID by email from auth service
     */
    public Long getUserIdByEmail(String email) {
        try {
            String url = authServiceUrl + "/api/users/by-email?email=" + email;

            UserResponse response = restTemplate.getForObject(url, UserResponse.class);

            if (response != null && response.getId() != null) {
                log.debug("Found user ID {} for email: {}", response.getId(), email);
                return response.getId();
            }

            return null;

        } catch (Exception e) {
            log.error("Failed to get user ID for email {}: {}", email, e.getMessage());
            return null;
        }
    }

    /**
     * Validate token with auth service (alternative to local validation)
     */
    public TokenValidationResponse validateTokenWithAuthService(String token) {
        try {
            String url = authServiceUrl + "/api/auth/validate";

            TokenValidationRequest request = new TokenValidationRequest(token);

            TokenValidationResponse response = restTemplate.postForObject(
                    url,
                    request,
                    TokenValidationResponse.class
            );

            return response;

        } catch (Exception e) {
            log.error("Failed to validate token with auth service: {}", e.getMessage());
            return null;
        }
    }

    // DTOs
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class TokenValidationRequest {
        private String token;
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class TokenValidationResponse {
        private boolean valid;
        private Long userId;
        private String email;
        private String role;
    }
}