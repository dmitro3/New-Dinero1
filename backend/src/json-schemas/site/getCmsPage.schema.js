export const getCmsPageSchema = {
  query: {
    type: 'object',
    properties: {
      cmsPageId: { type: 'string' },
      cmsSlug: { type: 'string' },
      language: { type: ['string', 'null'] }
    },
    required: ['cmsSlug']
  }
}
