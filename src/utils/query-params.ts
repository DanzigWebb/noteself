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

  // fixme: сейчас тут хардпривязка к столбцам БД
  createSort(paramSort: string): string {
    if (typeof paramSort !== 'undefined') {
      paramSort = paramSort.toUpperCase();
    }
    switch (paramSort) {
      case 'NAME':
        return 'firstName';
      case 'TITLE':
        return 'title';
      case 'UPDATE':
        return 'updatedAt';
      case 'CREATE':
      default:
        return 'createdAt';
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
