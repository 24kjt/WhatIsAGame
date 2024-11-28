export const schema = {
    name: 'Vote',
    fields: {
      id: { type: 'ID', isRequired: true },
      choice: { type: 'String', isRequired: true },
      timestamp: { type: 'AWSDateTime', isRequired: true }
    }
  };