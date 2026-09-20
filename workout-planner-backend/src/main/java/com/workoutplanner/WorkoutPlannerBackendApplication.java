package com.workoutplanner;

import com.workoutplanner.service.WorkoutService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class WorkoutPlannerBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(WorkoutPlannerBackendApplication.class, args);
	}

	@Bean
	CommandLineRunner loadWorkouts(WorkoutService workoutService) {
		return args -> workoutService.loadDefaultWorkouts();
	}
}