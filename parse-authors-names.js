
class AuthorsNamesParser {
	
	// params: 
	// isConsoleLog - выводить ли ход и результат работы парсера в консоль
	constructor(params) {
		// выводить ли ход и результат работы парсера в консоль
		this.isConsoleLog = params.isConsoleLog !== undefined ? params.isConsoleLog : false;
		// "чистая" строка со списком авторов
		this.authorsNamesStrClear = '';
		// массив с ФИО для всех авторов
		this.authorsNamesComponentsArr = [];
		// регулярное выражение для разбиения ФИО автора на компоненты
		this.authorNameRe = /(['a-zA-Zа-яА-ЯёЁéú-’\s]+)\s([a-zA-Zа-яА-ЯёЁéú]+)\.*\s*(?:([a-zA-Zа-яА-ЯёЁéú]+)\.)*/i;
	}
	
	// передается строка с ФИО авторов
	parseAuthorsNames(authorsNamesStr) {
		this.authorsNamesComponentsArr = [];
		var authorsNamesArr = this.parseList(authorsNamesStr);
		for (var i = 0; i < (authorsNamesArr.length); i++) { 
			var tmpName = this.parseName(authorsNamesArr[i]);
			this.authorsNamesComponentsArr.push(tmpName);
			if (this.isConsoleLog) {
				console.log("=== " + authorsNamesArr[i] + " === \n");
				console.log(tmpName);
			}
		}
		return this;
	}
	
	// разбивает строку со списком авторов на несколько ФИО
	parseList(authorsNamesStr) {
		// заменяем все разделители на запятую
		authorsNamesStr = authorsNamesStr.replace(/\s+and\s+/gi, ", "); // FIO1 and FIO2
		authorsNamesStr = authorsNamesStr.replace(/[$;:*+|]/gi, ", "); // FIO1$FIO2
		// убираем лишние пробелы
		authorsNamesStr = authorsNamesStr.replace(/(\.\s+)/gi, ". ");
		authorsNamesStr = authorsNamesStr.replace(/(\s{2})/gi, " ");
		authorsNamesStr = authorsNamesStr.replace(/(\.\s,)/gi, ".,");
		authorsNamesStr = authorsNamesStr.replace(/(,\s+)/gi, ",");
		// разбиваем строку на массив запятой
		var authorsNamesArr = authorsNamesStr.split(',');
		this.authorsNamesStrClear = authorsNamesStr;
		this.authorsNamesStrClear = this.authorsNamesStrClear.replace(/,/gi, ", ");
		if (this.isConsoleLog) {
			console.log("\n === " + this.authorsNamesStrClear + " === \n");
			console.log(authorsNamesArr);
		}
		return authorsNamesArr;
	}
	
	// Разбивает ФИО автора на отдельные элементы:
	// - имя (first name)
	// - отчество (middle name)
	// - фамилия (last name)
	parseName(authorName) {
		var lastname = '';
		var firstname = '';
		var middlename = '';
		if (authorName.length > 3) {
			var authorNameArr = authorName.match(this.authorNameRe);
			if (authorNameArr != null && authorNameArr.length > 0) {
				lastname = authorNameArr[1] != null ? authorNameArr[1] : '';
				firstname = authorNameArr[2] != null ? authorNameArr[2] : '';
				middlename = authorNameArr[3] != null ? authorNameArr[3] : '';	
			}
		}
		return {"lastname": lastname, "firstname": firstname, "middlename": middlename};
	}
}
