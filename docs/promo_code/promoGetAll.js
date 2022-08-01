module.exports = {
  get: {
    tags: ['PromoCode'],
    summary: "get promo codes (by Admin)",
    operationId: 'GetListPromocodes',
    parameters: [{
      name: 'promoCode',
      in: 'query',
      description: "PromoCode",
      // required: true,
      schema: {
        type: 'string',
      },
    },
      {
        name: 'pageNumber',
        in: 'query',
        description: "page number pagination",
        schema: {
          type: 'number',
          default: 0,
        }
      },
      {
        name: 'itemsPerPage',
        in: 'query',
        description: "items per Page pagination",
        schema: {
          type: 'number',
          default: 10,
        }
      },
    ],
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: {
                  type: "string",
                  description: "response code",
                  example: "SUCCESS"
                },
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      _id: {
                        type: 'string',
                        description: "Promo code",
                        example: "61bcf94ecf3cd7b23b3e8dbd"
                      },
                      autoGenerate: {
                        type: 'boolean',
                        description: "auto Generate code",
                        example: true
                      },
                      promoCode: {
                        type: 'string',
                        description: "Promo code",
                        example: "KHUYEN_MAI_NOEL"
                      },
                      percent: {
                        type: 'number',
                        description: "percent for code",
                        example: "0"
                      },
                      price: {
                        type: 'number',
                        description: "price code",
                        example: "20"
                      },
                      numberOfUse: {
                        type: 'number',
                        description: "Number of user",
                        example: 0
                      },
                      couponId: {
                        type: 'string',
                        description: "Stripe coupon Id",
                        example: "8kjKKD3s"
                      },
                      codeId: {
                        type: 'string',
                        description: "Stripe promo Id",
                        example: "promo_1KI67PGGIAKJL"
                      },
                    }
                  }
                }
              }
            },
          }
        }
      },
      '401': {
        description: "Get promo code fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error401"
            }
          }
        },
      },
      '404': {
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error404"
            }
          }
        },
      },
    },
  },
}
