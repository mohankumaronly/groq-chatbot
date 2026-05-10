package com.ranger.aichat.util;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class UserContextHolder {

    private static final ThreadLocal<Long> currentUserId = new ThreadLocal<>();
    private static final ThreadLocal<String> currentUserEmail = new ThreadLocal<>();

    public static void setCurrentUserId(Long userId) {
        currentUserId.set(userId);
    }

    public static Long getCurrentUserId() {
        Long userId = currentUserId.get();

        // Fallback: try to get from request attribute
        if (userId == null) {
            try {
                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attributes != null) {
                    userId = (Long) attributes.getRequest().getAttribute("userId");
                }
            } catch (Exception e) {
                // Ignore
            }
        }

        return userId != null ? userId : 1L; // Temporary fallback to 1 for testing
    }

    public static void setCurrentUserEmail(String email) {
        currentUserEmail.set(email);
    }

    public static String getCurrentUserEmail() {
        String email = currentUserEmail.get();

        if (email == null) {
            try {
                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attributes != null) {
                    email = (String) attributes.getRequest().getAttribute("email");
                }
            } catch (Exception e) {
                // Ignore
            }
        }

        return email;
    }

    public static void clear() {
        currentUserId.remove();
        currentUserEmail.remove();
    }
}