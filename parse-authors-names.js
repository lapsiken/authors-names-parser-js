// Парсер имён авторов (публикаций и других объектов интеллектуальной собственности)
// Используется формула Фамилия И.О.

class AuthorsNamesParser {
	
	/**
	 * конструктор класса
	 */
	constructor(authorsNamesStr) {
		this.init();
		this.parseAuthorsNames(authorsNamesStr);
	}
	
	/**
	 * установка переменных класса и очистка массивов
	 */
	init(){
		this.isConsoleLog = false;
		// "чистая" строка со списком авторов
		this.authorsNamesStrClear = '';
		// массив с каждым ФИО автора
		this.authorsNamesArr = [];
		// массив с ФИО для всех авторов
		this.authorsNamesComponentsArr = [];
		// регулярное выражение для разбиения ФИО автора на компоненты
		this.authorNameRe = /(['a-zA-Zа-яА-ЯёЁéú-’\s]+)\s([a-zA-Zа-яА-ЯёЁéú]+)\.*\s*(?:([a-zA-Zа-яА-ЯёЁéú]+)\.)*/i;
	}
	
	/**
	 * передается строка с ФИО авторов
	 */
	parseAuthorsNames(authorsNamesStr) {
		this.init();
		this.authorsNamesArr = this.parseList(authorsNamesStr);
		for (var i = 0; i < (this.authorsNamesArr.length); i++) { 
			var tmpName = this.parseName(this.authorsNamesArr[i]);
			this.authorsNamesComponentsArr.push(tmpName);
			if (this.isConsoleLog) {
				console.log("=== " + this.authorsNamesArr[i] + " === \n");
				console.log(tmpName);
			}
		}
		return this.authorsNamesComponentsArr;
	}
	
	/**
	 * разбивает строку со списком авторов на несколько ФИО
	 */
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
		this.authorsNamesArr = authorsNamesStr.split(',');
		this.authorsNamesStrClear = authorsNamesStr;
		if (this.isConsoleLog) {
			console.log("\n === " + this.authorsNamesStrClear + " === \n");
			console.log(this.authorsNamesArr);
		}
		return this.authorsNamesArr;
	}
	
	/**
	 * разбивает ФИО автора на отдельные элементы:
	 * 	имя (first name)
	 * 	отчество (middle name)
	 * 	фамилия (last name)
	 */
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

