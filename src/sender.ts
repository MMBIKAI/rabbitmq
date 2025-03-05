import amqp from "amqplib";

const sendMessage = async () => {
    try {
        const connection = await amqp.connect("amqp://rabbitmq");
        const channel = await connection.createChannel();
        //const queue = "task_queue";
        const exchange = "logs"; //name of the exchange

        const severity = process.argv[2] || "info"; //Routing Key (e.g., 'info', 'error')

        await channel.assertExchange(exchange, "direct", { durable: false });

        const message = process.argv.slice(3).join(' ') || "Hello, RabbitMQ from TypeScript!";
        //Publish message with a specifc routing key
        channel.publish(exchange, severity, Buffer.from(message), {
            persistent: true
        });
        console.log(`✅ Sent: [${severity}] ${message}`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error("❌ Error sending message:", error);
    }
};

sendMessage();
