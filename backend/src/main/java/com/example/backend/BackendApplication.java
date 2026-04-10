package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * @SpringBootApplication:
 * EN: Marks this as the main configuration class and enables auto-configuration.
 * KH: សម្គាល់ថានេះជាថ្នាក់កំណត់រចនាសម្ព័ន្ធចម្បង និងបើកដំណើរការការកំណត់ស្វ័យប្រវត្តិ
 * * @EnableScheduling:
 * EN: Allows the app to run background tasks (cron jobs) using @Scheduled.
 * KH: អនុញ្ញាតឱ្យកម្មវិធីដំណើរការភារកិច្ចនៅផ្ទៃខាងក្រោយ (background tasks)
 */
@SpringBootApplication
@EnableScheduling
@EnableAsync
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
}
