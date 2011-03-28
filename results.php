<?

$page_two = "{
	html        : 'I\'m a panel!',
	dockedItems : [{
		dock  : 'top',
		xtype : 'toolbar',
		title : 'Standard Titlebar'
	},{
		dock  : 'top',
		xtype : 'toolbar',
		type  : 'light',
		items : [{
			text : 'Test Button',
			listeners : {
				tap : function() {
					alert('Thank you for that click!');
				}
			}
		}]
	}]
}";

$page_five = "{
	xtype     : 'carousel',
	direction : 'vertical',
	cls       : 'mag-page-padding',
	items     : [{
		html : 'There is another card under me!',
		cls : 'demo-card'
	},{
		html : 'There I am!',
		cls : 'demo-card'
	}]
}";

$page_eight = "{
	xtype       : 'touchgridpanel',
	store       : new Ext.data.Store({
		model : 'TouchGridPanel',
		data  : [
			{ company : '3m Co',                               price : 71.72, change : 0.02,  pct : 0.03,  updated : '9/1/2010' },
			{ company : 'Alcoa Inc',                           price : 29.01, change : 0.42,  pct : 1.47,  updated : '9/1/2010' },
			{ company : 'Altria Group Inc',                    price : 83.81, change : 0.28,  pct : 0.34,  updated : '9/1/2010' },
			{ company : 'American Express Company',            price : 52.55, change : 0.01,  pct : 0.02,  updated : '9/1/2010' },
			{ company : 'American International Group, Inc.',  price : 64.13, change : 0.31,  pct : 0.49,  updated : '9/1/2010' },
			{ company : 'AT&#38;T Inc.',                       price : 31.61, change : -0.48, pct : -1.54, updated : '9/1/2010' },
			{ company : 'Boeing Co.',                          price : 75.43, change : 0.53,  pct : 0.71,  updated : '9/1/2010' },
			{ company : 'Caterpillar Inc.',                    price : 67.27, change : 0.92,  pct : 1.39,  updated : '9/1/2010' },
			{ company : 'Citigroup, Inc.',                     price : 49.37, change : 0.02,  pct : 0.04,  updated : '9/1/2010' },
			{ company : 'E.I. du Pont de Nemours and Company', price : 40.48, change : 0.51,  pct : 1.28,  updated : '9/1/2010' },
			{ company : 'Exxon Mobil Corp',                    price : 68.1,  change : -0.43, pct : -0.64, updated : '9/1/2010' },
			{ company : 'General Electric Company',            price : 34.14, change : -0.08, pct : -0.23, updated : '9/1/2010' },
			{ company : 'General Motors Corporation',          price : 30.27, change : 1.09,  pct : 3.74,  updated : '9/1/2010' },
			{ company : 'Hewlett-Packard Co.',                 price : 36.53, change : -0.03, pct : -0.08, updated : '9/1/2010' },
			{ company : 'Honeywell Intl Inc',                  price : 38.77, change : 0.05,  pct : 0.13,  updated : '9/1/2010' },
			{ company : 'Intel Corporation',                   price : 19.88, change : 0.31,  pct : 1.58,  updated : '9/1/2010' },
			{ company : 'International Business Machines',     price : 81.41, change : 0.44,  pct : 0.54,  updated : '9/1/2010' },
			{ company : 'Johnson &#38; Johnson',               price : 64.72, change : 0.06,  pct : 0.09,  updated : '9/1/2010' },
			{ company : 'JP Morgan &#38; Chase &#38; Co',      price : 45.73, change : 0.07,  pct : 0.15,  updated : '9/1/2010' },
			{ company : 'McDonald\'s Corporation',             price : 36.76, change : 0.86,  pct : 2.40,  updated : '9/1/2010' },
			{ company : 'Merck &#38; Co., Inc.',               price : 40.96, change : 0.41,  pct : 1.01,  updated : '9/1/2010' },
			{ company : 'Microsoft Corporation',               price : 25.84, change : 0.14,  pct : 0.54,  updated : '9/1/2010' },
			{ company : 'Pfizer Inc',                          price : 27.96, change : 0.4,   pct : 1.45,  updated : '9/1/2010' },
			{ company : 'The Coca-Cola Company',               price : 45.07, change : 0.26,  pct : 0.58,  updated : '9/1/2010' },
			{ company : 'The Home Depot, Inc.',                price : 34.64, change : 0.35,  pct : 1.02,  updated : '9/1/2010' },
			{ company : 'The Procter &#38; Gamble Company',    price : 61.91, change : 0.01,  pct : 0.02,  updated : '9/1/2010' },
			{ company : 'United Technologies Corporation',     price : 63.26, change : 0.55,  pct : 0.88,  updated : '9/1/2010' },
			{ company : 'Verizon Communications',              price : 35.57, change : 0.39,  pct : 1.11,  updated : '9/1/2010' },
			{ company : 'Wal-Mart Stores, Inc.',               price : 45.45, change : 0.73,  pct : 1.63,  updated : '9/1/2010' }
		]
	}),
	selModel    : {
		singleSelect : true
	},
	colModel    : [{
		header  : 'Company',
		width   : 250,
		mapping : 'company'
	},{
		header   : 'Price',
		width    : 150,
		mapping  : 'price'
	},{
		header   : 'Change',
		width    : 150,
		mapping  : 'change'
	},{
		header   : '% Change',
		width    : 150,
		mapping  : 'pct'
	},{
		header   : 'Last Updated',
		width    : 200,
		mapping  : 'updated'
	}]
}";

$results = array();

$results[] = array("id" => 1,  "title" => "Card One",   "html" => "<h1>Card One</h1>This is some dummy text.<br><br>Check out something special on pages 2, 5, and 8!");
$results[] = array("id" => 2,  "title" => "Card Two",   "cmp"  => "[".$page_two."]");
//$results[] = array("id" => 2,  "title" => "Card Two",  "html" => "<h1>Card Two</h1>This is some dummy text");
$results[] = array("id" => 3,  "title" => "Card Three", "html" => "<h1>Card Three</h1>This is some dummy text");
$results[] = array("id" => 4,  "title" => "Card Four",  "html" => "<h1>Card Four</h1>This is some dummy text");
$results[] = array("id" => 5,  "title" => "Card Five",  "cmp"  => "[".$page_five."]");
//$results[] = array("id" => 5,  "title" => "Card Five",  "html" => "<h1>Card Five</h1>This is some dummy text");
$results[] = array("id" => 6,  "title" => "Card Six",   "html" => "<h1>Card Six</h1>This is some dummy text");
$results[] = array("id" => 7,  "title" => "Card Seven", "html" => "<h1>Card Seven</h1>This is some dummy text");
$results[] = array("id" => 8,  "title" => "Card Eight", "cmp"  => "[".$page_eight."]");
//$results[] = array("id" => 8,  "title" => "Card Eight",  "html" => "<h1>Card Eight</h1>This is some dummy text");
$results[] = array("id" => 9,  "title" => "Card Nine",  "html" => "<h1>Card Nine</h1>This is some dummy text");
$results[] = array("id" => 10, "title" => "Card Ten",   "html" => "<h1>Card Ten</h1>This is some dummy text");

echo json_encode(array("success" => true, "total" => count($results), "cards" => $results));

?>