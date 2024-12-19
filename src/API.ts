/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateVotingMatterInput = {
  id?: string | null,
  votingMatterName: string,
  yesCount: number,
  noCount: number,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelVotingMatterConditionInput = {
  votingMatterName?: ModelStringInput | null,
  yesCount?: ModelIntInput | null,
  noCount?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelVotingMatterConditionInput | null > | null,
  or?: Array< ModelVotingMatterConditionInput | null > | null,
  not?: ModelVotingMatterConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type VotingMatter = {
  __typename: "VotingMatter",
  id: string,
  votingMatterName: string,
  yesCount: number,
  noCount: number,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type UpdateVotingMatterInput = {
  id: string,
  votingMatterName?: string | null,
  yesCount?: number | null,
  noCount?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteVotingMatterInput = {
  id: string,
};

export type ModelVotingMatterFilterInput = {
  id?: ModelIDInput | null,
  votingMatterName?: ModelStringInput | null,
  yesCount?: ModelIntInput | null,
  noCount?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelVotingMatterFilterInput | null > | null,
  or?: Array< ModelVotingMatterFilterInput | null > | null,
  not?: ModelVotingMatterFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelVotingMatterConnection = {
  __typename: "ModelVotingMatterConnection",
  items:  Array<VotingMatter | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionVotingMatterFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  votingMatterName?: ModelSubscriptionStringInput | null,
  yesCount?: ModelSubscriptionIntInput | null,
  noCount?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionVotingMatterFilterInput | null > | null,
  or?: Array< ModelSubscriptionVotingMatterFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type CreateVotingMatterMutationVariables = {
  input: CreateVotingMatterInput,
  condition?: ModelVotingMatterConditionInput | null,
};

export type CreateVotingMatterMutation = {
  createVotingMatter?:  {
    __typename: "VotingMatter",
    id: string,
    votingMatterName: string,
    yesCount: number,
    noCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdateVotingMatterMutationVariables = {
  input: UpdateVotingMatterInput,
  condition?: ModelVotingMatterConditionInput | null,
};

export type UpdateVotingMatterMutation = {
  updateVotingMatter?:  {
    __typename: "VotingMatter",
    id: string,
    votingMatterName: string,
    yesCount: number,
    noCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type DeleteVotingMatterMutationVariables = {
  input: DeleteVotingMatterInput,
  condition?: ModelVotingMatterConditionInput | null,
};

export type DeleteVotingMatterMutation = {
  deleteVotingMatter?:  {
    __typename: "VotingMatter",
    id: string,
    votingMatterName: string,
    yesCount: number,
    noCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type VoteYesVotingMatterMutationVariables = {
  id: string,
};

export type VoteYesVotingMatterMutation = {
  voteYesVotingMatter?:  {
    __typename: "VotingMatter",
    id: string,
    votingMatterName: string,
    yesCount: number,
    noCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type VoteNoVotingMatterMutationVariables = {
  id: string,
};

export type VoteNoVotingMatterMutation = {
  voteNoVotingMatter?:  {
    __typename: "VotingMatter",
    id: string,
    votingMatterName: string,
    yesCount: number,
    noCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type GetVotingMatterQueryVariables = {
  id: string,
};

export type GetVotingMatterQuery = {
  getVotingMatter?:  {
    __typename: "VotingMatter",
    id: string,
    votingMatterName: string,
    yesCount: number,
    noCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListVotingMattersQueryVariables = {
  filter?: ModelVotingMatterFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListVotingMattersQuery = {
  listVotingMatters?:  {
    __typename: "ModelVotingMatterConnection",
    items:  Array< {
      __typename: "VotingMatter",
      id: string,
      votingMatterName: string,
      yesCount: number,
      noCount: number,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateVotingMatterSubscriptionVariables = {
  filter?: ModelSubscriptionVotingMatterFilterInput | null,
};

export type OnCreateVotingMatterSubscription = {
  onCreateVotingMatter?:  {
    __typename: "VotingMatter",
    id: string,
    votingMatterName: string,
    yesCount: number,
    noCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateVotingMatterSubscriptionVariables = {
  filter?: ModelSubscriptionVotingMatterFilterInput | null,
};

export type OnUpdateVotingMatterSubscription = {
  onUpdateVotingMatter?:  {
    __typename: "VotingMatter",
    id: string,
    votingMatterName: string,
    yesCount: number,
    noCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteVotingMatterSubscriptionVariables = {
  filter?: ModelSubscriptionVotingMatterFilterInput | null,
};

export type OnDeleteVotingMatterSubscription = {
  onDeleteVotingMatter?:  {
    __typename: "VotingMatter",
    id: string,
    votingMatterName: string,
    yesCount: number,
    noCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};
