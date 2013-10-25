Ext.define('view.Metrics', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.metricsview',
    controller: 'controller.Metrics',
    inject: ['metricStore'],

    config: {
        metricStore: null
    },

    initComponent: function() {
        Ext.applyIf(this, {
            itemId: 'metricGrid',
            title: 'Build Metrics',
            store: this.metricStore,

            columns: [{
                header: 'Metric',
                dataIndex: 'description',
                width: '200px'
            },{
                header: 'Data',
                dataIndex: 'data',
                flex: 1
            }]
        });

        return this.callParent(arguments);
    }
});
