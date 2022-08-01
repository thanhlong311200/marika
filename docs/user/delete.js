module.exports = {
  delete: {
    tags: ['User'],
    summary: "delete User (by User)",
    operationId: 'deleteUser',
    security: [{
      bearerAuth: []
    }],
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
