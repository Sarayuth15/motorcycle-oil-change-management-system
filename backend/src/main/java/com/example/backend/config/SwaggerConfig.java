package com.example.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Motorcycle Oil Change Management API")
                        .description("API for tracking motorcycle oil change schedules and sending service reminders")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Oil Tracker Team")));
    }
}
