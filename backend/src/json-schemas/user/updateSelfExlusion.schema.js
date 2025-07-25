export const updateSelfExclusionSchema={
  body: {
    type: 'object',
    properties: {
      selfExclusion: { type: 'string' },
      isSelfExclusionPermanent: { type: ['boolean','null'] },
      selfExclusionType: { type: ['string','null'] },
      selfExclusion: { type: ['string','null'] }
    },
    required: ['selfExclusion']
  }
}
