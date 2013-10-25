Ext.define('metric.AbstractMetric', {

    config: {
        builds: {},
        buildDefinitions: []
    },

    sample: function(builds) {
        _.forEach(builds, this.doSample, this);
    },

    doSample: function(build) {
        throw new Ext.Error(this.$className + "#doSample() must be implemented!");
    },

    calculate: function() {
        throw new Ext.Error(this.$className + "#calculate() must be implemented!");
    },

    getDescription: function() {
        if (this.description) {
            return this.description;
        } else {
            throw new Ext.Error(this.$className + "#description must not be null");
        }
    },

    buildDefinitionNameFor: function(build) {
        return build.get('BuildDefinition')._refObjectName;
    },

    startTime: function(build) {
        var buildTime = Date.parse(build.get('Start'));
        var correctedTime = buildTime + (new Date().getTimezoneOffset()*60*1000);
        return correctedTime;
    },

    endTime: function(build) {
        return this.startTime(build) + (build.get('Duration') * 1000);
    },

    isPassing: function(build) {
        return build && build.get('Status') === 'SUCCESS';
    },

    isFailing: function(build) {
        return !this.isPassing(build);
    },

    pluralize: function(val, num) {
        if(num != 1) { val += 's'; }
        return ' ' + num + ' ' + val;
    },

    formatDiff: function(diff) {
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
        var minutes = Math.floor(diff / (1000 * 60)) % 60;
        var result = '';
        result += (days > 0) ? this.pluralize('day', days) + ", " : "";
        result += (hours > 0) ? this.pluralize('hour', hours) + ", " : "";
        result += (minutes > 0) ? this.pluralize('minute', minutes) : "";
        return result;
    },

    values: function(builds, callback) {
        var results = [];
        for(buildName in builds) {
            var build = builds[buildName];
            results.push(callback(build));
        }
        return results;
    },

    allPassing: function(builds) {
      return Math.min.apply(this, this.values(builds, this.isPassing));
    },

    hasAllBuilds: function(builds) {
        var statusArray = this.values(builds, this.isPassing);
        return statusArray.length == this.getBuildDefinitions().length;
    }

});
