module.exports = {
  get: {
    tags: ["Survey Answer"],
    summary: "get report a survey (by Admin)",
    operationId: "GetReportSurvey",
    parameters: [],
    responses: {
      200: {
        description: "Get report survey success",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  description: "response code",
                  example: "SUCCESS",
                },
                data: {
                  properties: {
                    _id: {
                      type: "string",
                      description: "Survey id",
                      example: "61bce58ad69ba1db79507032",
                    },
                    name: {
                      type: "string",
                      description: "Name of the survey",
                      example: "health",
                    },
                    status: {
                      type: "number",
                      description: "Status of the survey",
                      example: 1,
                    },
                    count: {
                      type: "number",
                      description: "Total user do this survey",
                      example: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
      404: {
        description: "Get report survey fail!",
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
