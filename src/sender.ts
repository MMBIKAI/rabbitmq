import amqp from "amqplib";

const sendMessage = async () => {
    try {
        const connection = await amqp.connect("amqp://rabbitmq");
        const channel = await connection.createChannel();
        const queue = "hello";

        await channel.assertQueue(queue, { durable: false });

        const message = "Hello, RabbitMQ from TypeScript!";
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(`✅ Sent: ${message}`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error("❌ Error sending message:", error);
    }
};

sendMessage();
