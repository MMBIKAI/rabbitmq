import amqp from "amqplib";

const receiveMessage = async () => {
    try {
        const connection = await amqp.connect("amqp://rabbitmq");
        const channel = await connection.createChannel();
        //const queue = "task_queue";
        const exchange = "logs"; //same exchange used in sender
        const topicPattern = process.argv[2] || "#"; // Patternfor filtering topics

        //Declare the direct exchange
        await channel.assertExchange(exchange, "topic", { durable: false });

        //Create a temporary queue (it will be deleted when the consumer disconnects)
        const { queue } = await channel.assertQueue("", {exclusive: true})

        console.log(`📥 Waiting for messages of type: "${topicPattern}"...`);

        channel.prefetch(1); //Ensure fair dispatch

        //Bind queue to exchange with the specific routing key
        await channel.bindQueue(queue, exchange, topicPattern)

        channel.consume(queue, (msg) => {
            if (msg) {
               // var secs = msg.content.toString().split('.').length-1;
                console.log(`📩 Received [${msg.fields.routingKey}]: ${msg.content.toString()}`);
            
                channel.ack(msg); //send ack after processing
           /* setTimeout(() => {
                console.log("DONE")
                channel.ack(msg); //send ack after processing
            }, secs * 1000);*/
        }
        }, { 
            noAck: false
         });

    } catch (error) {
        console.error("❌ Error receiving message:", error);
    }
};

receiveMessage();
