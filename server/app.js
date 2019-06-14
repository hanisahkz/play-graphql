const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

// Potentially environment variables
// Separate between prod and dev
const PORT_NUMBER = 3000;

const app = express();

// Create an endpoint that enables interactions with middleware that understands graphql i.e. graphqlHTTP
// this endpoint will be the kind of middleware
app.use('/graphql', graphqlHTTP({
    schema, //ES6 shorthand for => schema: schema
    graphiql: true
}));

app.listen(PORT_NUMBER, () => {
    console.log("Listening on port: " + PORT_NUMBER);
});
