Ext.regModel("Articles", {
	fields: [
		{name : "title"},
		{name : "description"},
		{name : "link"},
		{name : "rendered"}
	]
});

Ext.ns("Ext.InfiniteCarousel");

Ext.InfiniteCarousel = Ext.extend(Ext.Carousel, {
	store              : null,
	initComponent      : function() {
		this.store  = new Ext.data.Store({
			model        : "Articles",
			filterOnLoad : false,
			proxy        : new Ext.data.AjaxProxy({
				url    : this.store.url,
				reader : {
					type : "json",
					root : "items"
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
		
		Ext.InfiniteCarousel.superclass.initComponent.apply(this);
	},
	doRender           : function() {
		this.store.load();
	},
	onDataChange       : function() {
		if (this.items.items.length < 3) {
			this.createCardsNext();
		}
	},
	getStore           : function() {
		return this.store;
	},
	getRendered        : function() {
		return this.items.items;
	},
	onBeforeCardSwitching : function(carousel, newCard, oldCard, index, anim) {
		if (index > 1) {
			var num = carousel.store.getCount();
			if (this.items.items[index].recIndex < (num-1)) {
				this.removeCard(this.items.items[0]);
			}
		} else if (index === 0) {
			if (this.items.items[index].recIndex > 0) { 
				this.removeCard(this.items.items[2]);
			}
		}
	},
	onCardSwitching    : function(carousel, newCard, oldCard, index, anim) {
		if (index === 0) {
			this.createCardsPrev();
		} else {
			var numRecords = this.store.getCount();
			if (index < numRecords) {
				this.createCardsNext();
			}
		}
	},
	removeCard         : function(card) {
		this.remove(card);
	},
	createCardsPrev    : function() {
		var numGet = 3-this.items.items.length;
		var currCard = this.getActiveItem();
		var currIndex = currCard.recIndex;
		for (var i = 1; i <= numGet; i++) {
			var rec = this.store.getAt(currIndex-i);
			var tmpCard = {
				title    : rec.get("title"),
				html     : rec.get("description"),
				recIndex : currIndex-i
			}
			this.CardCreatePrev(tmpCard);
		}
	},
	createCardsNext    : function(index) {
		var numGet = 3-this.items.items.length;
		var currCard = this.getActiveItem();
		var currIndex = null;
		if (Ext.isDefined(currCard)) {
			currIndex = currCard.recIndex;
		} else {
			currIndex = -1;
		}
		for (var i = 1; i <= numGet; i++) {
			var rec = this.store.getAt(currIndex+i);
			var tmpCard = {
				title    : rec.get("title"),
				html     : rec.get("description"),
				recIndex : currIndex+i
			}
			this.CardCreateNext(tmpCard);
		}
	},
	CardCreatePrev   : function(card) {
		if (Ext.isDefined(card)) {
			this.insert(0, card);
			this.doLayout();
		}
	},
	CardCreateNext   : function(card) {
		if (Ext.isDefined(card)) {
			this.add(card);
			this.doLayout();
		}
	}
});

Ext.reg("infinitecarousel", Ext.InfiniteCarousel);