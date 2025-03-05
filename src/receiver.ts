import amqp from "amqplib";

const receiveMessage = async () => {
    try {
        const connection = await amqp.connect("amqp://rabbitmq");
        const channel = await connection.createChannel();
        const queue = "hello";

        await channel.assertQueue(queue, { durable: false });
        console.log("📥 Waiting for messages...");

        channel.consume(queue, (msg) => {
            if (msg) {
                console.log(`📩 Received: ${msg.content.toString()}`);
            }
        }, { noAck: true });

    } catch (error) {
        console.error("❌ Error receiving message:", error);
    }
};

receiveMessage();
