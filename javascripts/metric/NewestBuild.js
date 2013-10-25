Ext.define('metric.NewestBuild', {
    extend: 'metric.AbstractMetric',

    description: 'The newest build in these metrics is: ',

    doSample: function(build) {
        //sorted oldest to newest, so last one will be the newest
        this.newest = build;
    },

    calculate: function() {
        var build = this.newest;
        return this.buildDefinitionNameFor(build) + " " + build.get('Number') + " (Started " + new Date(this.startTime(build)).toString() + ")";
    }

});
