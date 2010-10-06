Ext.ns("news");

Ext.regModel('TestModel', {
	fields     : [
        'company',
        'price',
        'change',
        'pct',
        'updated'
	]
});

Ext.regModel("Pages", {
	fields: [
		{name : "id"       },
		{name : "title"    },
		{name : "html"     },
		{name : "cmp"      }
	]
});

news.Structure = [{
	text : "Infinite Carousel demo",
	leaf : true,
	card : new Ext.ux.InfiniteCarousel({
		defaults : {
			cls : "demo-card"
		},
		store : new Ext.data.Store({
			model        : "Pages",
			filterOnLoad : false,
			proxy        : new Ext.data.AjaxProxy({
				url    : "results.php",
				reader : {
					type : "json"
				}
			})
		})
	})
}];

Ext.regModel('Demo', {
    fields: [
        {name: 'text',        type: 'string'},
        {name: 'source',      type: 'string'},
        {name: 'preventHide', type: 'boolean'},
        {name: 'animation'},
        {name: 'card'}
    ]
});

news.StructureStore = new Ext.data.TreeStore({
    model: 'Demo',
    root: {
        items: news.Structure
    },
    proxy: {
        type: 'ajax',
        reader: {
            type: 'tree',
            root: 'items'
        }
    }
});