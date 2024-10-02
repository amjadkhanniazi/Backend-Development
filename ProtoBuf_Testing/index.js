const express = require('express');
const protobuf = require('protobufjs');
const app = express();

// Load the protobuf schema
protobuf.load("message.proto", (err, root) => {
  if (err) throw err;

  // Get the message type
  const ResponseMessage = root.lookupType("ResponseMessage");

  // GET API using Protobuf
  app.get('/protobuf', (req, res) => {
    // Create a payload to send
    const payload = { message: "Hello, Protobuf! kljsdfo;isndvcs;lkdyfhNAVKH;hagdlf;diuygre;" };

    // Verify the payload matches the message format
    const errMsg = ResponseMessage.verify(payload);
    if (errMsg) throw Error(errMsg);

    // Create the message (encoding)
    const message = ResponseMessage.create(payload);

    // Serialize the message to binary format
    const buffer = ResponseMessage.encode(message).finish();

    // Set response headers for Protobuf
    res.set('Content-Type', 'application/x-protobuf');
    
    // Send the serialized message
    res.send(buffer);
  });

  // Start the server
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
});
