/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createVotingMatter = /* GraphQL */ `mutation CreateVotingMatter(
  $input: CreateVotingMatterInput!
  $condition: ModelVotingMatterConditionInput
) {
  createVotingMatter(input: $input, condition: $condition) {
    id
    votingMatterName
    yesCount
    noCount
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateVotingMatterMutationVariables,
  APITypes.CreateVotingMatterMutation
>;
export const updateVotingMatter = /* GraphQL */ `mutation UpdateVotingMatter(
  $input: UpdateVotingMatterInput!
  $condition: ModelVotingMatterConditionInput
) {
  updateVotingMatter(input: $input, condition: $condition) {
    id
    votingMatterName
    yesCount
    noCount
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateVotingMatterMutationVariables,
  APITypes.UpdateVotingMatterMutation
>;
export const deleteVotingMatter = /* GraphQL */ `mutation DeleteVotingMatter(
  $input: DeleteVotingMatterInput!
  $condition: ModelVotingMatterConditionInput
) {
  deleteVotingMatter(input: $input, condition: $condition) {
    id
    votingMatterName
    yesCount
    noCount
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteVotingMatterMutationVariables,
  APITypes.DeleteVotingMatterMutation
>;
