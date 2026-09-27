package com.workoutplanner.repository;

import com.workoutplanner.model.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Long> {

    List<WorkoutLog> findByDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );

    List<WorkoutLog> findByExerciseNameIgnoreCase(String exerciseName);
}