Ext.define('controller.Metrics', {
    extend: 'Deft.mvc.ViewController',
    inject: ['metricStore', 'buildStore'],

    config: {
        metricStore: null,
        buildStore: null
    },

    observe: {
        buildStore: {
            load: 'onBuildStoreLoad'
        }
    },

    buildDefinitions: [
        // '/builddefinition/14104398785' // alm
        '/builddefinition/6880582633', // master-alm-continuous-java
        '/builddefinition/12178128372', // master-alm-continuous-guitest
        '/builddefinition/10399281081',  // master-alm-continuous-js-chrome
        '/builddefinition/10399281167', // master-alm-continuous-js-firefox
        '/builddefinition/4654068723' // master-flaky-finder-continuous
    ],

    metrics: [
        'metric.BuildsCounted',
        'metric.GreenTimePerDay',
        'metric.JobSuccessRate',
        'metric.NewestBuild',
        'metric.OldestBuild',
        'metric.RedToGreenTime',
        'metric.TimeSinceRed'
    ],

    init: function() {
        this.callParent(arguments);
        this.getView().setLoading(true);
        var buildStore = this.getBuildStore();
        buildStore.filter([
            this.filterByTime(),
            this.filterByBuildDefinition()
        ]);
    },

    filterByTime: function() {
        var startTime = Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, -14), 'Y-m-d');

        return Ext.create('Rally.data.QueryFilter', {
            property: 'Start',
            operator: '>',
            value: startTime
        })
    },

    filterByBuildDefinition: function() {
        return _.reduce(this.buildDefinitions, function(filter, buildDefinition) {
            var filterCondition = Ext.create('Rally.data.QueryFilter', {
                property: 'BuildDefinition',
                value: buildDefinition
            });
            return filter ? filter.or(filterCondition) : filterCondition;
        }, null);
    },

    onBuildStoreLoad: function(store, records, successful) {
        _.forEach(this.metrics, function(metric) {
            metric = Ext.create(metric, {buildDefinitions: this.buildDefinitions});
            metric.sample(records);

            this.getMetricStore().add(Ext.create('data.model.Metric', {
                description: metric.getDescription(),
                data: metric.calculate()
            }));
        }, this);

        this.getView().setLoading(false);
    }

});
