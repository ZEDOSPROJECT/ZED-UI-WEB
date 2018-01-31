FR.components.cartStore = Ext.extend(Ext.data.Store, {
	carts: [],
	constructor: function(config) {
		FR.components.cartStore.superclass.constructor.call(this, Ext.apply(config, {
			reader: new Ext.data.ArrayReader(
				{idIndex: 0},
				[]
			),
			listeners: {
				'remove': function() {this.updateCarts();},
				'add': function() {this.updateCarts();},
				scope: this
			}
		}));
	},
	updateCarts: function() {
		Ext.each(this.carts, function(cart) {cart.updateUI();});
	}
});