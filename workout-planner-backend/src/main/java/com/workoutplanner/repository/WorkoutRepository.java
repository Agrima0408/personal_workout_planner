package com.workoutplanner.repository;

import com.workoutplanner.model.Workout;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class WorkoutRepository {

    private final List<Workout> workouts = new ArrayList<>();

    public List<Workout> findAll() {
        return workouts;
    }

    public Workout findByDay(String day) {
        return workouts.stream()
                .filter(workout -> workout.getDay().equalsIgnoreCase(day))
                .findFirst()
                .orElse(null);
    }

    public Workout save(Workout workout) {
        workouts.add(workout);
        return workout;
    }
}