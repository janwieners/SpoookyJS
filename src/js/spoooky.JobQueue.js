"use strict";

/**
 * Spoooky.JobQueue
 * Controller for Spoooky.Models.JobQueue
 * @param game
 * @constructor
 */
Spoooky.JobQueue = function(game) {

    var self_JobQueue = this,
        myGame = game;

    /**
     * Adds a job to the job queue
     */
    self_JobQueue.addJob = function(job) {

        var queue = myGame.models.JobQueue;

        if (_.isUndefined(queue[job.jobID])) {
            queue[job.jobID] = [];
        }

        queue[job.jobID][job.jobName] = job;
    };

    /**
     * Delets all job queue jobs
     */
    self_JobQueue.flush = function() {
        myGame.models.JobQueue.length = 0;
    };

    /**
     * Get a job for an associated move identifier
     * @param moveID
     * @returns {Array}
     */
    self_JobQueue.getJobsWithMoveID = function(moveID) {

        var jobs = [], queue = myGame.models.JobQueue[moveID];

        for (var job in queue) {
            jobs.push(queue[job]);
        }

        return jobs;
    }
};