function smartJoin(arr, separator){
	if(!separator) separator = ' ';
		return arr.filter(function(elt){
			return elt!==undefined && elt!==null && elt.toString().trim() !== '';
	}).join(separator);
}

module.exports = {
	smartJoin: smartJoin
}