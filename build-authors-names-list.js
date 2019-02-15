
class AuthorsNamesListBuilder extends AuthorsNamesParser {
	
	// params: 
	// searchPersonsUrl - URL для поиска персон с ФИО, которые в списке авторов
	// authorsNamesListTpl - шаблон в формате HTML для вывода каждого ФИО
	// blockId - идентификатор блока (например, authors -- авторы, editors -- редакторы, rightholders -- правообладатели и пр.)
	// searchUrl - URL для поиска данных персон с указанными ФИО
	// keyPersonTitle -- в каком параметре из JSON-ответа, полученного из searchUrl, содержатся данные для отображения на странице 
	// keyPersonId --  в каком параметре из JSON-ответа, полученного из searchUrl, содержатся данные с идентфикаторами соответствующих ФИО персон 
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
		this.keyPersonTitle = params.keyPersonTitle !== undefined ? params.keyPersonTitle : "profile_display_name";
		this.keyPersonId = params.keyPersonId !== undefined ? params.keyPersonId : "id";
		this.buildAuthorsUrlErrorMsg = params.buildAuthorsUrlErrorMsg !== undefined ? params.buildAuthorsUrlErrorMsg : "<span class=\"build-authors-url-error\">" + "URL не доступен" + "</span>";
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
		var errorsArr = {};
		var searchedPersonsCount = 0;
		var authorsParsedStr = '';
		var blockId = this.blockId;
		$.each(self.authorsNamesComponentsArr, function(index, value){
			authorsParsedStr += self.parseTpl(self.authorsNamesListTpl, blockId, index, value);
			// если был указан URL для поиска персон с указанными ФИО
			if (self.searchUrl !== undefined && self.searchUrl != null) {
				// формирование конкретной ссылки для текущего ФИО
				var url = self.parseTpl(self.searchUrl, blockId, index, value);
				// пробуем обратитсья к URL для поиска персоны по текущему ФИО
				$.get(url, function(data) {
					personsArr[blockId + "_" + index] = data; // данные найденных персон
					errorsArr[blockId + "_" + index] = null; // всё прошло без ошибок
					searchedPersonsCount++; // количество обработанных ФИО + 1
					if (searchedPersonsCount == self.authorsNamesComponentsArr.length)
					{
						self.buildListHtml(listElemId, authorsParsedStr, personsArr);
					}
				}, "json").fail(function() {
					personsArr[blockId + "_" + index] = null; // персону невозможно найти
					errorsArr[blockId + "_" + index] = self.buildAuthorsUrlErrorMsg; // текст с ошибкой
					searchedPersonsCount++; // количество обработанных ФИО + 1
					if (searchedPersonsCount == self.authorsNamesComponentsArr.length)
					{
						self.buildListHtml(listElemId, authorsParsedStr, personsArr, errorsArr);						
					}
				});
			}
		});
		// если не был указан URL для поиска персон, то выводим список здесь
		if (self.searchUrl == undefined || self.searchUrl == null)
		{
			self.buildListHtml(listElemId, authorsParsedStr);
		}
		return this;
	}
	
	// формирование html для вывода итогового списка ФИО 
	buildListHtml(listElemId, authorsParsedStr, personsArr = null, errorsArr = null) {
		$("#" + listElemId).html(authorsParsedStr);
		if (self.searchUrl !== undefined && self.searchUrl != null) {
			// цикл по всем найденным персонам для каждого ФИО
			$.each(personsArr, function(i1, persons) {
				if (persons == null && errorsArr != null && errorsArr[i1] !== undefined) {
					$("#" + i1).after(errorsArr[i1]);
				}
				else {
					$.each(persons, function(i2, person) {
						$("#" + i1).append("<option value=\"" + person[self.keyPersonId] + "\">" + person[self.keyPersonTitle] + "</option>");
					});
				}
			});
		}
	}
	
	// 
	parseTpl(tpl, blockId, index, value) {
		return tpl.replace(/{blockId}/gi, blockId)
				.replace(/{nameId}/gi, index)
				.replace(/{lastname}/gi, value.lastname)
				.replace(/{firstname}/gi, value.firstname)
				.replace(/{middlename}/gi, value.middlename);
	}
	
}


