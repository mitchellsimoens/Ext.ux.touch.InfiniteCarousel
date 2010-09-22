Ext.ns("news");

news.Structure = [{
	text : "Infinite Carousel demo",
	leaf : true,
	card : new Ext.ux.InfiniteCarousel({
		store : {
			url : "results.php"
		}
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