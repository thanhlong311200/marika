module.exports = {
  post: {
    tags: ['System'],
    summary: "create system (by Admin)",
    operationId: 'createSystem',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
            required: [
              "field",
              "value",
            ],
            properties: {
              field: {
                type: 'string',
                description: "field system",
                example: 'redirect_uri',
              },
              value: {
                type: 'string',
                description: "value of field",
                example: 'https://marikaday.com',
              },
            }
          }
        },
        'application/json': {
          schema: {
            type: 'object',
            required: [
              "field",
              "value",
            ],
            properties: {
              field: {
                type: 'string',
                description: "field system",
                example: 'redirect_uri',
              },
              value: {
                type: 'string',
                description: "value of field",
                example: 'https://marikaday.com',
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Create system success",
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
                    _id: {
                      $ref: "#/components/schemas/_id"
                    },
                    field: {
                      type: 'string',
                      description: "field system",
                      example: 'redirect_uri',
                    },
                    value: {
                      type: 'string',
                      description: "value of field",
                      example: 'https://marikaday.com',
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
        description: "Create system Fail !",
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
