module.exports = {
  put: {
    tags: ['Membership Type'],
    summary: "update membership type by id (by Admin)",
    operationId: 'updateMembershipType',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "id of membership type",
      required: true,
      schema: {
        type: 'string',
      }
    }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
            properties: {
              name: {
                type: 'string',
                description: "name membership type",
                example: 'category test',
              },
              description: {
                type: 'string',
                description: "description membership type",
                example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
              },
            }
          }
        },
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: "name membership type",
                example: 'category test',
              },
              description: {
                type: 'string',
                description: "description membership type",
                example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Update membership type success",
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
                    name: {
                      type: 'string',
                      description: "name membership type",
                      example: 'category test',
                    },
                    description: {
                      type: 'string',
                      description: "description membership type",
                      example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
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
        description: "Change membership type Fail !",
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
    tags: ['Membership Type'],
    summary: "delete membership type by id (by Admin)",
    operationId: 'deleteMembershipType',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of membership type",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "delete membership type success!",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "Delete membership type Fail !",
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
    },
  },
  get: {
    tags: ['Membership Type'],
    summary: "get membership type by id (by User & Admin)",
    operationId: 'GetMembershipType',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of membership type",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "Get membership type by id success",
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
                    name: {
                      type: 'string',
                      description: "name membership type",
                      example: 'category test',
                    },
                    description: {
                      type: 'string',
                      description: "description membership type",
                      example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
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
        description: "Get membership type Fail !",
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
    },
  },
}
