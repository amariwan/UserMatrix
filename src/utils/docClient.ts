import { BatchWriteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

import client from "@/config/aws/dynamodb";

import logger from "./logger";

const TableName: string = process.env.AWS_DYNAMODB_TABLE!;

async function putItem(Item: Record<string, unknown>) {
  return client.send(
    new PutCommand({
      TableName,
      Item,
    }),
  );
}

const REQUESTS_PER_BATCH = 25;

async function putMany(items: Array<Record<string, unknown>>) {
  const batches = [];
  for (let i = 0; i < REQUESTS_PER_BATCH; i += REQUESTS_PER_BATCH) {
    batches.push(
      client.send(
        new BatchWriteCommand({
          RequestItems: {
            [TableName]: items.slice(i, i + REQUESTS_PER_BATCH).map((Item) => ({
              PutRequest: {
                Item,
              },
            })),
          },
        }),
      ),
    );
  }

  const result = await Promise.all(batches);
  logger.info({ result });
}

const query = async ({
  KeyConditionExpression,
  ExpressionAttributeValues,
  FilterExpression,
  Limit,
  IndexName,
  ExpressionAttributeNames,
  ConsistentRead,
  ScanIndexForward,
}: {
  KeyConditionExpression: string;
  FilterExpression?: string;
  ExpressionAttributeValues: Record<string, unknown>;
  ExpressionAttributeNames?: Record<string, string>;
  Limit?: number;
  IndexName?: string;
  ConsistentRead?: boolean;
  ScanIndexForward?: boolean;
}) =>
  client.send(
    new QueryCommand({
      TableName,
      KeyConditionExpression,
      ExpressionAttributeValues,
      ExpressionAttributeNames,
      FilterExpression,
      Limit,
      ConsistentRead,
      ScanIndexForward,
      IndexName,
    }),
  );

const docClient = {
  putItem,
  putMany,
  query,
};

export type DocClient = typeof docClient;

export default docClient;
