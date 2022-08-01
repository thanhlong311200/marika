module.exports = {
  get: {
    tags: ['Get Codes - (Promo or AIA)'],
    summary: "get code by name (by User, Admin)",
    operationId: 'getCodes',
    parameters: [{
      name: 'code',
      in: 'query',
      description: "code query",
      required: true,
      schema: {
        type: 'string',
      }
    }],
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
                  type: 'object',
                  description: "Demo Response Promo code",
                  properties: {
                    id: {
                      type: 'string',
                      description: "Promo code",
                      example: "61bce58ad69ba1db79507032"
                    },
                    autoGenerate: {
                      type: 'boolean',
                      description: "random make code with length 10",
                      example: "ba1db7950A"
                    },
                    promoCode: {
                      type: 'string',
                      description: "Promo code",
                      example: "KHUYEN_MAI_NOEL"
                    },
                    percent: {
                      type: 'number',
                      description: "percent for code",
                      example: "10"
                    },
                    price: {
                      type: 'number',
                      description: "price code",
                      example: "20000"
                    },
                    numberOfUse: {
                      type: 'number',
                      description: 'numberOfUes',
                      example: '20'
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
