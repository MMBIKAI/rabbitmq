import amqp from "amqplib";

const receiveMessage = async () => {
    try {
        const connection = await amqp.connect("amqp://rabbitmq");
        const channel = await connection.createChannel();
        //const queue = "task_queue";
        const exchange = "logs"; //same exchange used in sender
        const severity = process.argv[2] ||"info"; // Listen for specific key

        //Declare the direct exchange
        await channel.assertExchange(exchange, "direct", { durable: false });

        //Create a temporary queue (it will be deleted when the consumer disconnects)
        const { queue } = await channel.assertQueue("", {exclusive: true})

        console.log(`📥 Waiting for messages of type: "${severity}"...`);

        channel.prefetch(1); //Ensure fair dispatch

        //Bind queue to exchange with the specific routing key
        await channel.bindQueue(queue, exchange, severity)

        channel.consume(queue, (msg) => {
            if (msg) {
                var secs = msg.content.toString().split('.').length-1;
                console.log(`📩 Received: ${secs}`);
            

            setTimeout(() => {
                console.log("DONE")
                channel.ack(msg); //send ack after processing
            }, secs * 1000);
        }
        }, { 
            noAck: false
         });

    } catch (error) {
        console.error("❌ Error receiving message:", error);
    }
};

receiveMessage();
