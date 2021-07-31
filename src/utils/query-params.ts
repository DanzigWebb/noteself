export class QueryParams {
  readonly params;
  constructor(query) {
    this.params = query;
  }
  get q() {
    return this.params.q;
  }
  get something() {
    return this.params.something;
  }
  getParamByName(param: string) {
    return this.params[param];
  }
}
