module.exports = {
  delete: {
    tags: ['Media'],
    summary: "delete media by id of media (by Admin)",
    operationId: 'Deletemedia',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "mediaId you want to delete, id: 61cb374eba7d0a061825551f",
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
        description: "Delete media Success !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "Delete media fail!",
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
  }
}
