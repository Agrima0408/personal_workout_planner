package com.workoutplanner.service;

import com.workoutplanner.model.WorkoutLog;
import com.workoutplanner.repository.WorkoutLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class WorkoutLogService {

    private final WorkoutLogRepository workoutLogRepository;

    public WorkoutLogService(WorkoutLogRepository workoutLogRepository) {
        this.workoutLogRepository = workoutLogRepository;
    }

    public WorkoutLog createWorkoutLog(WorkoutLog workoutLog) {
        return workoutLogRepository.save(workoutLog);
    }

    public void deleteWorkoutLog(Long id) {
        workoutLogRepository.deleteById(id);
    }

    public List<WorkoutLog> getLogsBetween(
            LocalDate startDate,
            LocalDate endDate
    ) {
        return workoutLogRepository.findByDateBetween(startDate, endDate);
    }

    public List<WorkoutLog> getLogsForExercise(String exerciseName) {
        return workoutLogRepository.findByExerciseNameIgnoreCase(exerciseName);
    }

    public List<WorkoutLog> getAllLogs() {
        return workoutLogRepository.findAll();
    }

    public WorkoutLog updateWorkoutLog(Long id, WorkoutLog updatedLog) {

        WorkoutLog existingLog = workoutLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout log not found"));

        existingLog.setDate(updatedLog.getDate());
        existingLog.setExerciseName(updatedLog.getExerciseName());
        existingLog.setWeightUsed(updatedLog.getWeightUsed());
        existingLog.setRepsCompleted(updatedLog.getRepsCompleted());
        existingLog.setComments(updatedLog.getComments());

        return workoutLogRepository.save(existingLog);
    }
}