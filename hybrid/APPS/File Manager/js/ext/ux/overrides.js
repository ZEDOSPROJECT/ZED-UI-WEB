(function(){
	var userAgent = navigator.userAgent,
		re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})"),
		isIE11 = navigator.appName === 'Netscape' && re.exec(userAgent) !== null && parseFloat( RegExp.$1 ) === 11;
	if(isIE11){
		Ext.isIE = true;
		Ext.isIE11 = true;
		Ext.ieVersion = 11;
		Ext.isGecko = false;
	} else {
		Ext.isIE11 = false;
	}

	if (userAgent.toLowerCase().indexOf("android") > -1) {Ext.isAndroid = true;}
})();


var createSortFunctionExtJs = Ext.data.Store.prototype.createSortFunction;
Ext.override(Ext.data.Store, {
	createSortFunction: function(fieldName, direction) {
		var field = this.fields.get(fieldName);
		if (!field || !field.sortFunction) {
			return createSortFunctionExtJs.call(this, fieldName, direction);
		}
		direction = direction || "ASC";
		var directionModifier = direction.toUpperCase() == "DESC" ? -1 : 1;
		var f = field.sortFunction;
		return function (r1, r2) {
			return directionModifier * f(r1, r2);
		}
	}
});


function compareAlphaNum(a, b) {
	var aa = a.split(/(\d+)/);
	var bb = b.split(/(\d+)/);
	for (var x = 0; x < Math.max(aa.length, bb.length); x++) {
		if (aa[x] != bb[x]) {
			var cmp1 = (isNaN(parseInt(aa[x], 10))) ? aa[x] : parseInt(aa[x], 10);
			var cmp2 = (isNaN(parseInt(bb[x], 10))) ? bb[x] : parseInt(bb[x], 10);
			if (cmp1 == undefined || cmp2 == undefined) {
				return aa.length - bb.length;
			} else {
				if (typeof cmp1 === 'string') {
					return cmp1.localeCompare(cmp2);
				}
				return (cmp1 < cmp2) ? -1 : 1;
			}
		}
	}
	return 0;
}
if (!String.prototype.repeat) {
	String.prototype.repeat = function( num ){
		return new Array( num + 1 ).join( this );
	}
}