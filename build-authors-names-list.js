
class AuthorsNamesListBuilder extends AuthorsNamesParser {
	
	/**
	 * конструктор класса
	 */
	constructor(authorsNamesStr, authorsNamesListTpl = null) {
		super(authorsNamesStr);
		this.authorsNamesListTplDefault = 
			'<div><b>{lastname} {firstname} {middlename}</b> ' + 
			'<select name="" id=""><option></option></select>' + 
			'</div>';
		this.authorsNamesListTpl = authorsNamesListTpl == null ? this.authorsNamesListTplDefault : authorsNamesListTpl;
	}
	
	/**
	 * 
	 */
	buildList(elemId = null) {
		var authorsParsedStr = '';
		var tpl = this.authorsNamesListTpl;
		$.each(this.authorsNamesComponentsArr, function(index, value){
			authorsParsedStr += tpl.replace("{lastname}", value.lastname)
				.replace("{firstname}", value.firstname)
				.replace("{middlename}", value.middlename);
			});
		$("#" + elemId).html(authorsParsedStr);
	}
	
}