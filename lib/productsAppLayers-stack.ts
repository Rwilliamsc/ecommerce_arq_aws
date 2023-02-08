import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ssm from "aws-cdk-lib/aws-ssm";

export class ProductsAppLayersStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productsLayers = new lambda.LayerVersion(this, "ProductsLayers", {
      code: lambda.Code.fromAsset("lambda/products/layers/productsLayer"),
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
      layerVersionName: "ProductsLayers",
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    new ssm.StringParameter(this, "ProductsLayersVersionArn", {
      parameterName: "ProductsLayersVersionArn",
      stringValue: productsLayers.layerVersionArn,
    });

    const productsEventsLayers = new lambda.LayerVersion(this, "ProductsEventsLayers", {
      code: lambda.Code.fromAsset("lambda/products/layers/productsEventsLayer"),
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
      layerVersionName: "ProductsEventsLayers",
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    new ssm.StringParameter(this, "ProductsEventsLayersVersionArn", {
      parameterName: "ProductsEventsLayersVersionArn",
      stringValue: productsEventsLayers.layerVersionArn,
    });
  }
}
