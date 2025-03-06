//api-gateway (HTTP server and Rabbitmq client
import express from "express";
import amqp from "amqplib";
import { randomUUID } from "crypto";

const startApiGateway = async () => {
    try {
        const app = express();
        app.use(express.json());

        const connection = await amqp.connect("amqp://rabbitmq");
        const channel = await connection.createChannel();
        //const queue = "task_queue";
        const exchange = "rpc_exchange"; //name of the exchange

        const routingKey = "user_data_request";
        
        await channel.assertExchange(exchange, "direct", { durable: false });

        app.get("/user-data",async (req: any, res: any) => {
            const userId = req.query.userId as string;
            if (!userId) {
                return res.status(400).json({error: "Missing UserId"});
            }
        
            const correlationId = randomUUID();
            // Create a temporary reply queue
            const { queue: replyQueue } = await channel.assertQueue("", { exclusive: true });
        
            console.log(`📤 Sending request for userId: ${userId}`);
        
            // Listen for a response
            channel.consume(replyQueue, (msg) => {
                if (msg?.properties.correlationId === correlationId) {
                    console.log(`✅ Received RPC response: ${msg.content.toString()}`);
                    res.json(JSON.parse(msg.content.toString()));
                    channel.deleteQueue(replyQueue);
                }
            }, {
                noAck: true
            });
        
            channel.publish(exchange, routingKey, Buffer.from(userId), {
                correlationId,
                replyTo: replyQueue,
            });
        });
        
        app.listen(3000, () => console.log("🚀 API Gateway running on http://localhost:3000"))

    } catch (error) {
        console.error("❌ Error in API gateway:", error);
    }
};

startApiGateway().catch(console.error);
