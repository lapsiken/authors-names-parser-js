
class AuthorsNamesListBuilder extends AuthorsNamesParser {
	
	// params: 
	// searchPersonsUrl - URL для поиска персон с ФИО, которые в списке авторов
	// authorsNamesListTpl - шаблон в формате HTML для вывода каждого ФИО
	// searchUrl
	// blockId
	// keyPersonTitle
	constructor(params) {
		super(params);
		var authorsNamesListTplDefault = 
			'<div><b>{lastname} {firstname} {middlename}</b> ' + 
			'<input type="hidden" name="{blockId}[lastname][]" value="{lastname}"/>' + 
			'<input type="hidden" name="{blockId}[firstname][]" value="{firstname}"/>' + 
			'<input type="hidden" name="{blockId}[middlename][]" value="{middlename}"/>' + 
			'<select name="{blockId}[person][]" id="{blockId}_{nameId}"><option>не выбрано</option></select>' + 
			'</div>';
		this.authorsNamesListTpl = params.authorsNamesListTpl !== undefined ? authorsNamesListTpl : authorsNamesListTplDefault;
		this.blockId = params.blockId !== undefined ? params.blockId : "authors";
		this.searchUrl = params.searchUrl !== undefined ? params.searchUrl : null;
		this.loadingImg = params.loadingImg !== undefined ? params.loadingImg : "./img/loading.gif";
		this.keyPersonTitle = params.keyPersonTitle !== undefined ? params.keyPersonTitle : 'profile_display_name';
		this.keyPersonId = params.keyPersonId !== undefined ? params.keyPersonId : 'id';
	}
	
	// установка шаблона для вывода данных по ФИО
	setTpl(authorsNamesListTpl) {
		if (authorsNamesListTpl !== undefined)
			this.authorsNamesListTpl = authorsNamesListTpl;
		return this;
	}
	
	// установка URL для поиска персон, соответствующих ФИО
	setSearchUrl(searchUrl) {
		if (searchUrl !== undefined)
			this.searchUrl = searchUrl;
		return this;
	}
	
	setBlockId(blockId) {
		if (blockId !== undefined)
			this.blockId = blockId;
		return this;
	}
	
	// Построение списка компонентов ФИО авторов по заданному шаблону
	// или шаблону по умолчанию.
	// listElemId - Id объекта на странице, в котором отображать результат парсера
	buildList(listElemId = "authorsNamesTable") {
		var html = "<img src=\"" + this.loadingImg + "\" style=\"height:20px; padding:10px;\"/>";
		$("#" + listElemId).html(html);
		this.authorsParsedArr = [];
		var self = this;
		var personsArr = {};
		var searchedPersonsCount = 0;
		var authorsParsedStr = '';
		var blockId = this.blockId;
		$.each(self.authorsNamesComponentsArr, function(index, value){
			authorsParsedStr += self.parseTpl(self.authorsNamesListTpl, blockId, index, value);
			if (self.searchUrl !== undefined && self.searchUrl != null) {
				var url = self.parseTpl(self.searchUrl, blockId, index, value);
				$.get(url, function(data) {
					personsArr[blockId + "_" + index] = data;
					searchedPersonsCount++;
					if (searchedPersonsCount == self.authorsNamesComponentsArr.length)
					{
						$("#" + listElemId).html(authorsParsedStr);
						$.each(personsArr, function(i1, persons) {
							$.each(persons, function(i2, person) {
								$("#" + i1).append("<option value=\"" + person[self.keyPersonId] + "\">" + person[self.keyPersonTitle] + "</option>");
							});
						});
					}
				}, "json");
			}
		});
		return this;
	}
	
	parseTpl(tpl, blockId, index, value) {
		return tpl.replace(/{blockId}/gi, blockId)
				.replace(/{nameId}/gi, index)
				.replace(/{lastname}/gi, value.lastname)
				.replace(/{firstname}/gi, value.firstname)
				.replace(/{middlename}/gi, value.middlename);
	}
	
}


