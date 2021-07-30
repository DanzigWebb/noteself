import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryParams {
  constructor() {}
  getQuery(q) {
    return q;
  }
}
