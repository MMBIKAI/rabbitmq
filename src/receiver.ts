//user-service.ts (Microservice worker)
import amqp from "amqplib";

const startUserService = async () => {
    try {
        const connection = await amqp.connect("amqp://rabbitmq");
        const channel = await connection.createChannel();
        //const queue = "task_queue";
        const exchange = "rpc_exchange"; //same exchange used in sender
        const routingKey = "user_data_request";
        //const topicPattern = process.argv[2] || "#"; // Patternfor filtering topics

        //Declare the direct exchange
        await channel.assertExchange(exchange, "direct", { durable: false });

        //Create a temporary queue (it will be deleted when the consumer disconnects) for the sever to listen for tasks
        const { queue } = await channel.assertQueue("", {exclusive: true});
        await channel.bindQueue(queue, exchange, routingKey);

        console.log("🔹 User Service waiting for requests...");

        channel.prefetch(1); //Ensure fair dispatch

        channel.consume(queue, async (msg) => {
            if (msg) {
                const userId = msg.content.toString();
                console.log(`📥 Processing userId: ${userId}`);

                // Simulate fetching user data
                const userData = { userId, name: "John Doe", email: "john@example.com" };

                channel.sendToQueue(
                    msg.properties.replyTo,
                    Buffer.from(JSON.stringify(userData)),
                    { correlationId: msg.properties.correlationId }
                );

                channel.ack(msg); //send ack after processing

               // var secs = msg.content.toString().split('.').length-1;
              /*  console.log(`📩 Received [${msg.fields.routingKey}]: ${msg.content.toString()}`);
            
                channel.ack(msg); //send ack after processing
             setTimeout(() => {
                console.log("DONE")
                channel.ack(msg); //send ack after processing
            }, secs * 1000);*/
        }
        }, { 
            noAck: false
         });

    } catch (error) {
        console.error("❌ Error in RPC Server:", error);
    }
};

startUserService().catch(console.error);
