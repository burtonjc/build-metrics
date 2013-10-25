Ext.define('metric.RedToGreenTime', {
    extend: 'metric.AbstractMetric',

    description: 'When the light goes red, the average time before a green light is:',
    builds: {},
    diffs:[],

    constructor: function(config) {
        this.mergeConfig(config);
        this.callParent(arguments);
    },

    doSample: function(build) {
        var buildName = this.buildDefinitionNameFor(build);
        if(this.hasAllBuilds(this.builds)) {
            var previouslyPassing = this.allPassing(this.builds);
            this.builds[buildName] = build;
            if(this.hasPassed) {
                if(previouslyPassing && this.isFailing(build)) {
                    this.redStart = this.endTime(build);
                } else if(!previouslyPassing && this.allPassing(this.builds)) {
                    this.diffs.push(this.endTime(build) - this.redStart);
                }
            }
            if(previouslyPassing) { this.hasPassed = true; }
        }
        this.builds[buildName] = build;
    },

    calculate: function() {
        var count = this.diffs.length,
            average = 0;
        for(var i = 0; i < count; i++) {
            average += (this.diffs[i] / count);
        }
        return this.formatDiff(average) + " (there were " + count + " red lights in this data)";
    }

});
