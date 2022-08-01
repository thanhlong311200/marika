const moment = require("moment");
module.exports = {
  post: {
    tags: ['Manager card'],
    summary: "Create Card (by User)",
    operationId: 'create Card',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: "object",
            properties: {
              number: {
                type: 'string',
                description: "The number in the card",
                example: '4242424242424242',
              },
              expMonth: {
                type: 'number',
                description: "Number in range 1 -> 12",
                example: 4,
              },
              expYear: {
                type: 'number',
                description: "Number than equal the current year",
                example: 2025,
              },
              cvc: {
                type: 'number',
                description: "Number than equal the current year",
                example: 333,
              },
            }
          }
        },
      }
    },
    responses: {
      '200': {
        description: "Create success",
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
                  example:
                    `
                          {
                            "id": "card_1KFgeuERMcPVr2IeuER44rRd...",
                            "object": "card",
                            "address_city": null,
                            "address_country": null,
                            "address_line1": null,
                            "address_line1_check": null,
                            "address_line2": null,
                            "address_state": null,
                            "address_zip": null,
                            "address_zip_check": null,
                            "brand": "Visa",
                            "country": "US",
                            "customer": "cus_KvXdAt05PeuER44rRd...",
                            "cvc_check": "pass",
                            "dynamic_last4": null,
                            "exp_month": 4,
                            "exp_year": 2025,
                            "fingerprint": "VvyUGjVvXcPeeuER44rRd...",
                            "funding": "debit",
                            "last4": "5556",
                            "metadata": {},
                            "name": null,
                            "tokenization_method": null
                        }
                    `
                },

              }
            }
          },
        },
      },
      '400': {
        description: "Create Fail !",
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
    }
  },
  get: {
    tags: ['Manager card'],
    summary: "Get list Card (by User)",
    operationId: 'get list Card',
    responses: {
      '200': {
        description: "Get success",
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
                  example:
                    `
                          {
                          "object": "list",
                          "data": [
                              {
                                  "id": "card_1KFgXzERMeuER44rRd...",
                                  "object": "card",
                                  "address_city": null,
                                  "address_country": null,
                                  "address_line1": null,
                                  "address_line1_check": null,
                                  "address_line2": null,
                                  "address_state": null,
                                  "address_zip": null,
                                  "address_zip_check": null,
                                  "brand": "Visa",
                                  "country": "US",
                                  "customer": "cus_KvXdAAeuER44rRd...",
                                  "cvc_check": "pass",
                                  "dynamic_last4": null,
                                  "exp_month": 4,
                                  "exp_year": 2025,
                                  "fingerprint": "FUZooBoCeuER44rRd...",
                                  "funding": "credit",
                                  "last4": "4242",
                                  "metadata": {},
                                  "name": null,
                                  "tokenization_method": null
                              },
                              {
                                  "id": "card_1KFSIZeuER44rRd...",
                                  "object": "card",
                                  "address_city": null,
                                  "address_country": null,
                                  "address_line1": null,
                                  "address_line1_check": null,
                                  "address_line2": null,
                                  "address_state": null,
                                  "address_zip": null,
                                  "address_zip_check": null,
                                  "brand": "Visa",
                                  "country": "US",
                                  "customer": "cus_KvAeuER44rRd....",
                                  "cvc_check": "pass",
                                  "dynamic_last4": null,
                                  "exp_month": 4,
                                  "exp_year": 2025,
                                  "fingerprint": "VvyU",
                                  "funding": "debit",
                                  "last4": "5556",
                                  "metadata": {},
                                  "name": null,
                                  "tokenization_method": null
                              }
                          ],
                          "has_more": false,
                          "url": "/v1/customers/cus_K4A/sources"
                      }
                    `
                },

              }
            }
          },
        },
      },
      '400': {
        description: "GET Fail !",
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
    }
  }
}
