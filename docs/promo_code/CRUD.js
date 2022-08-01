module.exports = {
  // get: {
  //   tags: ['PromoCode'],
  //   description: "get By Id",
  //   operationId: 'getByIdPromo',
  //   parameters: [{
  //     name: 'id',
  //     in: 'path',
  //     description: "PromoCode Id",
  //     required: true,
  //     schema: {
  //       type: 'string',
  //     }
  //   }],
  //   security: [{
  //     bearerAuth: []
  //   }],
  //   responses: {
  //     '200': {
  //       content: {
  //         'application/json': {
  //           schema: {
  //             type: 'object',
  //             properties: {
  //               code: {
  //                 type: "string",
  //                 description: "response code",
  //                 example: "SUCCESS"
  //               },
  //               data: {
  //                 properties: {
  //                   id: {
  //                     type: 'string',
  //                     description: "Promo code",
  //                     example: "61bce58ad69ba1db79507032"
  //                   },
  //                   promoCode: {
  //                     type: 'string',
  //                     description: "Promo code",
  //                     example: "KHUYEN_MAI_NOEL"
  //                   },
  //                   percent: {
  //                     type: 'number',
  //                     description: "percent for code",
  //                     example: "10"
  //                   },
  //                   price: {
  //                     type: 'number',
  //                     description: "price code",
  //                     example: "20000"
  //                   },
  //                   numberOfUse: {
  //                     type: 'number',
  //                     description: 'numberOfUes',
  //                     example: '20'
  //                   },
  //                 }
  //               }
  //             }
  //           },
  //         }
  //       }
  //     },
  //     '401': {
  //       content: {
  //         'application/json': {
  //           schema: {
  //             $ref: "#/components/schemas/Error401"
  //           }
  //         }
  //       },
  //     },
  //     '404': {
  //       content: {
  //         'application/json': {
  //           schema: {
  //             $ref: "#/components/schemas/Error404"
  //           }
  //         }
  //       },
  //     },
  //   },
  // },
  put: {
    tags: ['PromoCode'],
    summary: "update promo code (by Admin)",
    operationId: 'UpdatePromoCode',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "PromoCode Id",
      required: true,
      schema: {
        type: 'string',
      }
    }],
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              percent: {
                type: 'number',
                description: "percent for code",
                example: "0"
              },
              price: {
                type: 'number',
                description: "price code",
                example: "20000"
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
              percent: {
                type: 'number',
                description: "percent for code",
                example: "0"
              },
              price: {
                type: 'number',
                description: "price code",
                example: "20000"
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
        description: "Update profile success",
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
          }
        },
      },
      '422': {
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
  delete: {
    tags: ['PromoCode'],
    summary: "delete promo code (by Admin)",
    operationId: 'DeletePromoCode',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "PromoCode Id",
      required: true,
      schema: {
        type: 'string',
      }
    }],
    security: [{
      bearerAuth: []
    }],
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '404': {
        description: "Delete Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error404"
            }
          }
        },
      },
    },
  }
}
