#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ProductsAppStack } from "../lib/productsApp-stack";
import { ECommerceApiStack } from "../lib/ecommerceAPI-stack";
import { account } from "../config/account";

const app = new cdk.App();

const env: cdk.Environment = {
  account: account,
  region: "us-east-1",
};

const tags = {
  const: "Ecommerce",
  team: "Developer",
  type: "study",
};

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  tags: tags,
  env: env,
});

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceAPI", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags: tags,
  env: env,
});

eCommerceApiStack.addDependency(productsAppStack);
