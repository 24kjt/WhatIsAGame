/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateVotingMatter = /* GraphQL */ `subscription OnCreateVotingMatter(
  $filter: ModelSubscriptionVotingMatterFilterInput
) {
  onCreateVotingMatter(filter: $filter) {
    id
    votingMatterName
    yesCount
    noCount
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateVotingMatterSubscriptionVariables,
  APITypes.OnCreateVotingMatterSubscription
>;
export const onUpdateVotingMatter = /* GraphQL */ `subscription OnUpdateVotingMatter(
  $filter: ModelSubscriptionVotingMatterFilterInput
) {
  onUpdateVotingMatter(filter: $filter) {
    id
    votingMatterName
    yesCount
    noCount
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateVotingMatterSubscriptionVariables,
  APITypes.OnUpdateVotingMatterSubscription
>;
export const onDeleteVotingMatter = /* GraphQL */ `subscription OnDeleteVotingMatter(
  $filter: ModelSubscriptionVotingMatterFilterInput
) {
  onDeleteVotingMatter(filter: $filter) {
    id
    votingMatterName
    yesCount
    noCount
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteVotingMatterSubscriptionVariables,
  APITypes.OnDeleteVotingMatterSubscription
>;
