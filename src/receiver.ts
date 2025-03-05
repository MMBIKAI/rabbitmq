import amqp from "amqplib";

const receiveMessage = async () => {
    try {
        const connection = await amqp.connect("amqp://rabbitmq");
        const channel = await connection.createChannel();
        const queue = "task_queue";

        await channel.assertQueue(queue, { durable: false });
        console.log("📥 Waiting for messages...");

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
