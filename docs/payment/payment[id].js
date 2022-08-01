module.exports = {
  put: {
    tags: ['Payment '],
    summary: "update Payment by id (by Admin)",
    operationId: 'updatePayment',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "Update Payment by payment id: 61c38a6b062df1b2f89d5",
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
            type: "object",
            properties: {
              status: {
                type: 'string',
                description: "'pending', 'succeeded', 'reject'",
                example: "pending",
              },
            }
          }
        },
        'application/json': {
          schema: {
            type: "object",
            properties: {
              status: {
                type: 'string',
                description: "'pending', 'succeeded', 'reject'",
                example: "pending",
              },
            }
          }
        },
      }
    },
    responses: {
      '200': {
        description: "Update Payment success",
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
                  properties: {
                    userId: {
                      type: 'string',
                      description: "user id payment",
                      example: '61c3692db436',
                    },
                    orders: {
                      type: 'object',
                      description: 'Data stripe order payment field *IMPORTANT<br> ' +
                        '`id`: Unique identifier for the object. used to check the transaction.<br>' +
                        '`object`: The type of webhook that will be received when paying.<br>' +
                        '`amount`: Amount intended to be collected by this PaymentIntent<br>' +
                        '`currency`: Three-letter ISO currency code, in lowercase. Must be a supported currency.<br>' +
                        '`receipt_email`: Email address that the receipt for the resulting payment will be sent to.<br>' +
                        '`created`: Time at which the object was created. Measured in seconds since the Unix epoch.<br>' +
                        '`status`: Status of this PaymentIntent (requires_payment_method, canceled, succeeded, processing, requires_capture...)<br>',
                      example: `
                          {
                              "id": "pi_3KBsxuF9MnwHu4ZY27ah2wYF",
                              "object": "payment_method",
                              "amount": 2000,
                              "created": 1640748998,
                              "currency": "aud",
                              "receipt_email": null,
                              "status": "requires_payment_method"
                            }
                          `,
                    },
                    membershipId: {
                      type: 'string',
                      description: "membership Id",
                      example: '61c88c33f22adc8f906fc359',
                    },
                    // orderId: {
                    //   type: 'string',
                    //   description: "order Id",
                    //   example: '123456',
                    // },
                    aiaCode: {
                      type: 'string',
                      description: "Aia Code",
                      example: 'WQiOiI2MWM2ZDA3YzhjOWQz',
                    },
                    promoCode: {
                      type: 'string',
                      description: "promo Code",
                      example: 'WQiOiI2MWM2ZDA3YzhjOWQz',
                    },
                    price: {
                      type: 'number',
                      description: "Amount Payment",
                      example: 199,
                    },
                    note: {
                      type: 'string',
                      description: "Some thing about payment",
                      example: '',
                    },
                    status: {
                      type: 'string',
                      description: "'pending', 'succeeded', 'reject'",
                      example: "pending",
                    },
                    _id: {
                      type: 'string',
                      description: "id payment",
                      example: "61c38a6b062df1b2f89d5",
                    }
                  }
                }
              }
            }
          }
        }
      },
      '400': {
        description: "Change Payment Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error400"
            }
          }
        },
      },
      '401': {
        description: "Permission Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error401"
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
      '500': {
        description: 'Server error'
      }
    },
  },
  get: {
    tags: ['Payment '],
    summary: "get payment by Id (by User)",
    operationId: 'getPaymentById',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "PaymentId you want to get, id: 61c38a6b062df1b2f89d5",
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
        description: "Get Payment by id success",
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
                  properties: {
                    userId: {
                      type: 'string',
                      description: "user id payment",
                      example: '61c3692db436',
                    },
                    orders: {
                      type: 'object',
                      description: 'Data stripe order payment field *IMPORTANT<br> ' +
                        '`id`: Unique identifier for the object. used to check the transaction.<br>' +
                        '`object`: The type of webhook that will be received when paying.<br>' +
                        '`amount`: Amount intended to be collected by this PaymentIntent<br>' +
                        '`currency`: Three-letter ISO currency code, in lowercase. Must be a supported currency.<br>' +
                        '`receipt_email`: Email address that the receipt for the resulting payment will be sent to.<br>' +
                        '`created`: Time at which the object was created. Measured in seconds since the Unix epoch.<br>' +
                        '`status`: Status of this PaymentIntent (requires_payment_method, canceled, succeeded, processing, requires_capture...)<br>',
                      example: `
                          {
                              "id": "pi_3KBsxuF9MnwHu4ZY27ah2wYF",
                              "object": "payment_method",
                              "amount": 2000,
                              "created": 1640748998,
                              "currency": "aud",
                              "receipt_email": null,
                              "status": "requires_payment_method"
                            }
                          `,
                    },
                    membershipId: {
                      type: 'string',
                      description: "membership Id",
                      example: '61c88c33f22adc8f906fc359',
                    },
                    // orderId: {
                    //   type: 'string',
                    //   description: "order Id",
                    //   example: '123456',
                    // },
                    aiaCode: {
                      type: 'string',
                      description: "Aia Code",
                      example: 'WQiOiI2MWM2ZDA3YzhjOWQz',
                    },
                    promoCode: {
                      type: 'string',
                      description: "promo Code",
                      example: 'WQiOiI2MWM2ZDA3YzhjOWQz',
                    },
                    price: {
                      type: 'number',
                      description: "Amount Payment",
                      example: 199,
                    },
                    note: {
                      type: 'string',
                      description: "Some thing about payment",
                      example: '',
                    },
                    status: {
                      type: 'string',
                      description: "'pending', 'succeeded', 'reject'",
                      example: "pending",
                    },
                    _id: {
                      type: 'string',
                      description: "id payment",
                      example: "61c38a6b062df1b2f89d5",
                    }
                  }
                }
              }
            }
          }
        }
      },
      '400': {
        description: "Get Payment Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error400"
            }
          }
        },
      },
      '401': {
        description: "Permission Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error401"
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
    },
  },
}
