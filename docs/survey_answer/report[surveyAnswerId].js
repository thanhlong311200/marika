module.exports = {
  get: {
    tags: ["Survey Answer"],
    summary: "get report survey answer by id (by User & Admin)",
    operationId: "GetReportSurveyById",
    parameters: [
      {
        name: "surveyAnswerId",
        in: "path",
        description: "Survey id Answer want to get, id: 61c8baa49339e96dec595998",
        required: true,
        schema: {
          type: "string",
        },
        example: "61c8baa49339e96dec595998",
      },
    ],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                surveyId: {
                  type: "string",
                  description: "Id of survey",
                  example: "61c8bd991034f621a997418a",
                },
                userId: {
                  type: "string",
                  description: "Id of user",
                  example: "61c3ed71f498c31bd1dc3b8d",
                },
                result: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      "61c8a864aab74baa1031775a": {
                        type: "number",
                        description: "value",
                        example: 1,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      404: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error404",
            },
          },
        },
      },
    },
  },
};
