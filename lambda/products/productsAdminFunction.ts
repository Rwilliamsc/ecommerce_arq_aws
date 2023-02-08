import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { Product, ProductRepository } from "/opt/nodejs/productsLayer";
import { DynamoDB, Lambda } from "aws-sdk";
import { ProductEvent, ProductEventType } from "/opt/nodejs/productsEventsLayer";
import * as AWSXRay from "aws-xray-sdk";

AWSXRay.captureAWS(require("aws-sdk"));

const productsDdb = process.env.PRODUCTS_DDB!;
const productsEventsFunctioName = process.env.PRODUCTS_EVENTS_FUNCTION_NAME!;
const ddbClient = new DynamoDB.DocumentClient();
const lambdaClient = new Lambda();
const productRepository = new ProductRepository(ddbClient, productsDdb);

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  // Id created by lambda
  const lambdaRequestId = context.awsRequestId;

  // Id created by APIgateway when invoking lambda
  const apiRequestId = event.requestContext.resourceId;

  console.log(`API Gateway RequestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`);

  const method = event.httpMethod;

  if (event.resource === "/products") {
    console.log("POST: /products");

    const product = JSON.parse(event.body!) as Product;
    const productCreated = await productRepository.create(product);

    const response = await sendproductEvent(product, ProductEventType.CREATED, "teste@teste.com", lambdaRequestId);
    console.log("response envent function: ", response);

    return {
      statusCode: 201,
      body: JSON.stringify(productCreated),
    };
  } else if (event.resource === "/products/{id}") {
    const productId = event.pathParameters!.id as string;
    if (method === "PUT") {
      console.log(`PUT: /products/${productId}`);

      const product = JSON.parse(event.body!) as Product;

      try {
        const productUpdated = await productRepository.updateProduct(productId, product);

        const response = await sendproductEvent(productUpdated, ProductEventType.UPDATED, "teste2@teste.com", lambdaRequestId);
        console.log("response envent function: ", response);

        return {
          statusCode: 200,
          body: JSON.stringify(productUpdated),
        };
      } catch (ConditionCheckFailedException) {
        console.error(`PUT: /products/${productId} Error: `, (<Error>ConditionCheckFailedException).message);
        return {
          statusCode: 404,
          body: "Product not found",
        };
      }
    } else if (method === "DELETE") {
      console.log(`DELETE: /products/${productId}`);

      try {
        const productDeleted = await productRepository.deleteProduct(productId);

        const response = await sendproductEvent(productDeleted, ProductEventType.DELETED, "teste3@teste.com", lambdaRequestId);
        console.log("response envent function: ", response);

        return {
          statusCode: 200,
          body: JSON.stringify(productDeleted),
        };
      } catch (error) {
        console.error(`DELETE: /products/${productId} Error: `, (<Error>error).message);
        return {
          statusCode: 404,
          body: (<Error>error).message,
        };
      }
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Bad request",
    }),
  };
}

function sendproductEvent(product: Product, eventType: ProductEventType, email: string, lambdaRequestId: string) {
  const event: ProductEvent = {
    email: email,
    eventType: eventType,
    productCode: product.code,
    productId: product.id,
    productPrice: product.price,
    requestId: lambdaRequestId,
  };

  return lambdaClient
    .invoke({
      FunctionName: productsEventsFunctioName,
      Payload: JSON.stringify(event),
      InvocationType: "RequestResponse",
    })
    .promise();
}
