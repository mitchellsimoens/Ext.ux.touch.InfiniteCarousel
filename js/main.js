Ext.setup({
	onReady: function() {
		Ext.regModel("Pages", {
			fields: [
				{name : "id"       },
				{name : "title"    },
				{name : "html"     },
				{name : "cmp"      }
			]
		});
		Ext.regModel('TestModel', {
			fields     : [
				'company',
				'price',
				'change',
				'pct',
				'updated'
			]
		});

		new Ext.ux.InfiniteCarousel({
			fullscreen : true,
			defaults : {
				cls : "demo-card"
			},
			store : new Ext.data.Store({
				model        : "Pages",
				autoLoad     : true,
				proxy        : {
					type   : "ajax",
					url    : "results.php",
					reader : {
						type : "json",
						root : "cards"
					}
				}
			})
		})
	}
});