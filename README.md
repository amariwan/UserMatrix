# **UserMatrix**

[![dotenv-vault](https://badge.dotenv.org/works-with.svg?r=1)](https://www.dotenv.org/r/github.com/dotenv-org/dotenv-vault?r=1)

**UserMatrix** - A Cutting-Edge API Server Template for User Identity and Management

## 🌟 **Features**

-   **Waiting List Management:** Effortlessly handle waiting lists.
-   **Seamless Google Sign-In:** Allow users to log in quickly via Google.
-   **Secure Token Rotation:** Protect users with advanced token rotation.
-   **Role-Based Access Control:** Implement precise access controls based on roles.
-   **Email and Password Registration:** Simplified registration with email and password.
-   **Email Login:** Direct access for registered email users.
-   **Email Verification:** Ensure users confirm their email addresses.
-   **Phone Number Verification:** Verify phone numbers for added security.
-   **SMS OTP Login:** Authenticate via one-time password sent via SMS.
-   **Email OTP Login:** Secure login with one-time password sent via email.
-   **Password Reset:** User-friendly password recovery system.
-   **Global Logout:** Allow users to log out from all devices.
-   **Account Deletion:** Completely remove user accounts upon request.
-   **Profile Update:** Easy profile updates for users.
-   **Profile Pictures:** Manage user profile pictures effortlessly.
-   **Real-Time Communication:** WebSocket support via GraphQL subscriptions.
-   **Brute-Force Protection:** Defend against automated login attempts.
-   **Comprehensive User Management:** All you need for effective user management.

## 🔧 **Prerequisites**

-   [Docker](https://www.docker.com/) – Essential for containerization and management.

## 🚀 **Getting Started with UserMatrix**

### 🌱 **Set Up Environment Variables**

-   **For an Existing Project**

```sh
npx dotenv-vault login
npx dotenv-vault pull
```

-   **For a New Project**

```sh
cp .env.example .env
```

### ☁️ **Integrate 3rd-Party Services**

#### **[AWS](https://aws.amazon.com/console/)**

-   Set your `AWS_REGION`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` variables.
-   Create an [S3 Bucket](https://aws.amazon.com/s3/) for document storage and set your `AWS_S3_BUCKET`.
-   Follow [AWS Serverless Image Handler](https://aws.amazon.com/solutions/implementations/serverless-image-handler/) instructions to set up a CDN and configure `CLOUDFRONT_API_ENDPOINT`.
-   Create a [DynamoDB Table](https://aws.amazon.com/dynamodb/) for in-app notifications and set your `AWS_DYNAMODB_DELTA_TABLE`.
-   Set up [SES](https://aws.amazon.com/ses/) for email (ensure you have the [AWS IAM Policy](https://nodemailer.com/transports/ses/#example-3)) and add your `SENDER_EMAIL`.
-   Set up [SNS](https://aws.amazon.com/sns/) for SMS messaging.

#### **[Sentry](https://sentry.io/)**

-   Create a Sentry project and add the `SENTRY_DSN` to your environment file.

#### **Google Authentication**

-   Create a [Firebase Project](https://console.firebase.google.com/), if you don’t already have one.
-   Navigate to **APIs & Auth > Credentials** in the [Google Developers Console](https://console.cloud.google.com/) to obtain your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
-   Generate an _OAuth2 API v2_ ID token from the [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) for testing.

### 🔨 **Build**

```sh
yarn docker:build
```

### 🚀 **Run**

```sh
yarn docker:start
```

### 🛑 **Stop**

```sh
yarn docker:stop
```

### 🧪 **Test**

```sh
yarn test
```

## 🔄 **Database Migrations**

```sh
yarn sh
yarn db:migrate
```

## 🛠 **Create Default Application, Owner, Admin Role, & Permissions**

In Development:

```sh
yarn sh
yarn init:dev
```

In Production:

```sh
yarn init:app
```

## 💡 **Development**

### 📈 **Clients**

-   [Apollo Studio](http://localhost:4000/graphql) – Your GraphQL API playground.
-   [Prisma Studio](http://localhost:5555/) – Visualize and manage your data.

### 🌐 **Main Technologies**

-   [ExpressJS](https://expressjs.com/) – For web server logic.
-   [Apollo GraphQL](https://www.apollographql.com/docs/apollo-server/) – Your GraphQL server framework.
-   [PrismaORM](https://www.prisma.io/docs/getting-started/quickstart) – ORM for database management.
-   [Dotenv Vault](https://www.dotenv.org/docs/security/vault) – Secure management of environment variables.
-   [Email Templates](https://github.com/forwardemail/email-templates) – Email templates for various use cases.

### 📜 **GraphQL**

-   [Learn how Prisma handles the N+1 problem](https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance).
-   [Scalar Types](https://the-guild.dev/graphql/scalars/docs) for your APIs.

Run codegen after modifying the GraphQL schema to generate TypeScript definitions:

```sh
yarn codegen
```

### 📂 **File Upload**

We store information about uploaded files in the `File` table within the database. To ensure S3 objects are deleted when a related file row is removed, use the Prisma `delete` method.

Example:

```js
// NOT: This will not delete the picture in S3
prisma.update({
	where: {},
	data: {
		picture: {
			delete: true,
		},
	},
});

// DO: This will delete the file row and the corresponding object in S3
await prisma.file.delete({
	where: {
		key: '...',
		bucket: '...',
	},
});
```

### ⚠️ **Error Handling**

We use the ["Wrapping Exceptions"](https://javascript.info/custom-errors#wrapping-exceptions) technique to handle client-generated errors. This allows precise control over error types and easy translation before sending to end-users.

## 🚀 **Deployment**

### 🔐 **Secrets**

#### **[Dotenv Vault](https://www.dotenv.org/docs/quickstart#sync)**

Create your environment vault and authenticate:

```sh
npx dotenv-vault new
npx dotenv-vault login
```

Securely push the development `.env` file:

```sh
npx dotenv-vault push
```

Open the production environment to edit variables:

```sh
npx dotenv-vault open production
```

Build your project’s encrypted `.env.vault` file:

```sh
npx dotenv-vault build
```

Fetch your production decryption key (to be used in the next step):

```sh
npx dotenv-vault keys production
```

### CI/CD

#### **[DockerHub](https://hub.docker.com/)**

-   Generate and copy an access token for your [DockerHub account](https://hub.docker.com/settings/security).
-   Add the access token to your repo actions secrets as `DOCKER_HUB_ACCESS_TOKEN`.
-   Add your DockerHub username to your repo actions secrets as `DOCKER_HUB_USERNAME`.
-   Add your dotenv-vault decryption key to your repo actions secrets as `DOTENV_KEY`.

#### **[Render](https://dashboard.render.com/)**

##### **Database**

-   Create a new [PostgreSQL Database](https://dashboard.render.com/new/database).
-   Add the External Database URL to your repo actions secrets as `DATABASE_URL`.
-   Add the Internal Database URL to your vault’s production environment as `DATABASE_URL`.

##### **Cache**

-   Create a new [Redis Cache](https://dashboard.render.com/new/redis).
-   Add the Internal Redis URL to your vault’s production environment as `REDIS_URL`.

##### **Deploy**

-   Build your project’s encrypted `.env.vault` file:

```sh
npx dotenv-vault build
```

-   Commit and push changes to trigger the CI action.
-   Wait for the CI build to complete successfully.
-   Create a new [Web Service](https://dashboard.render.com/create?type=web) using the new image from DockerHub. (You might need to add your DockerHub access token to Render for private images).
-   Click the Advanced button and add your `DOTENV_KEY` environment variable.

---

## VSCode Extensions

-   [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
-   [Dotenv](https://marketplace.visualstudio.com/items?itemName=dotenv.dotenv-vscode)
-   [GraphQL Foundation](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)
-   [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Readings

-   [GraphQL Schema Design: Building Evolvable Schemas](https://www.apollographql.com/blog/backend/schema-design/graphql-building-evolvable-schemas/)

-   [Apollo Server File Upload Best Practices](https://www.apollographql.com/blog/backend/file-uploads/file-upload-best-practices/)

-   [Designing a GraphQL server for optimal performance](https://blog.logrocket.com/designing-graphql-server-optimal-performance/)

-   [GraphQL Cursors Connections Specification](https://relay.dev/graphql/connections.htm)

-   [TDD, Where Did It All Go Wrong - Ian Cooper](https://www.youtube.com/watch?v=EZ05e7EMOLM&list=TLPQMjIwMTIwMjJnzh0h4NGjEg&index=2)
