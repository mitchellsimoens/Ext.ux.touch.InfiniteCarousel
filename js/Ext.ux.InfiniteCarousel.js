Ext.regModel("Articles", {
	fields: [
		{name : "title"},
		{name : "description"},
		{name : "link"},
		{name : "rendered"}
	]
});

Ext.ns("Ext.ux");

Ext.ux.InfiniteCarousel = Ext.extend(Ext.Carousel, {
	store              : null,
	initComponent      : function() {
		this.store  = new Ext.data.Store({
			model        : "Articles",
			filterOnLoad : false,
			proxy        : new Ext.data.AjaxProxy({
				url    : this.store.url,
				reader : {
					type : "json"
				}
			})
		});
		
		this.on({
			beforeshow       : {
				scope : this,
				fn    : this.doRender
			},
			beforecardswitch : {
				scope : this,
				fn    : this.onBeforeCardSwitching
			},
			cardswitch       : {
				scope : this,
				fn    : this.onCardSwitching
			}
		});
		
		this.store.on({
			datachanged : {
				scope : this,
				fn    : this.onDataChange
			}
		});
		
		Ext.ux.InfiniteCarousel.superclass.initComponent.apply(this);
	},
	doRender           : function() {
		this.store.load();
	},
	onDataChange       : function() {
		if (this.items.items.length < 3) {
			this.createCards(-1);
		}
	},
	getStore           : function() {
		return this.store;
	},
	getRendered        : function() {
		return this.items.items;
	},
	onBeforeCardSwitching : function(carousel, newCard, oldCard, index, anim) {
		var card;
		if (index > 1) {
			var num = carousel.store.getCount();
			if (this.items.items[index].recIndex < (num-1)) {
				card = this.items.items[0];
			}
		} else if (index === 0) {
			if (this.items.items[index].recIndex > 0) {
				card = this.items.items[2];
			}
		}
		this.removeCard(card);
	},
	onCardSwitching    : function(carousel, newCard, oldCard, index, anim) {
		this.createCards(index);
	},
	removeCard         : function(card) {
		this.remove(card);
	},
	createCards        : function(index) {
		var numGet = 3-this.items.items.length;
		var currCard = this.getActiveItem();
		var currIndex = (Ext.isDefined(currCard)) ? currCard.recIndex : -1;
		var multi = (index === 0) ? -1 : 1;
		for (var i = 1; i <= numGet; i++) {
			var rec = this.store.getAt(currIndex+(i*multi));
			var tmpCard = {
				title    : rec.get("title"),
				html     : rec.get("description"),
				styleHtmlContent : true,
				recIndex : currIndex+(i*multi)
			}
			var insertHere = (numGet > 1) ? i-1 : (this.getActiveIndex() > 0) ? 2 : 0;
			this.cardCreate(tmpCard, insertHere);
		}
	},
	cardCreate         : function(card, insertHere) {
		if (Ext.isDefined(card)) {
			this.insert(insertHere, card);
			this.doLayout();
		}
	}
});

Ext.reg("infinitecarousel", Ext.ux.InfiniteCarousel);