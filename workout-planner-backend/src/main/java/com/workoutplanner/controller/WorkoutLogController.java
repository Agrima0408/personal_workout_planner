package com.workoutplanner.controller;

import com.workoutplanner.model.WorkoutLog;
import com.workoutplanner.service.WorkoutLogService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/workout-logs")
@CrossOrigin(origins = "*")
public class WorkoutLogController {

    private final WorkoutLogService workoutLogService;

    public WorkoutLogController(WorkoutLogService workoutLogService) {
        this.workoutLogService = workoutLogService;
    }

    @PostMapping
    public WorkoutLog createWorkoutLog(@RequestBody WorkoutLog workoutLog) {
        return workoutLogService.createWorkoutLog(workoutLog);
    }

    @GetMapping
    public List<WorkoutLog> getAllLogs() {
        return workoutLogService.getAllLogs();
    }

    @GetMapping("/range")
    public List<WorkoutLog> getLogsBetween(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {
        return workoutLogService.getLogsBetween(startDate, endDate);
    }

    @GetMapping("/exercise/{exerciseName}")
    public List<WorkoutLog> getLogsForExercise(
            @PathVariable String exerciseName
    ) {
        return workoutLogService.getLogsForExercise(exerciseName);
    }

    @DeleteMapping("/{id}")
    public void deleteWorkoutLog(@PathVariable Long id) {
        workoutLogService.deleteWorkoutLog(id);
    }

    @PutMapping("/{id}")
    public WorkoutLog updateWorkoutLog(
            @PathVariable Long id,
            @RequestBody WorkoutLog workoutLog
    ) {
        return workoutLogService.updateWorkoutLog(id, workoutLog);
    }
}