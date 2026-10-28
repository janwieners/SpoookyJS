// @ts-nocheck
import { Spoooky } from '../namespace';
import * as _ from 'underscore';


/**
 * Holds monte carlo tree search statistics
 * @type {Object}
 */
Spoooky.Statistics = {

    changed : false,
    AIplayers : [],

    /**
     * Add a log entry
     * @param metaAgentID
     * @param logType
     * @param round
     * @param value
     */
    logEntry : function(metaAgentID, logType, round, value) {

        // Add logging for a new meta agent
        if (_.isUndefined(this.AIplayers[metaAgentID])) {
            this.AIplayers[metaAgentID] = [];
        }

        if (_.isUndefined(this.AIplayers[metaAgentID][logType])) {
            this.AIplayers[metaAgentID][logType] = [];
        }

        this.AIplayers[metaAgentID][logType].push({
            "round" : round,
            "value" : value
        });

        this.changed = Date.now();
    },

    /**
     * Get a log entry of a specific type
     * @param metaAgentID
     * @param type
     */
    getEntriesOfType : function(metaAgentID, type) {

        if (_.isUndefined(this.AIplayers[metaAgentID])) { return false; }
        if (_.isUndefined(this.AIplayers[metaAgentID][type])) { return false; }

        return this.AIplayers[metaAgentID][type];
    }

};

/**
 * Holds the history of the game
 * @type {Object}
 */
Spoooky.GameProcess = {

    messages : [],
    messageID : 0,

    pushMessage : function(newMessage, messageType) {

        var type = messageType ? messageType : "none";

        // Show not only more than 200 messages
        if (this.messageID % 200 === 0) {
            this.messages.length = 0;
        }

        this.messageID += 1;
        this.messages.push({
            "message" : newMessage,
            "id" : this.messageID,
            "type" : type
        });
    }
};

/**
 * Holds the history of the game
 * @type {Object}
 */
Spoooky.AgentLog = {

    messages : [],
    messageID : 0,

    pushMessage : function(newMessage) {

        // Show not only more than 200 agent log messages
        if (this.messageID % 200 === 0) {
            this.messages.length = 0;
        }

        this.messageID += 1;
        this.messages.push({ message: newMessage, id: this.messageID });
    }
};
