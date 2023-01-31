# Welcome to your CDK TypeScript project

Execute this command to create a blank project with TypeScript.
`cdk init --language typescript`

Now this is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

Export your credentials before creating the CDK environment

- export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
- export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
- export AWS_DEFAULT_REGION=us-west-2

creating the CDK environment.
This command below only needs to be executed once, per account and per region.

`cdk bootstrap`

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk deploy --all` deploy all stack to your default AWS account/region
- `cdk destroy --all` destroy all stack of the your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
- `cdk list` list all stacks
