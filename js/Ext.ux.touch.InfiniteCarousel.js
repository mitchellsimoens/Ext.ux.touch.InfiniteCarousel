Ext.ns("Ext.ux.touch");

Ext.ux.touch.InfiniteCarousel = Ext.extend(Ext.Carousel, {
	numCards    : 5,
	allowBridge : true,

	initComponent: function() {
		var me = this;

		me.on(       "beforecardswitch", me.onBeforeCardSwitching, me );
		me.on(       "cardswitch",       me.onCardSwitching,       me );
		me.store.on( "datachanged",      me.onDataChanged,         me );

		Ext.ux.touch.InfiniteCarousel.superclass.initComponent.apply(me);

		if (me.store.getCount() > 0) {
			me.onDataChanged();
		}
	},

	getStore: function() {
		var me = this;

		return me.store;
	},

	onDataChanged: function() {
		var me = this;

		me.createCards(0, true);
	},

	onCardSwitching    : function(me, newCard, oldCard, index, anim) {
		var newIndex = newCard.recIndex,
			oldIndex = oldCard.recIndex,
			append   = newIndex > oldIndex;

		if (append) {
			startIndex = me.items.get(me.items.getCount() -1).recIndex + 1;
		} else {
			startIndex = me.items.get(0).recIndex - 1;
		}

		me.createCards(startIndex, append);
	},

	onBeforeCardSwitching : function(me, newCard, oldCard, newIndex) {
		var middleIndex = Math.ceil(me.numCards / 2) - 1,
			currIndex   = me.getActiveIndex();

		if (currIndex !== middleIndex) {
			return true;
		}

		var end       = newCard.recIndex > oldCard.recIndex,
			lastCard  = me.getComponent(me.items.getCount() - 1);

		if (end) {
			var store     = me.getStore(),
				num       = store.getCount(),
				firstCard = me.getComponent(0);

			if (lastCard.recIndex === (num - 1)) { return true; }

			card = firstCard;
		} else {
			var newCard = me.getComponent(newIndex);

			if (newCard.recIndex < middleIndex) { return true; }

			card = lastCard;
		}

		if (typeof card === "object") {
			me.removeCard(me, card);
		}
	},

	removeCard         : function(me, card) {
		me.remove(card);
	},

	createCards: function(startIndex, append) {
		var me       = this,
			store    = me.getStore(),
			currNum  = (Ext.isDefined(me.items)) ? me.items.getCount() : 0,
			numGet   = me.numCards - currNum,
			endIndex = startIndex + numGet - 1,
			recs     = store.getRange(startIndex, endIndex),
			i        = 0,
			rec, recIndex, tmpCard;

		if (store.getCount() < endIndex) {
			return false;
		}

		for (; i < numGet; i++) {
			rec = recs[i];
			recIndex = store.indexOf(rec);

			if (!me.fireEvent("beforecardcreate", me, rec, recIndex)) { return false; }

			tmpCard = me.createCardCmp(rec, recIndex);
			tmpCard = me.cardCreate(tmpCard, append);

			me.fireEvent("cardcreate", me, tmpCard, rec, recIndex);
		}
	},

	createCardCmp      : function(rec, recIndex) {
		var title      = rec.get("title"),
			html       = rec.get("html"),
			defaultCmp = {
				xtype            : "component",
				title            : title,
				html             : html,
				styleHtmlContent : true,
				recIndex         : recIndex
			},
			cmp        = eval(rec.get("cmp")),
			cmp        = Ext.isArray(cmp) ? cmp[0] : defaultCmp;

		Ext.applyIf(cmp, {
			title    : title,
			recIndex : recIndex
		});

		return cmp;
	},

	cardCreate: function(card, append) {
		var me = this,
			card;

		if (append) {
			card = me.add(card);
		} else {
			card = me.insert(0, card);
		}

		me.doLayout();

		return card;
	}
});

Ext.reg("infinitecarousel", Ext.ux.touch.InfiniteCarousel);