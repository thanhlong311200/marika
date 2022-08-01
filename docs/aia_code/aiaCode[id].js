module.exports = {
  put: {
    tags: ['AIA Code '],
    summary: "update AIA Code (by Admin)",
    operationId: 'UpdateAIACode',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "Id AIA Code",
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
                description: '1: active, 0 inactive',
                example: 1
              },
              percent: {
                type: "number",
                description: "Percent for aia code",
                example: 1,
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
                description: '1: active, 0 inactive',
                example: 1
              },
              percent: {
                type: "number",
                description: "Percent for aia code",
                example: 1,
              },
            },
          }
        },
      }
    },
    responses: {
      '200': {
        description: "Update AIA Code success",
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
        description: "Change AIA Code Fail !",
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
  delete: {
    tags: ['AIA Code '],
    summary: "delete AIA Code (by Admin)",
    operationId: 'DeleteAIACode',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "AIA Code Id",
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
        description: "Delete AIA Code success !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
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
      '404': {
        description: "Delete AIA Code Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error404"
            }
          }
        },
      },
      '400': {
        description: "Delete AIA Code Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error400"
            }
          }
        },
      },
    }
  },
  get: {
    tags: ['AIA Code '],
    summary: "get AIA Code By Id (by Admin)",
    operationId: 'GetAIACodeById',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "AIA code Id",
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
        description: "Get AIA Code by id success",
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
                    _id: {
                      type: "string",
                      description: "id aia code",
                      example: "7654789090897697087",
                    },

                  }
                }
              }
            }
          }
        }
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
      '400': {
        description: "Get AIA Code Fail !",
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
    },
  },
}
