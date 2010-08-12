Ext.ns('news', 'demos', 'Ext.ux');

Ext.ux.UniversalUI = Ext.extend(Ext.Panel, {
    fullscreen: true,
    layout: 'card',
    items: [{
        cls: 'launchscreen',
        html: '<div><img src="../../sencha-touch-beta-0.91/resources/img/sencha.png" width="210" height="291" /><h1>Welcome to Sencha Touch</h1><p>This is a collection of Sencha Touch demos, extensions, and plug-ins craeated by Mitchell Simoens.<br /><br /><span>Sencha Touch &beta; (0.93)</span></p></div>'
    }],
    initComponent : function() {
        this.backButton = new Ext.Button({
            hidden: true,
            text: 'Back',
            ui: 'back',
            handler: this.onBackButtonTap,
            scope: this
        });

        this.navigationButton = new Ext.Button({
            hidden: Ext.platform.isPhone || Ext.orientation == 'landscape',
            text: 'Navigation',
            handler: this.onNavButtonTap,
            scope: this
        });
        
        this.navigationBar = new Ext.Toolbar({
            ui: 'dark',
            dock: 'top',
            title: this.title,
            items: [this.backButton, this.navigationButton].concat(this.buttons || [])
        });
        
        this.navigationPanel = new Ext.NestedList({
            items: this.navigationItems || [],
            dock: 'left',
            width: 250,
            height: 456,
            hidden: !Ext.platform.isPhone && Ext.orientation == 'portrait',
            toolbar: Ext.platform.isPhone ? this.navigationBar : null,
            listeners: {
                listchange: this.onListChange,
                scope: this
            }
        });
        
        this.dockedItems = this.dockedItems || [];
        this.dockedItems.unshift(this.navigationBar);
        
        if (!Ext.platform.isPhone && Ext.orientation == 'landscape') {
            this.dockedItems.unshift(this.navigationPanel);
        }
        else if (Ext.platform.isPhone) {
            this.items = this.items || [];
            this.items.unshift(this.navigationPanel);
        }
        
        this.addEvents('navigate');
        
        Ext.ux.UniversalUI.superclass.initComponent.call(this);
    },
    
    onListChange : function(list, item) {
        if (Ext.orientation == 'portrait' && !Ext.platform.isPhone && !item.items && !item.preventHide) {
            this.navigationPanel.hide();
        }
        
        if (item.card) {
            this.setCard(item.card, item.animation || 'slide');
            this.currentCard = item.card;
            if (item.text) {
                this.navigationBar.setTitle(item.text);
            }
            if (Ext.platform.isPhone) {
                this.backButton.show();
                this.navigationBar.doLayout();
            }
        }     
       
        this.fireEvent('navigate', this, item, list);
    },
    
    onNavButtonTap : function() {
        this.navigationPanel.showBy(this.navigationButton, 'fade');
    },
    
    onBackButtonTap : function() {
        this.setCard(this.navigationPanel, {type: 'slide', direction: 'right'});
        this.currentCard = this.navigationPanel;
        if (Ext.platform.isPhone) {
            this.backButton.hide();
            this.navigationBar.setTitle(this.title);
            this.navigationBar.doLayout();
        }
        this.fireEvent('navigate', this, this.navigationPanel.activeItem, this.navigationPanel);
    },
    
    onOrientationChange : function(orientation, w, h) {
        Ext.ux.UniversalUI.superclass.onOrientationChange.call(this, orientation, w, h);
        
        if (!Ext.platform.isPhone) {
            if (orientation == 'portrait') {
                this.removeDocked(this.navigationPanel, false);
                this.navigationPanel.hide();
                this.navigationPanel.setFloating(true);
                this.navigationButton.show();
            }
            else {                
                this.navigationPanel.setFloating(false);
                this.navigationPanel.show();
                this.navigationButton.hide();
                this.insertDocked(0, this.navigationPanel);                
            }

            this.doComponentLayout();
            this.navigationBar.doComponentLayout();
        }
    }
});

news.Main = {
    init : function() {
        this.ui = new Ext.ux.UniversalUI({
            title: 'Mitchell Simoens - Sencha Touch',
            navigationItems: news.Structure,
            listeners: {
                navigate : this.onNavigate,
                scope: this
            }
        });
    },
    
    onNavigate : function(ui, item) {
        ui.navigationBar.doComponentLayout();
    }
};

Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'img/icon.png',
    glossOnIcon: false,
    onReady: function() {
        news.Main.init();
    }
});