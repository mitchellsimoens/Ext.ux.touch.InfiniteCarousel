/*
    Author       : Mitchell Simoens
    Site         : http://simoens.org/Sencha-Projects/demos/
    Contact Info : mitchellsimoens@gmail.com
    Purpose      : Creation of a Carousel to work with limited resources
	
	License      : GPL v3 (http://www.gnu.org/licenses/gpl.html)
    Warranty     : none
    Price        : free
    Version      : 1.2
    Date         : 10/06/2010
*/

Ext.ns("Ext.ux");

Ext.ux.InfiniteCarousel = Ext.extend(Ext.Carousel, {
	store              : null,
	initComponent      : function() {
		this.on("beforeshow", this.doRender, this);
		this.on("beforecardswitch", this.onBeforeCardSwitching, this);
		this.on("cardswitch", this.onCardSwitching, this);
		
		this.store.on("datachanged", this.onDataChange, this);
		
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
		if (this.ignoreRemove === true) {
			return ;
		}
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
	createCardCmp      : function(rec, recIndex) {
		var title = rec.get("title"),
			html  = rec.get("html"),
			defaultCmp = {
				xtype            : "component",
				title            : title,
				html             : html,
				styleHtmlContent : true,
				recIndex         : recIndex
			},
			cmp = eval(rec.get("cmp")),
			cmp = Ext.isArray(cmp) ? cmp[0] : defaultCmp;
		
		Ext.applyIf(cmp, {
			title    : title,
			recIndex : recIndex
		});
		
		return cmp;
	},
	createCards        : function(index) {
		var numGet = 3-this.items.items.length;
		var currCard = this.getActiveItem();
		var currIndex = (Ext.isDefined(currCard)) ? currCard.recIndex : -1;
		var multi = (index === 0) ? -1 : 1;
		for (var i = 1; i <= numGet; i++) {
			var rec = this.store.getAt(currIndex+(i*multi));
			if (this.fireEvent("beforecardcreate", this, rec) === false) {
				return ;
			}
			var recIndex = currIndex+(i*multi);
			var tmpCard = this.createCardCmp(rec, recIndex);
			var insertHere = (numGet > 1) ? i-1 : (this.getActiveIndex() > 0) ? 2 : 0;
			var card = this.cardCreate(tmpCard, insertHere);
			
			this.fireEvent("cardcreate", this, card, insertHere);
		}
	},
	cardCreate         : function(card, insertHere) {
		if (Ext.isDefined(card)) {
			var card = this.insert(insertHere, card);
			this.doLayout();
		}
		return card;
	},
	setCard            : function(index) {
		if (!Ext.isNumber(index)) {
			console.log("Must specify the index.");
			return ;
		}
		var currItem   = this.getActiveItem(),
			currIndex  = this.getActiveIndex(),
			difference = index-currItem.recIndex,
			remove     = [],
			add        = [],
			numRecs    = this.store.getCount(),
			focusIndex = index;
		
		if (difference === 0) {
			return ;
		}
		
		if (currIndex === 0) {
			remove.push(this.getComponent(1));
			remove.push(this.getComponent(2));
		} else if (currIndex === 3) {
			remove.push(this.getComponent(0));
			remove.push(this.getComponent(1));
		} else {
			remove.push(this.getComponent(0));
			remove.push(this.getComponent(2));
		}
		if (index === 0) {
			add[0] = this.store.getAt(index);
			add[1] = this.store.getAt(index+1);
			add[2] = this.store.getAt(index+2);
		} else if (index === (numRecs-1)) {
			add[0] = this.store.getAt(index-2);
			add[1] = this.store.getAt(index-1);
			add[2] = this.store.getAt(index);
			focusIndex = 2;
		} else {
			add[0] = this.store.getAt(index-1);
			add[1] = this.store.getAt(index);
			add[2] = this.store.getAt(index+1);
			focusIndex = 1;
		}
		
		for (var i = 0; i < remove.length; i++) {
			this.remove(remove[i]);
		}
		if (difference < 0) {
			for (var i = 0; i < add.length; i++) {
				if (this.fireEvent("beforecardcreate", this, add[i]) === false) {
					return ;
				}
				var recIndex = add[i].get("id")-1,
					tmpCard  = this.createCardCmp(add[i], recIndex),
					card     = this.cardCreate(tmpCard, i);
				this.fireEvent("cardcreate", this, card, i);
			}
			//go back
		} else if (difference > 0) {
			for (var i = 0; i < add.length; i++) {
				if (this.fireEvent("beforecardcreate", this, add[i]) === false) {
					return ;
				}
				var recIndex = add[i].get("id")-1,
					tmpCard  = this.createCardCmp(add[i], recIndex),
					card     = this.cardCreate(tmpCard, i);
				this.fireEvent("cardcreate", this, card, i);
			}
			//go forward
		}
		this.ignoreRemove = true;
		this.remove(currItem);
		this.doComponentLayout();
		this.layout.setActiveItem(focusIndex);
		this.ignoreRemove = false;
	}
});

Ext.reg("infinitecarousel", Ext.ux.InfiniteCarousel);