// Schema for graphql

const graphql = require('graphql');
const _ = require('lodash');

// Destructure to get specific functions from 'graphql'
// GraphQLString is a type String for schema. This declaration is specific to GraphQL
const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt
} = graphql;

// todo: Dummmy data. To be removed later
const bookList = [
    {id: '1', name: 'The Alchemist', genre: 'Fantasy'},
    {id: '2', name: 'Harry Potter', genre: 'Thriller'},
    {id: '3', name: 'The Alchemist', genre: 'Fiction'}
];

const authorList = [
    {id: '1', name: 'JK Rowling', age: '50'},
    {id: '2', name: 'Jodi Picoult', age: '35'},
    {id: '3', name: 'Paul Coelho', age: '44'}
];

// Schema has Book and Author
// Create schema for Book
const BookType = new GraphQLObjectType({
    // i) Declare table name. Name is important as it will be used as a reference
    name: 'Book',
    // ii) Declare field names using function. Perhaps, these are the fields that we are exposing?
    fields: () => ({
        //GraphQLID doesn't affect the object's type; it's just for GraphQL query to be flexible enough to be either 'string' or id (integer)
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString}
    })
});

// Create schema for Author
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt}
    })
});

// Define a RootQuery and pass an object inside
// can a root query define multiple object type (i.e. not limited to just BookType)
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    // Each field will be a type of Root Query. Root Query can be getting all bookList, all authors, a single book etc.
    fields: {
        // Name of the query. This naming is important. This will be name of GraphQL query
        book: {
            // type of data to be queried
            type: BookType,
            // argument to be passed in GraphQL query
            args: {
                id: {
                    type: GraphQLID
                }
            },
            // resolve function being used to find the data
            resolve(parent, args) {
                // fetch data from database
                // todo: need to get used to reading the API
                //finding book from bookList collection, spinned and coode
                return _.find(bookList, {id: args.id});
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return _.find(authorList, {id: args.id});
            }
        }

    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});