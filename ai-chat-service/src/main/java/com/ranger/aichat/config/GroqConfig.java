package com.ranger.aichat.config;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Data
@Configuration
@ConfigurationProperties(prefix = "groq.api")
public class GroqConfig {

    private String key;
    private String url;
    private String model;

    // No @Bean method - use default configuration
}