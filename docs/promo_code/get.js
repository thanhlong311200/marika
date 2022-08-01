module.exports = {
  post: {
    tags: ['PromoCode'],
    summary: "create promo code (by Admin)",
    operationId: 'CreatePromoCode',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              autoGenerate: {
                type: 'boolean',
                description: "Random make code with length 10",
                example: true
              },
              promoCode: {
                type: 'string',
                description: "Promo code ",
                example: ""
              },
              percent: {
                type: 'number',
                description: "percent code (%)",
                example: 0
              },
              price: {
                type: 'number',
                description: "price code ($)",
                example: 20
              },
              numberOfUse: {
                type: 'number',
                description: 'numberOfUes',
                example: 0
              },
            }
          }
        },
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              autoGenerate: {
                type: 'boolean',
                description: "Random make code with length 10",
                example: true
              },
              promoCode: {
                type: 'string',
                description: "Promo code",
                example: ""
              },
              percent: {
                type: 'number',
                description: "percent code (%)",
                example: 0
              },
              price: {
                type: 'number',
                description: "price code ($)",
                example: 20
              },
              numberOfUse: {
                type: 'number',
                description: 'numberOfUes',
                example: 0
              },
            }
          }
        },
      }
    },
    responses: {
      '200': {
        description: "Create promo code",
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: "Code",
                  example: "SUCCESS"
                },
                message: {
                  type: 'string',
                  description: "The request was executed successfully",
                  example: "The request was executed successfully"
                },
                data: {
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
          }
        },
      },
      '400': {
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error400"
            }
          }
        },
      },
      '422': {
        description: "Invalid field",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error422"
            }
          }
        }
      },
    }
  },
  get: {
    tags: ['PromoCode'],
    summary: "get promo codes (by User)",
    operationId: 'GetPromocodes',
    parameters: [{
      name: 'promoCode',
      in: 'query',
      description: "PromoCode",
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
