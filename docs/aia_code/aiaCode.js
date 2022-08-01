module.exports = {
  post: {
    tags: ['AIA Code '],
    summary: "generate AIA code (by Admin)",
    operationId: 'GenerateAIACode',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
            properties: {
              email: {
                type: "string",
                required: true,
                description: "email user",
                example: "defaultemail@gmail.com",
              },
              percent: {
                type: "number",
                description: "Percent for aia code",
                example: 10,
              },
            }
          }
        },
        'application/json': {
          schema: {
            type: "object",
            properties: {
              email: {
                type: "string",
                description: "email user",
                example: "defaultemail@gmail.com",
              },
              percent: {
                type: "number",
                description: "Percent for aia code",
                example: 10,
              },
            }
          }
        },
      }
    },
    responses: {
      '200': {
        description: "Create AIA Code success",
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
                    code: {
                      type: "string",
                      description: "AIA Code",
                      example: "AIAADJD7698ADS",
                    },
                    percent: {
                      type: "number",
                      description: "Percent for aia code",
                      example: "1",
                    },
                    email: {
                      type: "string",
                      description: "email user",
                      example: "defaultemail@gmail.com",
                    },
                    status: {
                      type: "number",
                      description: "Active 1, inactive 0",
                      example: 0,
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
                },
                message: {
                  type: "string",
                  description: "response message",
                  example: "The request was executed successfully"
                },
              }
            }
          }
        }
      },
      '400': {
        description: "Create AIA Code Fail !",
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
}
