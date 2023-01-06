import mongoose from 'mongoose';
import { graphql } from 'graphql';
import { schema } from '../schema'
import {
  Todo,
} from '../model/task';
import { connect } from './mongooseConnection';

beforeAll(() => connect())
it('should be show all tasks', async () => {
  const query = `
    query{
        todos{
          _id,
          task,
          status
        }
  }
  `;

  const rootValue = {};
  const context = {};

  const result = await graphql(schema, query);
  const { data } = result;
console.log(data);
});