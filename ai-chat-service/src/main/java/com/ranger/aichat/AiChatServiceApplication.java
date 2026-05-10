package com.ranger.aichat;

import com.ranger.aichat.config.DotenvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class AiChatServiceApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(AiChatServiceApplication.class);
		app.addInitializers(new DotenvConfig());
		app.run(args);
	}
}