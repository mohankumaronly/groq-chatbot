package com.ranger.aichat.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    private Key signingKey;

    // Cache for email -> userId mapping (temporary solution)
    // TODO: Replace with database or auth service call
    private final ConcurrentHashMap<String, Long> emailToUserIdCache = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        // Use the same signing method as auth service
        byte[] keyBytes = secretKey.getBytes();
        if (keyBytes.length < 32) {
            log.warn("JWT secret key is less than 32 characters. Padding to 32 chars.");
            byte[] paddedKey = new byte[32];
            System.arraycopy(keyBytes, 0, paddedKey, 0, Math.min(keyBytes.length, 32));
            this.signingKey = Keys.hmacShaKeyFor(paddedKey);
        } else {
            this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        }
        log.info("JWT Token Provider initialized");

        // Initialize cache with some test users (remove in production)
        emailToUserIdCache.put("test@example.com", 1L);
    }

    /**
     * Extract email from JWT token (subject contains email)
     */
    public String getEmailFromToken(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Get user ID from email (via cache or auth service)
     */
    public Long getUserIdFromToken(String token) {
        String email = getEmailFromToken(token);
        if (email == null) {
            log.error("No email found in token");
            return null;
        }

        // Try to get from cache
        Long userId = emailToUserIdCache.get(email);

        if (userId != null) {
            return userId;
        }

        // TODO: Call auth service to get user by email
        // For now, generate a deterministic ID from email hash
        userId = (long) Math.abs(email.hashCode());
        emailToUserIdCache.put(email, userId);

        log.info("Mapped email {} to userId {}", email, userId);
        return userId;
    }

    /**
     * Validate JWT token (matching auth service validation)
     */
    public boolean validateToken(String token) {
        if (token == null) {
            return false;
        }

        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            log.error("JWT token validation failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Extract specific claim from token
     */
    private <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extract all claims from token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Check if token is expired
     */
    public boolean isTokenExpired(String token) {
        Date expiration = extractClaim(token, Claims::getExpiration);
        return expiration.before(new Date());
    }

    /**
     * Get expiration date from token
     */
    public Date getExpirationDate(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}