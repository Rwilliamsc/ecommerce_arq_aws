#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ProductsAppStack } from "../lib/productsApp-stack";
import { ECommerceApiStack } from "../lib/ecommerceAPI-stack";
import { credentials } from "../config/credentials";

const app = new cdk.App();

const env: cdk.Environment = {
  account: credentials.account,
  region: credentials.region,
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
  tags: tags,
  env: env,
});

eCommerceApiStack.addDependency(productsAppStack);
