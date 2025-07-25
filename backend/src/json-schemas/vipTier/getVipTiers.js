export const getVipTiersSchema = {
  query: {
    type: "object",
    properties: {
      limit: { type: "string", minimum: 1 },
      pageNo: { type: "string", minimum: 1 }
    },
    required: [],
  },
};
