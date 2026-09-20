package com.workoutplanner.model;

public class Exercise {

    private String name;
    private int sets;
    private int reps;
    private double suggestedWeight;
    private double preferredWeight;
    private String comments;
    private String youtubeLink;

    public Exercise() {
    }

    public Exercise(
            String name,
            int sets,
            int reps,
            double suggestedWeight,
            double preferredWeight,
            String comments,
            String youtubeLink
    ) {
        this.name = name;
        this.sets = sets;
        this.reps = reps;
        this.suggestedWeight = suggestedWeight;
        this.preferredWeight = preferredWeight;
        this.comments = comments;
        this.youtubeLink = youtubeLink;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSets() {
        return sets;
    }

    public void setSets(int sets) {
        this.sets = sets;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    public double getSuggestedWeight() {
        return suggestedWeight;
    }

    public void setSuggestedWeight(double suggestedWeight) {
        this.suggestedWeight = suggestedWeight;
    }

    public double getPreferredWeight() {
        return preferredWeight;
    }

    public void setPreferredWeight(double preferredWeight) {
        this.preferredWeight = preferredWeight;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getYoutubeLink() {
        return youtubeLink;
    }

    public void setYoutubeLink(String youtubeLink) {
        this.youtubeLink = youtubeLink;
    }
}