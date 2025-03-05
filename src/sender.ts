import amqp from "amqplib";

const sendMessage = async () => {
    try {
        const connection = await amqp.connect("amqp://rabbitmq");
        const channel = await connection.createChannel();
        //const queue = "task_queue";
        const exchange = "logs"; //name of the exchange

        await channel.assertExchange(exchange, "fanout", { durable: false });

        const message = process.argv.slice(2).join('') || "Hello, RabbitMQ from TypeScript!";
        //send message to the exchange
        channel.publish(exchange, "", Buffer.from(message), {
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
