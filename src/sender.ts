import amqp from "amqplib";

const sendMessage = async () => {
    try {
        const connection = await amqp.connect("amqp://rabbitmq");
        const channel = await connection.createChannel();
        const queue = "task_queue";

        await channel.assertQueue(queue, { durable: false });

        const message = process.argv.slice(2).join('') || "Hello, RabbitMQ from TypeScript!";
        channel.sendToQueue(queue, Buffer.from(message), {
            persistent: true
        });
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
