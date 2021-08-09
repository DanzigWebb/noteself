// сортировки, возможные для таблицы User
enum enumValueSortUser {
  NAME = 'firstName',
  LASTNAME = 'lastName',
  EMAIL = 'email',
  UPDATE = 'updatedAt', // internal_name = url_name
  CREATE = 'createdAt',
  ID = 'id',
}
// сортировки, возможные для Subject, Notes
enum enumValueSortNotes {
  TITLE = 'title',
  DESCRIPTION = 'description',
  UPDATE = 'updatedAt', // internal_name = url_name
  CREATE = 'createdAt',
  ID = 'id',
}

// enum для листа сущностей
enum enumParamsList {
  search = 'q', // internal_name = url_name
  sort = 's',
  order = 'o',
}
// enum для листа сущностей
enum enumParamsSingle {
  id = 'id',
}
// типы возможных параметров
export type ParamsList = keyof typeof enumParamsList;
export type ParamsSingle = keyof typeof enumParamsSingle;

// общий интерфейс
type IParams = {
  [param in ParamsSingle | ParamsList]?: string;
};

export class QueryParams {
  params: IParams = {};

  getParamByName(name: ParamsList | ParamsSingle): string {
    return this.params[name];
  }
  hasParam(name: ParamsList | ParamsSingle): boolean {
    return name in this.params;
  }
}

export class QueryParamsList extends QueryParams {
  constructor(queryParams: IParams) {
    super();
    const enumKeys = Object.keys(enumParamsList);
    for (const enumKey of enumKeys) {
      this.params[enumKey] = queryParams[enumParamsList[enumKey]];
    }
  }

  createOrder(order: string): 'ASC' | 'DESC' {
    if (typeof order !== 'undefined') {
      order = order.toUpperCase();
    }
    return order === 'DESC' ? 'DESC' : 'ASC';
  }
}

export class QueryParamsSingle extends QueryParams {
  constructor(queryParams: IParams) {
    super();
    const enumKeys = Object.keys(enumParamsSingle);

    for (const enumKey of enumKeys) {
      this.params[enumKey] = queryParams[enumParamsSingle[enumKey]];
    }
  }
}
// Only Users
export class UserQueryParams extends QueryParams {
  // List & Single
  createSort(sortParam: string): enumValueSortUser {
    // если параметр не был передан или передан неверный параметр, то возвращаем столбец Update
    if (
      // если параметр не был передан || передан неверный параметр
      !sortParam ||
      enumValueSortUser[sortParam.toUpperCase()] === undefined
    ) {
      return enumValueSortUser.UPDATE;
    }
    return enumValueSortUser[sortParam.toUpperCase()];
  }
}

// Subjects And Notes
export class NoteQueryParams extends QueryParams {
  // List & Single
  createSort(sortParam: string): enumValueSortNotes {
    if (
      // если параметр не был передан || передан неверный параметр
      !sortParam ||
      enumValueSortNotes[sortParam.toUpperCase()] === undefined
    ) {
      // возвращаем столбец Update в качестве сортировки по-умолчанию
      return enumValueSortNotes.UPDATE;
    }
    return enumValueSortNotes[sortParam.toUpperCase()];
  }
}
