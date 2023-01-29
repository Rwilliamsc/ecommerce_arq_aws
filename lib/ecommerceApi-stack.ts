import * as cdk from "aws-cdk-lib";
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cwlogs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

// Create a new cdk.StackProps extension interface to send the lambda function that will be integrated
interface ECommerceApiStackProps extends cdk.StackProps {
  productsFetchHandler: lambdaNodeJS.NodejsFunction;
  productsAdminHandler: lambdaNodeJS.NodejsFunction;
}

export class ECommerceApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ECommerceApiStackProps) {
    super(scope, id, props);

    // create a new log group
    const logGroup = new cwlogs.LogGroup(this, "ECommerceApiLogs");

    const api = new apigateway.RestApi(this, "ECommerceApi", {
      restApiName: "ECommerceAPI",
      cloudWatchRole: true,
      // configure logs
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: true,
          status: true,
          caller: true,
          user: true,
        }),
      },
    });

    const productsFetchIntegration = new apigateway.LambdaIntegration(
      props.productsFetchHandler
    );
    const productsAdminIntegration = new apigateway.LambdaIntegration(
      props.productsAdminHandler
    );

    // create resources in the apigateway
    // "GET:/products"
    const productsResource = api.root.addResource("products");
    productsResource.addMethod("GET", productsFetchIntegration);

    // "GET:/products/{id}"
    const productsIdResource = productsResource.addResource("{id}");
    productsIdResource.addMethod("GET", productsFetchIntegration);

    // "POST:/products"
    productsResource.addMethod("POST", productsAdminIntegration);

    // "PUT:/products/{id}"
    productsIdResource.addMethod("PUT", productsAdminIntegration);

    // "DELETE:/products/{id}"
    productsIdResource.addMethod("DELETE", productsAdminIntegration);
  }
}
