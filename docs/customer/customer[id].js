const moment = require("moment");
module.exports = {
  put: {
    tags: ['Manager card'],
    summary: "Update Card (by User)",
    operationId: 'update Card',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "ID CARD UPDATE",
      required: true,
      schema: {
        type: 'string',
      }
    }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: "object",
            properties: {
              address_city: {
                type: 'string',
                example: '',
              },
              address_country: {
                type: 'string',
                description: "",
                example: '',
              },
              address_line1: {
                type: 'string',
                example: '',
              },
              address_line2: {
                type: 'string',
                example: '',
              },
              address_state: {
                type: 'string',
                example: '',
              },
              address_zip: {
                type: 'number',
                example: 333,
              },
              exp_month: {
                type: 'number',
                example: '',
              },
              exp_year: {
                type: 'number',
                example: '',
              },
              metadata: {
                type: 'object',
                example: '',
              },
              name: {
                type: 'string',
                example: '',
              },
            }
          }
        },
      }
    },
    responses: {
      '200': {
        description: "Update success",
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
                            "id": "card_1KFgeuER44rRd...",
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
                            "customer": "cus_KvXdeuER44rRd...",
                            "cvc_check": "pass",
                            "dynamic_last4": null,
                            "exp_month": 4,
                            "exp_year": 2025,
                            "fingerprint": "VvyUGjVveuER44rRd...",
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
        description: "Update Fail !",
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
  delete: {
    tags: ['Manager card'],
    summary: "Delete list Card (by User)",
    operationId: 'Delete list Card',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "ID CARD DELETE",
      required: true,
      schema: {
        type: 'string',
      }
    }],
    responses: {
      '200': {
        description: "Delete success",
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
                        "id": "card_1KFgbsER....",
                        "object": "card",
                        "deleted": true
                      }
                    `
                },

              }
            }
          },
        },
      },
      '400': {
        description: "Delete Fail !",
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
