package com.ranger.aichat.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    // Cookie name for JWT token - matches your auth service
    private static final String JWT_COOKIE_NAME = "refreshToken";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Skip authentication for public endpoints
        String path = request.getRequestURI();
        if (path.equals("/api/chat/health") || path.equals("/actuator/health")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extract JWT token from cookie first, then header as fallback
            String token = extractTokenFromCookie(request);
            if (token == null) {
                token = extractTokenFromHeader(request);
            }

            if (token != null && jwtTokenProvider.validateToken(token)) {
                // Get email and userId from token
                String email = jwtTokenProvider.getEmailFromToken(token);
                Long userId = jwtTokenProvider.getUserIdFromToken(token);

                if (email != null && userId != null) {
                    // Create authentication object
                    UserDetails userDetails = User.builder()
                            .username(email)
                            .password("")
                            .authorities(Collections.emptyList())
                            .build();

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Set authentication in context
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    // Store user info in request attribute for controllers
                    request.setAttribute("userId", userId);
                    request.setAttribute("email", email);

                    log.debug("Authenticated user: {} (ID: {})", email, userId);
                }
            } else {
                if (token != null) {
                    log.warn("Invalid JWT token");
                }
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }

    /**
     * Extract JWT token from Cookie (refreshToken)
     */
    private String extractTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (JWT_COOKIE_NAME.equals(cookie.getName())) {
                    log.debug("JWT token found in cookie: {}", JWT_COOKIE_NAME);
                    return cookie.getValue();
                }
            }
        }

        return null;
    }

    /**
     * Extract JWT token from Authorization header (fallback for Postman)
     * Format: "Bearer <token>"
     */
    private String extractTokenFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            log.debug("JWT token found in Authorization header (fallback)");
            return bearerToken.substring(7);
        }

        return null;
    }
}