/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getVotingMatter = /* GraphQL */ `query GetVotingMatter($id: ID!) {
  getVotingMatter(id: $id) {
    id
    votingMatterName
    yesCount
    noCount
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetVotingMatterQueryVariables,
  APITypes.GetVotingMatterQuery
>;
export const listVotingMatters = /* GraphQL */ `query ListVotingMatters(
  $filter: ModelVotingMatterFilterInput
  $limit: Int
  $nextToken: String
) {
  listVotingMatters(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      votingMatterName
      yesCount
      noCount
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVotingMattersQueryVariables,
  APITypes.ListVotingMattersQuery
>;
