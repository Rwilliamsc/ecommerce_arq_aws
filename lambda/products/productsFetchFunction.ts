import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  // Id created by lambda
  const lambdaRequestId = context.awsRequestId;

  // Id created by APIgateway when invoking lambda
  const apiRequestId = event.requestContext.resourceId;

  console.log(
    `API Gateway RequestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`
  );

  const method = event.httpMethod;

  if (event.resource === "/products") {
    if (method === "GET") {
      console.log("The GET method was called");

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "The GET method was called",
        }),
      };
    }
  }
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Bad request",
    }),
  };
}
