package com.ranger.aichat.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class DotenvConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ConfigurableEnvironment environment = applicationContext.getEnvironment();

        try {
            // Load .env file from root directory
            Dotenv dotenv = Dotenv.configure()
                    .directory("./")  // project root
                    .ignoreIfMissing()  // don't fail if .env doesn't exist
                    .load();

            Map<String, Object> envMap = new HashMap<>();

            // Load all environment variables
            dotenv.entries().forEach(entry -> {
                envMap.put(entry.getKey(), entry.getValue());
                System.setProperty(entry.getKey(), entry.getValue());
                System.out.println("📦 Loaded env: " + entry.getKey() + "=" + maskValue(entry.getKey(), entry.getValue()));
            });

            // Add to Spring environment
            MapPropertySource propertySource = new MapPropertySource("dotenvProperties", envMap);
            environment.getPropertySources().addFirst(propertySource);

            System.out.println("✅ .env file loaded successfully");
            System.out.println("🚀 Server will run on port: " + System.getProperty("SERVER_PORT", "8080 (default)"));

        } catch (Exception e) {
            System.err.println("⚠️ Could not load .env file: " + e.getMessage());
            System.err.println("Make sure .env file exists in project root directory");
        }
    }

    private String maskValue(String key, String value) {
        if (key.contains("KEY") || key.contains("PASSWORD") || key.contains("SECRET")) {
            if (value != null && value.length() > 8) {
                return value.substring(0, 4) + "****" + value.substring(value.length() - 4);
            }
            return "****";
        }
        return value;
    }
}