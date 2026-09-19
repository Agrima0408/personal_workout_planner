package com.workoutplanner.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WorkoutController {

    @GetMapping("/api/test")
    public String test() {
        return "Workout Planner Backend is working!";
    }
}