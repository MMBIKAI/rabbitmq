import amqp from "amqplib";

const sendMessage = async () => {
    try {
        const connection = await amqp.connect("amqp://rabbitmq");
        const channel = await connection.createChannel();
        //const queue = "task_queue";
        const exchange = "logs"; //name of the exchange

        const routingKey = process.argv[2] || "info.general"; // Topic key

        await channel.assertExchange(exchange, "topic", { durable: false });

        const message = process.argv.slice(3).join(' ') || "Hello, RabbitMQ from TypeScript!";
        //Publish message with a specifc topic key
        channel.publish(exchange, routingKey, Buffer.from(message), {
            persistent: true
        });
        console.log(`✅ Sent: [${routingKey}] ${message}`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error("❌ Error sending message:", error);
    }
};

sendMessage();
