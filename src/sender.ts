import amqp from "amqplib";
import { randomUUID } from "crypto";

const sendRPCRequest = async () => {
    try {
        const connection = await amqp.connect("amqp://rabbitmq");
        const channel = await connection.createChannel();
        //const queue = "task_queue";
        const exchange = "rpc_exchange"; //name of the exchange

        const routingKey = "rpc_task"; // Topic key
        
        await channel.assertExchange(exchange, "direct", { durable: false });
        
        //Create a temporary reply queue
        const { queue: replyQueue } = await channel.assertQueue("", { exclusive: true });

        const correlationId = randomUUID();
        const message = process.argv[2] || "10"; //default request: 10

        //listen for response
        channel.consume(replyQueue, (msg) =>{
            if (msg?.properties.correlationId === correlationId) {
                console.log(`✅ Received RPC response: ${msg.content.toString()}`);
                connection.close();
                process.exit(0);
            }
        },{
            noAck: true
        });

        //Publish message (send request)
        channel.publish(exchange, routingKey, Buffer.from(message), {
            correlationId,
            replyTo: replyQueue,
        });
        console.log(`✅ Sent: [${routingKey}] ${message}`);

        /*setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);*/
    } catch (error) {
        console.error("❌ Error in RPC client:", error);
    }
};

sendRPCRequest();
