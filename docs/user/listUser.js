module.exports = {
  get: {
    tags: ['User'],
    summary: "Get list User (by Admin)",
    operationId: 'getListUser',
    parameters: [
      {
        name: 'roles',
        in: 'query',
        description: "roles of user. eg: roles=member",
        schema: {
          type: 'string',
          enum: ["member", "admin"],
        }
      },
      {
        name: 'status',
        in: 'query',
        description: "status of user. eg: status=true",
        schema: {
          type: 'boolean',
          enum: [true, false],
        }
      },
      {
        name: 'pageNumber',
        in: 'query',
        description: "page number pagination",
        schema: {
          type: 'number',
          default: 0,
        }
      },
      {
        name: 'itemsPerPage',
        in: 'query',
        description: "items per Page pagination",
        schema: {
          type: 'number',
          default: 10,
        }
      },
    ],
    responses: {
      '200': {
        description: "delete profile success !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "delete user Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error400"
            }
          }
        },
      },
      '401': {
        description: "delete user Fail !",
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
