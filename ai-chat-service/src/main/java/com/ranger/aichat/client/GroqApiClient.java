package com.ranger.aichat.client;

import com.ranger.aichat.dto.groq.GroqRequest;
import com.ranger.aichat.dto.groq.GroqResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "groq-api", url = "${groq.api.url}")
public interface GroqApiClient {

    @PostMapping("/chat/completions")
    GroqResponse sendMessage(
            @RequestHeader("Authorization") String authorization,
            @RequestBody GroqRequest request
    );
}