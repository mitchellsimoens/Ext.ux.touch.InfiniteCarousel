Ext.ns('Ext.ux.touch');

Ext.ux.touch.InfiniteCarousel = Ext.extend(Ext.Carousel, {
    // @private
    // Keeps track of the current page
    activePage : 0,
    /**
     * @cfg {Boolean} allowWrap
     * Allow to wrap around when at end or beginning
     * default: true
     */
    allowWrap  : true,
    /**
     * @cfg {String} cmpField
     * Field in Model to use to get Component configuration
     * Default: 'cmp'
     */
    cmpField   : 'cmp',
    /**
     * @cfg {Number} numPages
     * Number of pages to show at one time.
     * Default: 3
     */
    numPages   : 3,

    //in case xtype is not specified in cmpField of Model instance
    defaultType : 'panel',

    // @private
    initComponent: function() {
        var me       = this,
            store    = me.store,
            i        = 0,
            numPages = me.numPages;

        if (numPages % 2 === 0) {
            console.log('numPages is set to an even number. This extension works better if you specify an odd number. Will subtract 1.');
            me.numPages--;
        }

        if (store.getCount() > 0) {
            me.items = me.buildItems();
        } else {
            store.on('datachanged', me.handleStoreDataChanged, me);
        }

        //Iterates through the items to find item that is marked to start active.
        //This is because if you set activeItem to something other than 0, it will start on that item
        Ext.iterate(me.items, function(item) {
            if (item.makeActive) {
                me.activeItem = i;                                      //make this item active
            }
            delete item.makeActive;                                     //remove unneeded property on Component
            i++;
        });

        Ext.ux.touch.InfiniteCarousel.superclass.initComponent.call(me);
    },

    handleStoreDataChanged: function(store) {
        var me = this,
            i  = 0;

        me.removeAll();

        var items = me.buildItems();
        me.add(items);
        me.doLayout();

        me.items.each(function(item) {
            if (item.makeActive) {
                me.setActiveItem(item);                                 //make this item active
            }
            delete item.makeActive;                                     //remove unneeded property on Component
            i++;
        });
    },

    // @private
    // function to build initial items
    buildItems: function() {
        var me          = this,
            activePage  = me.activePage,
            allowWrap   = me.allowWrap,
            numPages    = me.numPages,
            sideNum     = Math.floor(numPages / 2),                     //number of items to try and get on each side of the middle item
            store       = me.store,
            startRec    = store.getAt(activePage),                      //gets the Model instance based on activePage config
            startIdx    = store.indexOf(startRec),                      //gets the index of the start item's Model instance
            totalNum    = store.getCount(),
            endIdx      = totalNum - 1,
            forwardNum  = allowWrap ? sideNum : sideNum * 2,            //number of items to get after start item
            backwardNum = allowWrap ? sideNum : sideNum * 2,            //number of items to get before start item
            items       = [],
            f           = 1,                                            //counter for forward num
            b           = 1,                                            //counter for backward num
            fidx, bidx, rec;

        items.push(me.buildPage(startRec, true));                       //build the start page

        for (; f <= forwardNum; f++) {                                  //loop number of items to go after the start item
            fidx = startIdx + f;                                        //index of the Model instance to make
            if (fidx >= totalNum) { continue; }                         //if index is not valid, stop loop execution
            rec = store.getAt(fidx);                                    //get Model instance to build Component from
            items.push(me.buildPage(rec));                              //build actual Component
        }

        for (; b <= backwardNum; b++) {                                 //loop number of items to go before start item
            bidx = startIdx - b;                                        //index of Model instance to make
            if (bidx < 0) {                                             //Model instance cannot have index less than 0
                if (!allowWrap) {                                       //if allowWrap is set to false, we cannot continue to end of Store
                    continue;
                }

                bidx = endIdx - b + 1;                                  //get new index from end of Store
            }
            rec = store.getAt(bidx);                                    //get Model instance to build Component from
            items.unshift(me.buildPage(rec));                           //put Component at the beginning of the items array
        }

        return items;
    },

    // @private
    // function to build Component from Model instance
    buildPage: function(rec, makeActive) {
        var me       = this,
            cmpField = me.cmpField,                                     //field in Model insance to build Component
            store    = me.store,
            cmp      = Ext.decode(rec.get(cmpField));                   //decode JSON to build Component

        Ext.applyIf(cmp, {
            pageIndex  : store.indexOf(rec),                            //put Model instance index to Component to refer to later
            makeActive : makeActive || false                            //whether or not to make this Component initially active
        });

        return cmp;
    },

    // @private
    // Find what Component to build and which to remove
    onBeforeCardSwitch: function(newCard) {
        var me         = this,
            allowWrap  = me.allowWrap,
            numPages   = me.numPages,
            currPage   = me.getActiveItem(),
            middleIdx  = Math.floor(numPages / 2),                      //need to find middle index
            currIdx    = me.items.indexOf(currPage),                    //index of the active item
            newCmp, oldCmp, dir;

        if (middleIdx === currIdx) {                                    //if the active item is not in the middle, do not add or remove any items
            var pageIdx    = newCard.pageIndex,
                newIdx     = me.items.indexOf(newCard),                 //index of the new item being scrolled to
                dir        = newIdx > currIdx ? 'forward' : 'back',     //direction of movement
                items      = me.items,
                endItem    = items.getAt(me.numPages - 1),              //last item of currently rendered items
                startItem  = items.getAt(0),                            //first item of currently rendered items
                store      = me.store,
                totalCount = store.getCount();                          //number of Model instances in Store

            me.activePage = pageIdx;                                    //keeps track of the active page, needed?

            if (dir === 'forward') {                                    //if going forward
                if (Ext.isObject(endItem)) {                            //if the last item is valid
                    newCmp = endItem.pageIndex + 1;                     //get the index of the next Model instance to be rendered
                    if (newCmp >= totalCount) {                         //check to see if we need to wrap index to the beginning
                        if (allowWrap) {
                            newCmp = 0;                                 //if we need to wrap index to the beginning, set to 0
                        } else {
                            newCmp = undefined;                         //if allowWrap is set to false, we will not add any items
                        }
                    }
                    if (Ext.isNumber(newCmp)) {                         //if index is a number, proceed to building Component
                        newCmp = store.getAt(newCmp);                   //Model instance to be rendered
                        newCmp = me.buildPage(newCmp);                  //building of Component

                        oldCmp = startItem;                             //set the first rendered item to be removed
                    }
                }
            } else {                                                    //if going backward
                newCmp = startItem.pageIndex - 1;                       //get the index of the next Model instance to be rendered
                if (newCmp < 0) {                                       //check to see if we need to wrap index to the end
                    if (allowWrap) {
                        newCmp = totalCount - 1;                        //if we need to wrap index to the end, set to last index in Store
                    } else {
                        newCmp = undefined;                             //if allowWrap is set to false, we will not insert any items
                    }
                }
                if (Ext.isNumber(newCmp)) {                             //if index is a number, proceed to building Component
                    newCmp = store.getAt(newCmp);                       //Model instance to be rendered
                    newCmp = me.buildPage(newCmp);                      //building of Component

                    oldCmp = endItem;                                   //set the last rendered item to be removed
                }
            }
        }

        Ext.apply(me, {                                                 //cache Component configs to be added/removed and direction
            newCmp : {                                                  //if we added Components here, the Component would be rendered and we would see it animate to the end/beginning
                dir    : dir,                                           //direction of scrolling to be used to add to end or beginning
                cmp    : newCmp,                                        //Component config to add
                remove : oldCmp                                         //Component to remove
            }
        });

        return me.supr().onBeforeCardSwitch.apply(me, arguments);       //call the superclass to not break Ext.Carousel
    },

    // @private
    // function to do the adding and removing of Components
    onCardSwitch: function(newCard, oldCard, index, animated) {
        var me         = this,
            newCmp     = me.newCmp,                                     //get the cached Component configs and direction
            dir        = newCmp.dir,
            cmp        = newCmp.cmp,
            remove     = newCmp.remove
            needLayout = false,                                         //don't need to call doLayout if not needed
            items      = [],
            pageIdx    = null;

        if (Ext.isObject(cmp)) {                                        //check to make sure Component config to add/insert is a valid config Object
            if (dir === 'forward') {
                me.add(cmp);                                            //if moving forward, add to end of items
            } else {
                me.insert(0, cmp);                                      //if moving backward, insert to the beginning of items
            }
            needLayout = true;                                          //we added/inserted a Component so we need to call doLayout
        }

        if (Ext.isObject(remove)) {                                     //check to make sure Component to remove is a valid Component
            me.remove(remove);                                          //remove the Component
            needLayout = true;                                          //do not need to call but to keep Indicator in sync, we do
        }

        me.items.each(function(item) {                                  //go through the items to make sure no duplicates, this can happen if numPages is larger than number of Model instances in Store (and something went wrong)
            pageIdx = item.pageIndex;
            if (items.indexOf(pageIdx) < 0) {
                items.push(pageIdx);
                return;
            }
            me.remove(item);                                            //if we found a duplicate, remove it
        });

        if (needLayout) {
            me.doLayout();                                              //if we added/inserted/removed, we need to call doLayout
        }

        me.supr().onCardSwitch.apply(me, arguments);                    //call the superclass to not break Ext.Carousel
    }
});

Ext.reg("infinitecarousel", Ext.ux.touch.InfiniteCarousel);             //register the XType
