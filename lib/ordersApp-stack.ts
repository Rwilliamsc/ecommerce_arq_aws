import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

interface OrdersAppStackProps extends cdk.StackProps {
  productsDdb: dynamodb.Table;
}

export class OrdersAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: OrdersAppStackProps) {
    super(scope, id, props);

    const ordersDdb = new dynamodb.Table(this, "OrdersDdb", {
      tableName: "orders",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
    });

    // lambda layers
    //    order layer
    const ordersLayersArn = ssm.StringParameter.valueForStringParameter(this, "OrdersLayersVersionArn");
    const ordersLayers = lambda.LayerVersion.fromLayerVersionArn(this, "OrdersLayersVersionArn", ordersLayersArn);

    //    Product layer
    const productsLayersArn = ssm.StringParameter.valueForStringParameter(this, "ProductsLayersVersionArn");
    const productsLayers = lambda.LayerVersion.fromLayerVersionArn(this, "ProductsLayersVersionArn", productsLayersArn);
  }
}
